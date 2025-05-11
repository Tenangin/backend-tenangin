const passport = require('passport');
const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });

exports.googleAuthSuccess = (req, res) => {
  // Successful authentication, redirect or respond with user info
  res.json({ message: 'Google authentication successful', user: req.user });
};

// New login with Google using Supabase OAuth
exports.loginWithGoogleSupabase = async (req, res) => {
  try {
    const scope = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: scope,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Langsung redirect (kalau kamu ingin client langsung diarahkan ke Google)
    return res.redirect(data.url);

    // Atau bisa juga dikirim sebagai JSON untuk SPA
    // return res.json({ url: data.url });

  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.logout = (req, res) => {
  req.logout(async () => {
    await supabase.auth.signOut()
    res.json({ message: 'Logged out successfully' });
  });
};

// Register user without Google account
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    if (!username || !email || !password || !confirm_password) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Password dan konfirmasi password tidak sama' });
    }

    // Generate new user id
    const generateUserId = async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error saat mengambil id terakhir:', error);
        // fallback ke id default
        return 'T001';
      }

      if (!users || users.length === 0) {
        return 'T001';
      }

      const lastId = users[0].id;
      const numberPart = parseInt(lastId.substring(1)) || 0;
      const newNumber = numberPart + 1;
      return 'T' + newNumber.toString().padStart(3, '0');
    };

    const newId = await generateUserId();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user to Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: newId,
          username,
          email,
          password: hashedPassword,
          confirm_password: hashedPassword,
          google_id:null
        }
      ]).select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Gagal mendapatkan data user setelah registrasi' });
    }

    res.status(201).json({ message: 'Registrasi berhasil', user: data[0] });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    // Get user by email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'User tidak ditemukan' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login berhasil',
      access_token: token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
