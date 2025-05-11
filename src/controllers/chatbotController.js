const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createSession = async (req, res) => {
  try {
    const { session_date, summary, mood_detected } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('chatbot_sessions')
      .insert({
        id: uuidv4(),
        users_id: userId,
        session_date,
        summary,
        mood_detected,
        created_at: Date.now(),
      })
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('chatbot_sessions')
      .select('*')
      .eq('users_id', userId)
      .order('session_date', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('sessions_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sender, message } = req.body;

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

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
