const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Routes configuration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/membership', require('./routes/membershipRoutes'));

app.get('/', (req, res) => {
  res.send('Welcome to ZenFit Premium API! Server is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error:', err.stack);
  res.status(500).json({ message: 'Internal server error occurred.' });
});

// Initialize database connection then start listening
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
