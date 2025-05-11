require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { passport, ensureAuthenticated } = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const journalRoutes = require('./routes/journalRoutes')
const serverless = require('serverless-http');

const app = express();
const port = process.env.PORT || 3000;
const host = 'localhost';

// Enable CORS for all origins (adjust as needed)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files from public folder
app.use(express.static('public'));

// Session middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure secret in production
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and session
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assesment', assessmentRoutes);
app.use('/api/chatbot', ensureAuthenticated, require('./routes/chatbotRoutes'));
app.use('/api/journal', journalRoutes);
app.use('/api/recommendations', ensureAuthenticated, require('./routes/recommendationRoutes'));
app.use('/api/reminders', ensureAuthenticated, require('./routes/reminderRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('Mental Wellness Backend API');
});

// API docs route
app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/public/api-docs.html');
});


app.listen(port, host, () => {
  console.log(`Server is running on port ${port} dan host ${host}`);
});

module.exports = app;