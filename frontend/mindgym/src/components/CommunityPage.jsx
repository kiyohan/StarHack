import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import icons

const CommunityPage = () => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const feedRes = await api.get('/journal/community');
                setFeed(feedRes.data);
            } catch (err) { console.error("Failed to fetch community data", err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleUpvote = async (entryId) => {
        try {
            const res = await api.put(`/journal/upvote/${entryId}`);
            setFeed(feed.map(entry => entry._id === entryId ? { ...entry, upvotes: res.data.upvotes } : entry));
        } catch (err) { console.error("Failed to upvote", err); }
    };

    if (loading) return <div>Loading community feed...</div>;

    return (
        <div style={{ backgroundColor: '#E0F2F1', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: 'auto' }}>
                <Link to="/leaderboard">
                    <button style={{
                        width: '100%', padding: '15px', borderRadius: '25px', border: 'none',
                        backgroundColor: '#263238', color: 'white', fontSize: '16px', fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', marginBottom: '20px'
                    }}>View Leaderboard</button>
                </Link>

                <h1 style={{ textAlign: 'center', color: '#004D40' }}>Lets READ.......</h1>

                {feed.map(entry => (
                    <div key={entry._id} style={{
                        backgroundColor: 'white', borderRadius: '15px', padding: '20px',
                        marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                    }}>
                        {/* <h3 style={{ margin: '0 0 10px 0', color: '#004D40' }}>A Hectic day</h3> */}
                        <ReactMarkdown components={{ p: props => <p {...props} style={{ margin: 0, color: '#37474F', lineHeight: '1.6' }} /> }}>
                            {entry.content}
                        </ReactMarkdown>
                        <div
                            onClick={() => handleUpvote(entry._id)}
                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '15px', color: '#E53935' }}
                        >
                            {entry.upvotes.includes(user._id) ? <FaHeart /> : <FaRegHeart />}
                            <span style={{ marginLeft: '8px', fontWeight: '500' }}>{entry.upvotes.length} Likes</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;