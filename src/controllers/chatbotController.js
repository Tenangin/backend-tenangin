const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createSession = async (req, res) => {
  try {
    const { users_id,summary, mood_detected } = req.body;
    const userId = req.user.id;

    const generateId = async () => {
      const { data: chatbot_sessions, error } = await supabase
        .from('chatbot_sessions')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error saat mengambil id terakhir chatbot_sessions:', error);
        return 'SC001';
      }

      if (!chatbot_sessions || chatbot_sessions.length === 0) {
        return 'SC001';
      }

      const lastId = chatbot_sessions[0].id;
      const numberPart = parseInt(lastId.replace(/^SC/, '')) || 0;
      const newNumber = numberPart + 1;
      return "SC" + newNumber.toString().padStart(3, '0');
    };
    console.log('id sessions: ', generateId);
    const newId = await generateId();

    const { data, error } = await supabase
    .from('chatbot_sessions')
    .insert([
      {
        id: newId,
        users_id: userId,
        session_date: new Date().toISOString(),
        summary,
        mood_detected,
      }
    ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSessionByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('chatbot_sessions')
      .update(updateData)
      .eq('users_id', userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No sessions found for the user to update' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSessionsByUsersId = async (req, res) => {
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



exports.getMessagesBySessionsId = async (req, res) => {
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
    
    const generateMessageId = async () => {
      const {data: chatbot_messages, error} = await supabase
      .from('chatbot_messages')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

      if (error) {
        console.error('Error saat mengambil id terakhir chatbot_messages:', error);
        return 'SM001';
      }

      if (!chatbot_messages || chatbot_messages.length === 0) {
        return 'SM001';
      }
      const lastId = chatbot_messages[0].id;
      const numberPart = parseInt(lastId.replace(/^SM/, '')) || 0;
      const newNumber = numberPart + 1;
      return "SM" + newNumber.toString().padStart(3, '0');
    };

    const newMessageId = await generateMessageId();

    const { data, error } = await supabase
      .from('chatbot_messages')
      .insert({
        id: newMessageId,
        sessions_id: sessionId,
        sender,
        message,
        timestamp: new Date().toISOString(),
      })
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error('Error di addMessage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
