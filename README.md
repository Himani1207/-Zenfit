# 🏋️ ZenFit

ZenFit is a modern full-stack fitness web application designed to help users build healthy habits through guided workout sessions, personalized meal planning, activity tracking, and gamified daily challenges.

The application combines fitness tracking with an engaging user experience, allowing users to monitor their progress, maintain streaks, unlock achievements, and stay motivated throughout their fitness journey.

---

## 🚀 Features

### 👤 Authentication

- User Signup & Login
- JWT Authentication
- Secure Password Encryption
- Persistent Login Sessions
- Profile Management

---

### 🏠 My Journey Dashboard

- Personalized Dashboard
- Daily Mission Tracker
- Daily Checklist
- Activity Calendar
- Workout Recommendations
- Meal Recommendations
- Water Intake Tracker
- Weekly Challenges
- Achievement System
- XP & Level Progression
- Current & Longest Streak

---

### 💪 Workout Hub

- Guided Workout Sessions
- Multiple Workout Categories
- Beginner, Intermediate & Advanced Sessions
- Workout Timer
- Exercise Counter
- Workout Programs
- Search & Filter Workouts
- Save Favorite Workouts
- Workout History
- Calories Burned Tracking

Workout Categories include:

- Abs
- Chest
- Shoulders
- Arms
- Legs
- Core
- Full Body
- Flexibility
- Cardio

---

### 🥗 Intelligent Meal Planner

Generate personalized meal plans based on:

- Fitness Goal
- Activity Level
- Diet Preference
- Pantry Mode

Features include:

- Breakfast
- Lunch
- Dinner
- Snacks
- Daily Calories
- Nutritional Recommendations
- Saved Meal Plans

---

### 📅 Activity Calendar

GitHub-style consistency calendar.

- Daily Mission Completion
- Green Activity Days
- Monthly Progress Visualization
- Persistent History
- Streak Tracking

---

### 🏆 Achievement System

Unlock achievements based on:

- Workout Completion
- Daily Streaks
- Daily Missions
- Levels
- Weekly Challenges

---

### 💎 Membership

Subscription page with:

- Starter Plan
- Pro Plan
- Elite Plan

Includes:

- Feature Comparison
- Membership Status
- Current Plan
- Premium Benefits

---

### 👤 Profile

- Personal Information
- Physical Metrics
- BMI
- Saved Workouts
- Saved Meal Plans
- Membership Status
- Security Settings
- Achievements

---

## 🛠 Tech Stack

### Frontend

- React.js
- React Router
- CSS3
- Framer Motion
- React Icons

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT
- bcryptjs

### Other

- REST API
- dotenv
- CORS

---

## 📂 Project Structure

```
ZenFit/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ZenFit.git
```

---

### Frontend

```bash
cd frontend

npm install

npm start
```

---

### Backend

```bash
cd backend

npm install

npm start
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key
```

---

## 🌐 Database

ZenFit uses **MongoDB Atlas** as its cloud database.

Collections include:

- users
- workouts
- workoutsessions
- mealplans
- memberships
- achievements
- dailymissions
- activitycalendar
- workouthistory

---

## 📱 Responsive Design

ZenFit is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

## 🎯 Future Enhancements

- AI Workout Recommendations
- AI Nutrition Suggestions
- Wearable Device Integration
- Community Challenges
- Progress Analytics
- Exercise GIF Library
- Email Notifications
- Payment Gateway Integration
- Social Login
