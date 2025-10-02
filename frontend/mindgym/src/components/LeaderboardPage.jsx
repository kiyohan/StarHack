import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { IoArrowBack } from 'react-icons/io5';
import { FaUserCircle, FaCrown } from 'react-icons/fa'; // User and Crown icons

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/users/leaderboard');
                setLeaderboard(res.data);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div>Loading leaderboard...</div>;

    // --- UPDATED: Slice for a 3-person podium ---
    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* ====== HEADER ====== */}
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <Link to="/community" style={{ color: 'black', fontSize: '28px' }}>
                    <IoArrowBack />
                </Link>
                <h1 style={{ margin: '0 auto', fontSize: '24px', fontWeight: 'bold' }}>Leaderboard</h1>
            </header>

            {/* ====== TOP 3 PODIUM ====== */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '15px', marginBottom: '40px' }}>
                {/* 2nd Place */}
                {topThree[1] && <PodiumUser user={topThree[1]} rank={2} />}
                
                {/* 1st Place */}
                {topThree[0] && <PodiumUser user={topThree[0]} rank={1} />}

                {/* 3rd Place */}
                {topThree[2] && <PodiumUser user={topThree[2]} rank={3} />}
            </div>
            
            {/* ====== REST OF THE LIST ====== */}
            <div style={{ backgroundColor: '#F8F9FA', borderRadius: '20px', padding: '10px' }}>
                {rest.map((player, index) => (
                    // --- UPDATED: Rank calculation now starts from 4 ---
                    <RankItem key={player._id} user={player} rank={index + 4} isCurrentUser={player.username === user.username} />
                ))}
            </div>
        </div>
    );
};

// --- UPDATED: PodiumUser component now handles the crown internally ---
const PodiumUser = ({ user, rank }) => (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {rank === 1 && <FaCrown size={30} color="#FFD700" style={{ marginBottom: '-10px', zIndex: 1 }} />}
        <div style={{ position: 'relative' }}>
            {/* Rank 1 is larger, ranks 2 and 3 are smaller */}
            <FaUserCircle size={rank === 1 ? 100 : 80} color="#E0E0E0" />
            <div style={{
                position: 'absolute', bottom: 5, right: 5,
                backgroundColor: '#333', color: 'white', borderRadius: '50%',
                width: '25px', height: '25px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 'bold', border: '2px solid white'
            }}>
                {rank}
            </div>
        </div>
        <h3 style={{ margin: '10px 0 2px 0', fontWeight: 'bold', fontSize: '16px' }}>{user.username}</h3>
        <p style={{ margin: 0, color: '#0097A7', fontWeight: '500', fontSize: '14px' }}>{user.streak} Streaks</p>
    </div>
);

// Helper component for the list items from rank 4 onwards
const RankItem = ({ user, rank, isCurrentUser }) => (
    <div style={{
        display: 'flex', alignItems: 'center', padding: '12px',
        backgroundColor: isCurrentUser ? '#E0F2F1' : 'white',
        borderRadius: '15px', marginBottom: '10px',
        boxShadow: isCurrentUser ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
    }}>
        <span style={{ fontWeight: 'bold', marginRight: '15px', color: '#616161', width: '20px' }}>{rank}</span>
        <FaUserCircle size={40} color="#BDBDBD" style={{ marginRight: '15px' }} />
        <span style={{ flexGrow: 1, fontWeight: '500' }}>{isCurrentUser ? 'You' : user.username}</span>
        <span style={{ fontWeight: 'bold', color: '#00796B' }}>{user.streak} Streaks</span>
    </div>
);

export default LeaderboardPage;