import React from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { REWARDS_LIST } from '../constants.js'; // Import the rewards list

const RewardsPage = () => {
  const { user, updateUserState } = useAuth();

  if (!user) return <div>Loading...</div>;

  const handleClaimReward = async (reward) => {
    // Client-side check for immediate feedback
    if (user.points < reward.cost) {
      toast.error("You don't have enough points for this reward.");
      return;
    }

    const promise = api.post('/users/rewards/claim', { rewardName: reward.name });

    toast.promise(promise, {
      loading: 'Claiming your reward...',
      success: (res) => {
        updateUserState(res.data); // Update global user state
        return `Successfully claimed "${reward.name}"!`;
      },
      error: (err) => err.response?.data?.msg || 'Something went wrong.',
    });
  };

  const userRewardNames = user.rewards.map(r => r.name);

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            {/* Total Points Display */}
            <div style={{ position: 'relative', textAlign: 'center', margin: '20px 0 50px 0' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '200px', height: '200px', backgroundColor: '#E0F2F1', borderRadius: '50%',
                    filter: 'blur(30px)', zIndex: -1
                }}></div>
                <p style={{ margin: 0, color: '#555' }}>Total Points</p>
                <h1 style={{ margin: 0, fontSize: '80px', fontWeight: '800' }}>{user.points}</h1>
            </div>

            {/* Reward List */}
            <h2>Reward Lists</h2>
            <div>
                {REWARDS_LIST.map(reward => {
                    const isClaimed = userRewardNames.includes(reward.name);
                    // Placeholder for logo
                    const logo = reward.name.includes('Starbucks') ? '/images/starbucks-logo.png' : '/images/strive-logo.png';
                    return (
                        <RewardCard key={reward.name} reward={reward} isClaimed={isClaimed} logo={logo} onClaim={handleClaimReward} />
                    );
                })}
            </div>
        </div>
    );
};

const RewardCard = ({ reward, isClaimed, logo, onClaim }) => (
    <div style={{
        backgroundColor: '#E0F7FA', borderRadius: '15px', padding: '20px',
        marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px',
        opacity: isClaimed ? 0.6 : 1
    }}>
        <img src={logo} alt="logo" style={{ width: '50px', height: '50px' }} />
        <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: 0 }}>{reward.description}</h3>
            {!isClaimed ? (
                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Ends on 31 Dec 2025</p>
            ) : (
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>CLAIMED</p>
            )}
        </div>
        {!isClaimed && (
            <button
                onClick={() => onClaim(reward)}
                style={{
                    backgroundColor: '#263238', color: 'white', border: 'none',
                    borderRadius: '10px', padding: '10px 15px', fontWeight: 'bold'
                }}
            >{reward.cost} Points</button>
        )}
    </div>
);

export default RewardsPage;