const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createRecommendation = async (req, res) => {
  try {
    const { clinics_id, notes } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        id: uuidv4(),
        users_id: userId,
        clinics_id,
        notes,
        created_at: Date.now(),
      })
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('recommendations')
      .select('*, clinics(*)')
      .eq('users_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
