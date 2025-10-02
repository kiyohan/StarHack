import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const BottomNav = () => (
    <nav style={{
        position: 'fixed', // <-- Makes the bar fixed to the viewport
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        zIndex: 1000, // Ensures it's on top of other content
    }}>
        <Link to="/" style={{ fontSize: '28px', color: '#333', textDecoration: 'none' }}>🏠</Link>
        <Link to="/community" style={{ fontSize: '28px', color: '#333', textDecoration: 'none' }}>👥</Link>
        <Link to="/chat" style={{ fontSize: '28px', color: '#333', textDecoration: 'none' }}>💬</Link>
        <Link to="/profile" style={{ fontSize: '28px', color: '#333', textDecoration: 'none' }}>👤</Link>
    </nav>
);

const Layout = () => {
  return (
    <div style={{ paddingBottom: '80px' /* <-- Creates space for the nav bar */ }}>
      <Outlet /> {/* <-- This is where the routed page component will be rendered */}
      <BottomNav />
    </div>
  );
};

export default Layout;