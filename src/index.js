require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { passport, ensureAuthenticated } = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const journalRoutes = require('./routes/journalRoutes')
const clinicsRoutes = require('./routes/clinicsRoutes');
const remindersRoutes = require('./routes/reminderRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const port = process.env.PORT || 3000;
const host = 'localhost';

// Enable CORS for all origins (adjust as needed)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files from public folder
app.use(express.static('public'));

// Session middleware - disable in serverless environment to avoid hanging
if (process.env.NODE_ENV !== 'production') {
  app.use(
    session({
      secret: 'your_secret_key', // Replace with a secure secret in production
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize passport and sessio
  app.use(express.json());
  app.use(passport.initialize());
  app.use(passport.session());
} else {
  // In production (serverless), only use JSON parser and passport initialize without session
  app.use(express.json());
  app.use(passport.initialize());
}

// Routes
app.use('/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assesment', assessmentRoutes);
app.use('/api/chatbot',  chatbotRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/clinics', clinicsRoutes);
app.use('/api/recommendations', ensureAuthenticated, require('./routes/recommendationRoutes'));
app.use('/reminders', remindersRoutes);

// API docs route
app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/public/api-docs.html');
});

// Root route
app.get('/', (req, res) => {
  res.send('Mental Wellness Backend API');
});



if (process.env.NODE_ENV !== 'production') {
  app.listen(port, host, () => {
    console.log(`Server is running on port ${port} dan host ${host}`);
  });
}

module.exports = app;
