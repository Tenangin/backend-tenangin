const supabase = require('../config/supabase');

exports.createAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, condition, result_text } = req.body;
    const generateId = async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
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

    if (score === undefined || !condition || !result_text) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    const { data, error } = await supabase
      .from('assesment_history')
      .insert([
        {
            id: newId,
            users_id: userId,
            score,
            condition,
            result_text,
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Assessment berhasil dibuat', assessment: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('assesment_history')
      .select('*')
      .eq('users_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
