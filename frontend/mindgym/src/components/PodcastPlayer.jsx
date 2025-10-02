import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';

// --- Hard-coded list of available podcasts ---
const podcasts = [
    {
        title: 'Daily Motivation Mix',
        artist: 'MindGym Studios',
        src: '/podcasts/motivation-mix.mp3',
    },
    {
        title: 'Mindful Moments',
        artist: 'Zen Zone',
        src: '/podcasts/mindful-moments.mp3',
    },
];

const PodcastPlayer = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(new Audio(podcasts[currentTrackIndex].src));
    const intervalRef = useRef();

    const currentTrack = podcasts[currentTrackIndex];

    const startTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }, 1000);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
            clearInterval(intervalRef.current);
        } else {
            audioRef.current.play();
            startTimer();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        const newIndex = (currentTrackIndex + 1) % podcasts.length;
        setCurrentTrackIndex(newIndex);
    };

    const prevTrack = () => {
        const newIndex = (currentTrackIndex - 1 + podcasts.length) % podcasts.length;
        setCurrentTrackIndex(newIndex);
    };

    // Effect to handle track changes
    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(podcasts[currentTrackIndex].src);
        setProgress(0);
        if (isPlaying) {
            audioRef.current.play();
            startTimer();
        }
    }, [currentTrackIndex]);


    return (
        <section style={{ marginTop: '30px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Motivation <span style={{ fontWeight: 'bold' }}>TODAY</span></h2>
            <div style={{
                backgroundColor: '#7E57C2', borderRadius: '20px', padding: '20px',
                color: 'white', marginTop: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Tired?? Listen the below</p>
                <h3 style={{ margin: '5px 0 15px 0', fontSize: '20px' }}>{currentTrack.title}</h3>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{currentTrack.artist}</p>

                {/* Progress Bar */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '5px', height: '6px', marginTop: '20px' }}>
                    <div style={{ width: `${progress}%`, backgroundColor: '#FFEB3B', height: '100%', borderRadius: '5px' }}></div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', gap: '30px' }}>
                    <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
                        <FaBackward />
                    </button>
                    <button onClick={togglePlayPause} style={{
                        background: '#FFC107', border: 'none', borderRadius: '50%',
                        width: '60px', height: '60px', fontSize: '24px',
                        color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
                        <FaForward />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PodcastPlayer;