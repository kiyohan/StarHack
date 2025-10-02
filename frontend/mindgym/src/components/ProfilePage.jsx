import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Import Link for back navigation

const ProfilePage = () => {
  const { user, updateUserState, logout } = useAuth();
  
  const [activities, setActivities] = useState([]);
  const [mentalSelection, setMentalSelection] = useState('');
  const [physicalSelection, setPhysicalSelection] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/activities');
        setActivities(res.data);
      } catch (err) {
        toast.error("Could not load activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    if (user && activities.length > 0) {
      setMentalSelection(user.preferences.preferredMental || '');
      setPhysicalSelection(user.preferences.preferredPhysical || '');
    }
  }, [user, activities]);

  const handleSave = () => {
    const promise = api.put('/users/preferences', {
      preferredMental: mentalSelection,
      preferredPhysical: physicalSelection,
    });

    toast.promise(promise, {
      loading: 'Saving preferences...',
      success: (res) => {
        updateUserState(res.data);
        return 'Preferences saved successfully!';
      },
      error: 'Failed to save preferences.',
    });
  };

  if (loading || !user) return <div>Loading profile...</div>;

  const mentalActivities = activities.filter(a => a.type === 'Mental');
  const physicalActivities = activities.filter(a => a.type === 'Physical');

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Profile</h1>
      <h3>Hi, {user.username}!</h3>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Choose Your Daily Tasks</h2>
        <p>Select your preferred activities to see on your dashboard.</p>

        <div style={{ marginBottom: '20px' }}>
          <label>Preferred Mental Task:</label>
          <select value={mentalSelection} onChange={(e) => setMentalSelection(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="" disabled>Select a task</option>
            {mentalActivities.map(activity => (
              <option key={activity._id} value={activity.name}>{activity.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Preferred Physical Task:</label>
          <select value={physicalSelection} onChange={(e) => setPhysicalSelection(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="" disabled>Select a task</option>
            {physicalActivities.map(activity => (
              <option key={activity._id} value={activity.name}>{activity.name}</option>
            ))}
          </select>
        </div>
        
        <button onClick={handleSave}>Save Preferences</button>
      </div>

      <div style={{ marginTop: '50px' }}>
          <button onClick={logout} style={{ backgroundColor: '#aa2e25', color: 'white' }}>Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;