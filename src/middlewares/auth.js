const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return done(error, null);
    }
    done(null, data);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', profile.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows found, so ignore
          return done(error, null);
        }

        if (data) {
          // User exists
          return done(null, data);
        } else {
          // Create new user
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              google_id: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              avatar: profile.photos[0].value,
            })
            .single();

          if (insertError) {
            return done(insertError, null);
          }
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// JWT authentication middleware
const jwtAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token);
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.log('JWT decoded payload:', decoded);
    req.user = decoded;
    next();
  });
};

module.exports = {
  passport,
  ensureAuthenticated,
  jwtAuth,
};
