import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx'; // Import the new global layout
import Dashboard from './components/Dashboard.jsx'; // We'll now import Dashboard directly
import Chatbot from './components/Chatbot.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import JournalPage from './components/JournalPage.jsx';
import CommunityPage from './components/CommunityPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import RewardsPage from './components/RewardsPage.jsx';
import LeaderboardPage from './components/LeaderboardPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes now use the Layout component */}
        <Route 
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;