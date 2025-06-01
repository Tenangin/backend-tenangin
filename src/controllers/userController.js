const supabase = require('../config/supabase');

exports.getProfile = async (req, res) => {
  try {
    const profileId = req.params.id; // Use id from route parameter
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('users_id', profileId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      message: 'Profile berhasil didapatkan',
      profile
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, place_of_birth, date_of_birth, age, gender, address, about_me } = req.body;

    if (!full_name || !place_of_birth || !date_of_birth || !age || !gender || !address || !about_me) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    // Generate new profile id
    const generateProfileId = async () => {
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

    const id = await generateProfileId();

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: id,
          users_id: userId,
          full_name,
          place_of_birth,
          date_of_birth,
          age,
          gender,
          address,
          about_me
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      success: true, 
      message: 'Profile berhasil dibuat', 
      profile: data[0] 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profileId = req.user.id;
    const updates = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('users_id', profileId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true, 
      message: 'Profile berhasil diperbarui', 
      profile: data 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
