const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createSession = async (req, res) => {
  try {
    const { summary, mood_detected } = req.body;
    const userId = req.user.id;

    // Optimized generateId: use count instead of fetching last profile id
    const generateId = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        if (error) {
          console.error('Error saat menghitung jumlah profile:', error);
          return '001';
        }

        const newNumber = (count || 0) + 1;
        return newNumber.toString().padStart(3, '0');
      } catch (e) {
        console.error('Exception di generateId:', e);
        return '001';
      }
    };

    const newId = await generateId();

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('chatbot_sessions')
      .insert({
        id: newId,
        users_id: userId,
        session_date: Date.now(),
        summary,
        mood_detected,
        created_at: Date.now(),
      })
      .single();
    const duration = Date.now() - startTime;
    if (duration > 2000) {
      console.warn(`Insert chatbot_sessions memakan waktu ${duration} ms`);
    }

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error('Error di createSession:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('chatbot_sessions')
      .select('*')
      .eq('users_id', userId)
      .order('session_date', { ascending: false });
    const duration = Date.now() - startTime;
    if (duration > 2000) {
      console.warn(`Query getSessions memakan waktu ${duration} ms`);
    }

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error('Error di getSessions:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('sessions_id', sessionId)
      .order('timestamp', { ascending: true });
    const duration = Date.now() - startTime;
    if (duration > 2000) {
      console.warn(`Query getSessionMessages memakan waktu ${duration} ms`);
    }

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error('Error di getSessionMessages:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sender, message } = req.body;

    const startTime = Date.now();
    const { data, error } = await supabase
      .from('chatbot_messages')
      .insert({
        id: uuidv4(),
        sessions_id: sessionId,
        sender,
        message,
        timestamp: new Date().toISOString(),
      })
      .single();
    const duration = Date.now() - startTime;
    if (duration > 2000) {
      console.warn(`Insert addMessage memakan waktu ${duration} ms`);
    }

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error('Error di addMessage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
