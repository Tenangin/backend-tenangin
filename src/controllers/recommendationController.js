const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createRecommendation = async (req, res) => {
  try {
    const { clinics_id, notes } = req.body;
    const userId = req.user.id;
    const generateId = async () => {
      const { data: profiles, error } = await supabase
        .from('recomendations')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error saat mengambil id terakhir profile:', error);
        return '001';
      }

      if (!profiles || profiles.length === 0) {
        return '001';
      }

      const lastId = profiles[0].id;
      const numberPart = parseInt(lastId) || 0;
      const newNumber = numberPart + 1;
      return newNumber.toString().padStart(3, '0');
    };

    const newId = await generateId();

    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        id: newId,
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
