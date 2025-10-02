# YouMatter Gamification Wellness Platform

 <!-- Replace with a real screenshot of your app's dashboard -->

**YouMatter Gamification** is a full-stack MERN application designed as an innovative wellness platform. It empowers users to improve their mental and physical health through a comprehensive suite of gamified features, including daily tasks, journaling, a supportive community, and an AI emotional companion. This project was developed to address the **YouMatter Gamification Challenge**, focusing on **Track 1: Behavioural Psychology Integration**.

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Psychological Principles](#psychological-principles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Future Roadmap](#future-roadmap)


## Features

- **Personalized Dashboard:** A dynamic home screen displaying user stats, streaks, and personalized daily mental & physical tasks.
- **Points & Rewards System:** Earn points for completing tasks and redeem them for unique in-app rewards.
- **Daily Streaks & Leaderboard:** Maintain a daily streak to climb the competitive leaderboard, fostering consistent engagement.
- **Anonymous Community Feed:** Share journal entries anonymously and receive support from the community through an upvote system.
- **AI Emotional Companion:** An integrated chatbot powered by the Google Gemini API to provide a supportive and non-judgmental conversational partner.
- **Dynamic Task System:** Users can set their preferred activities on their profile page, and the dashboard adapts to show them what they enjoy most.
- **Journaling:** A private and secure space for users to record their thoughts and feelings, with the option to share anonymously.
- **Motivational Podcasts:** A built-in audio player on the dashboard to provide users with a quick dose of motivation.

## Psychological Principles (Track 1)

This project is built on a foundation of behavioral psychology to maximize user engagement and promote genuine habit formation.

- **The Habit Loop (Cue-Routine-Reward):** The dashboard provides a clear **cue** (daily tasks), a simple **routine** (completing the tasks), and an immediate **reward** (points, streak updates, and positive feedback), reinforcing the behavior.
- **Progressive Achievement:** The points and streak system provides a clear sense of progression, motivating users to continue their journey.
- **Social Proof & Accountability:** The anonymous community feed and leaderboard create a sense of belonging and healthy competition, making users feel part of a collective wellness effort.
- **Dopamine & Micro-Rewards:** Instant feedback through toast notifications and stat updates provides small dopamine hits, reinforcing positive actions.
- **Cognitive Behavioural Techniques (CBT):** The journaling feature is a simplified form of a thought record, a core CBT exercise for improving mental clarity and well-being.

## Tech Stack

### Frontend
- **React.js (v18+)** with Vite
- **React Router** for page navigation
- **React Context API** for global state management (Authentication & User Data)
- **Axios** for making API requests
- **`react-hot-toast`** for sleek, non-disruptive notifications
- **`react-icons`** for a clean and professional icon set
- **`react-markdown`** for rendering formatted text

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** for database modeling
- **JSON Web Tokens (JWT)** for secure user authentication
- **bcrypt.js** for password hashing
- **Google Gemini API** for the AI Chatbot

## Project Structure

```
.
├── backend/
│   ├── models/         # Mongoose schemas (User, Task, etc.)
│   ├── routes/         # API route definitions
│   ├── constants.js    # Shared constants
│   └── server.js       # Main Express server entry point
└── frontend/mindgym/
    ├── public/         # Static assets (images, audio)
    └── src/
        ├── api.js          # Central Axios configuration
        ├── components/     # Reusable React components
        ├── context/        # Global state (AuthContext)
        ├── constants.js    # Shared constants
        ├── App.jsx         # Main router setup
        └── main.jsx        # App entry point
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- A Google Gemini API Key from [Google AI Studio](https://ai.google.dev/).

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_very_strong_and_random_secret_string
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:5001`.

5.  **(Optional but Recommended) Seed the database:**
    Use a tool like Postman to send a `POST` request to `http://localhost:5001/api/activities/seed`. This will populate your database with the default set of mental and physical activities.

### Frontend Setup

1.  **Open a new terminal and navigate to the frontend directory:**
    ```bash
    cd frontend/mindgym
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `frontend` directory and add the following variables:
    ```env
    VITE_API_URL=http://localhost:5001/api
    VITE_GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Place your assets:** Add your podcast `.mp3` files to `frontend/public/podcasts/` and any placeholder images to `frontend/public/images/`.

5.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints

A summary of the core API routes. All routes except `/register` and `/login` are protected and require a valid JWT.

- `POST /api/auth/register`: Create a new user.
- `POST /api/auth/login`: Log in an existing user.
- `GET /api/auth/user`: Get the currently logged-in user's data.
- `POST /api/tasks/complete`: Complete a daily task.
- `GET /api/users/leaderboard`: Get the top users by streak.
- `PUT /api/users/preferences`: Update user's preferred tasks.
- `POST /api/users/rewards/claim`: Spend points to claim a reward.
- `GET /api/journal/community`: Get the anonymous community journal feed.
- `PUT /api/journal/upvote/:id`: Upvote a journal entry.

## Future Roadmap

-   **Advanced AI Personalization:** Implement an ML model to automatically suggest tasks based on user behavior patterns.
-   **Community Challenges:** Introduce collective goals for the entire user base to work towards together.
-   **Intelligent Notifications:** Develop a smart push notification system that reminds users at optimal times to complete their tasks.
-   **Partner Rewards:** Integrate with real-world partners to offer tangible rewards that can be redeemed with points.