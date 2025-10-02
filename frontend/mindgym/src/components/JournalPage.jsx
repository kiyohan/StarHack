import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';

const isTaskCompletedToday = (user, taskType) => {
    if (!user?.dailyTasks?.[taskType]) return false;
    const lastCompletionDate = new Date(user.dailyTasks[taskType]);
    const today = new Date();
    return lastCompletionDate.getFullYear() === today.getFullYear() &&
           lastCompletionDate.getMonth() === today.getMonth() &&
           lastCompletionDate.getDate() === today.getDate();
};

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, updateUserState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJournalDone, setIsJournalDone] = useState(false);

  useEffect(() => {
    if (user) {
        setIsJournalDone(isTaskCompletedToday(user, 'Journal'));
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/journal');
      setEntries(res.data);
    } catch (err) {
      toast.error("Could not load past entries.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isJournalDone) {
      toast.error("You've already completed your journal task for today!");
      return;
    }
    if (newContent.trim() === '') return;

    setIsSubmitting(true);
    try {
      // --- THE FIX: Make only ONE atomic API call ---
      const res = await api.post('/journal', { content: newContent });
      
      const { updatedUser, newEntry } = res.data;

      // Update global state with the fresh user object from the API response
      updateUserState(updatedUser);
      
      // Manually add the new entry to the local list for instant UI update
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      
      // Manually set the local "done" state to lock the form
      setIsJournalDone(true);
      
      toast.success('Journal entry saved and task completed!');
      setNewContent('');

    } catch (err) {
      console.error('Failed to save journal entry:', err);
      toast.error(err.response?.data?.msg || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <div>Loading your journal...</div>;

  return (
    <div style={{ backgroundColor: '#E0F2F1', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Link to="/" style={{ color: 'black', fontSize: '24px' }}><IoArrowBack /></Link>
            <h1 style={{ margin: '0 auto' }}>My Journal</h1>
        </header>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`Date: ${new Date().toLocaleDateString()}\n\nToday was a whirlwind...`}
                style={{
                    flexGrow: 1, backgroundColor: 'transparent', border: 'none', outline: 'none',
                    fontSize: '18px', lineHeight: '1.8', color: '#004D40', resize: 'none',
                    marginTop: '20px', marginBottom: '20px'
                }}
                disabled={isJournalDone || isSubmitting}
            />
            <button
                type="submit"
                disabled={isJournalDone || isSubmitting}
                style={{
                    padding: '15px', borderRadius: '25px', border: 'none',
                    backgroundColor: '#263238', color: 'white', fontSize: '16px', fontWeight: 'bold',
                    cursor: 'pointer', opacity: (isJournalDone || isSubmitting) ? 0.6 : 1
                }}>
                {isSubmitting ? 'Posting...' : (isJournalDone ? 'Task Completed ✅' : 'Post & Complete Task')}
            </button>
        </form>

        <div style={{ marginTop: '40px' }}>
            <h2>Past Entries</h2>
            {entries.length === 0 ? (<p>You have no journal entries yet.</p>) : (
                entries.map(entry => (
                    <div key={entry._id} style={{ border: '1px solid #B2DFDB', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#00796B' }}>{new Date(entry.createdAt).toLocaleString()}</p>
                        <ReactMarkdown>{entry.content}</ReactMarkdown>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default JournalPage;