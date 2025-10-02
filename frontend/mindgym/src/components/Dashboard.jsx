import {React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { FaBell } from 'react-icons/fa';
import PodcastPlayer from './PodcastPlayer'; // <-- 1. IMPORT THE NEW COMPONENT

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, value, label }) => (
    <div style={{ backgroundColor: '#1E1E1E', borderRadius: '15px', padding: '20px', textAlign: 'center', color: 'white', flex: 1, margin: '0 5px' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
        <div>{value} {label}</div>
    </div>
);

const DailyProgressCircle = ({ day, isCompleted, isToday }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{
            width: '25px', height: '25px', borderRadius: '50%',
            backgroundColor: isCompleted ? '#4DD0E1' : '#E0E0E0',
            border: isToday ? '3px solid #333' : 'none',
            boxSizing: 'border-box',
            marginBottom: '5px'
        }}></div>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: isToday ? 'bold' : 'normal' }}>{day}</p>
    </div>
);

// --- UPDATED TaskCardWithImage Component ---
const TaskCardWithImage = ({ task, illustration, color, textColor, isDone }) => (
    <div style={{ flex: 1, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '15px' }}>
        <div style={{
            backgroundColor: color,
            color: textColor, // Use the new dark text color
            padding: '12px',
            borderRadius: '15px 15px 0 0',
            fontWeight: 'bold',
            textAlign: 'center', // Center the text
            fontSize: '14px', // Slightly larger font
        }}>
            {task.name} {isDone && '✅'}
        </div>
        <div style={{ backgroundColor: '#FAFAFA', padding: '10px', borderRadius: '0 0 15px 15px' }}>
            <img src={illustration} alt={task.name} style={{ width: '80%', display: 'block', margin: '10px auto' }} />
            <div style={{
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                paddingTop: '10px', borderTop: '1px solid #eee', color: '#757575'
            }}>
                <span style={{ fontSize: '12px' }}>🕒 {task.duration}</span>
                <span style={{ fontSize: '12px' }}>✪ {task.points} Points</span>
            </div>
        </div>
    </div>
);


const isTaskCompletedToday = (user, taskType) => {
    if (!user?.dailyTasks?.[taskType]) return false;
    const lastCompletionDate = new Date(user.dailyTasks[taskType]);
    const today = new Date();
    return lastCompletionDate.getFullYear() === today.getFullYear() &&
           lastCompletionDate.getMonth() === today.getMonth() &&
           lastCompletionDate.getDate() === today.getDate();
};

const Dashboard = () => {
    const { user, loading: authLoading, updateUserState } = useAuth();
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    useEffect(() => {
        api.get('/activities')
            .then(res => setActivities(res.data))
            .catch(err => toast.error("Could not load tasks."))
            .finally(() => setActivitiesLoading(false));
    }, []);

    const handleTaskComplete = async (taskType, points) => {
        const promise = api.post('/tasks/complete', { taskType });
        toast.promise(promise, {
            loading: 'Updating your stats...',
            success: (res) => {
                updateUserState(res.data);
                return `Great job! You earned ${points || 45} points.`;
            },
            error: (err) => err.response?.data?.msg || 'Something went wrong.',
        });
    };

    if (authLoading || activitiesLoading) {
        return <div>Loading your personalized dashboard...</div>;
    }

    const mentalTask = activities.find(a => a.name === user.preferences?.preferredMental) || activities.find(a => a.type === 'Mental');
    const physicalTask = activities.find(a => a.name === user.preferences?.preferredPhysical) || activities.find(a => a.type === 'Physical');
    const isJournalDone = isTaskCompletedToday(user, 'Journal');
    
    const week = [{day: 'F'}, {day: 'T'}, {day: 'W', done: true}, {day: 'T', done: true}, {day: 'M', done: true}, {day: 'S', done: true}, {day: 'S', done: true}];

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', padding: '20px' }}>
            {/* ====== HEADER ====== */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800' }}>Hi, {user.username}</h1>
                <FaBell size={24} color="#333" />
            </header>

            {/* ====== BINGO CARD ====== */}
            <div style={{ backgroundColor: '#D6EAF8', borderRadius: '15px', padding: '15px', marginBottom: '30px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#1A5276' }}>Bingo!!! You are ahead of 52% users!!</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#1A5276', lineHeight: '1.5' }}>
                    Every small step counts—track it, celebrate it, and watch yourself grow stronger every day.
                </p>
            </div>

            {/* ====== STATS SECTION ====== */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '18px' }}>Your stats</h2>
                    <Link to="/profile" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>View all</Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                    <Link to="/rewards" style={{ textDecoration: 'none', flex: 1 }}>
                        <StatCard icon="⭐" value={user.points} label="Points" />
                    </Link>
                    <StatCard icon="🔥" value={user.streak} label="Streaks" />
                </div>
            </section>

            {/* ====== DAILY PROGRESS TRACKER ====== */}
            <section style={{ display: 'flex', justifyContent: 'space-between', margin: '30px 0' }}>
                {week.map((item, index) => (
                    <DailyProgressCircle key={index} day={item.day} isCompleted={item.done} />
                ))}
                <DailyProgressCircle day="Today" isToday={true} />
            </section>

            {/* ====== TODAY'S TASKS ====== */}
            <section>
                <h2 style={{ margin: 0, fontSize: '18px', marginBottom: '15px' }}>Today's <span style={{ fontWeight: 'bold' }}>TASKS</span></h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px' }}>
                    {mentalTask && (
                        <button 
                            onClick={() => handleTaskComplete(mentalTask.name, mentalTask.points)} 
                            disabled={isTaskCompletedToday(user, mentalTask.name)}
                            style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer', flex: 1}}
                        >
                            <TaskCardWithImage
                                task={mentalTask}
                                illustration="/images/meditation-illustration.png"
                                color="#FDE0E0"
                                textColor="#C62828" // Dark red for high contrast
                                isDone={isTaskCompletedToday(user, mentalTask.name)}
                            />
                        </button>
                    )}
                    {physicalTask && (
                        <button 
                            onClick={() => handleTaskComplete(physicalTask.name, physicalTask.points)} 
                            disabled={isTaskCompletedToday(user, physicalTask.name)}
                            style={{border: 'none', background: 'none', padding: 0, cursor: 'pointer', flex: 1}}
                        >
                            <TaskCardWithImage
                                task={physicalTask}
                                illustration="/images/jogging-illustration.png"
                                color="#E0F2F1"
                                textColor="#00695C" // Dark green/teal for high contrast
                                isDone={isTaskCompletedToday(user, physicalTask.name)}
                            />
                        </button>
                    )}
                </div>

                <Link to="/journal" style={{ textDecoration: 'none', display: 'block', marginTop: '15px', pointerEvents: isJournalDone ? 'none' : 'auto' }}>
                    <div style={{
                        backgroundColor: '#1DE9B6', borderRadius: '15px', padding: '15px',
                        display: 'flex', alignItems: 'center', gap: '15px', color: '#004D40',
                    }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '10px' }}>✏️</div>
                        <div style={{ flexGrow: 1 }}>
                            <p style={{ margin: 0, fontSize: '12px' }}>Record your thoughts!!!</p>
                            <h3 style={{ margin: '2px 0 0 0' }}>JOURNAL {isJournalDone && "✅"}</h3>
                        </div>
                        <span style={{ fontWeight: 'bold' }}>✪ 45 Points</span>
                    </div>
                </Link>
            </section>
             {/* ====== PODCAST PLAYER ====== */}
            <PodcastPlayer /> {/* <-- 2. RENDER THE COMPONENT HERE */}
        </div>
    );
};

export default Dashboard;