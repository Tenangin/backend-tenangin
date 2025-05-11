require('dotenv').config(); // Load environment variables from .env

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const { passport } = require('../src/middlewares/auth');
const authRoutes = require('../src/routes/authRoutes');
const profileRoutes = require('../src/routes/profileRoutes');
const chatbotRoutes = require('../src/routes/chatbotRoutes');
const journalRoutes = require('../src/routes/journalRoutes');
const recommendationRoutes = require('../src/routes/recommendationRoutes');
const reminderRoutes = require('../src/routes/reminderRoutes');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'test_secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/journal', journalRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('/reminders', reminderRoutes);

describe('API Routes', () => {
  it('GET / should return 404', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(404);
  });

  // Add more tests here for each route as needed
});

module.exports = app;
