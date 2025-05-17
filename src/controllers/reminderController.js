const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const googleCalendarService = require('../services/googleCalendarService');

exports.createReminder = async (req, res) => {
  try {
    const { title, description, remind_at } = req.body;
    const userId = req.user.id;
    const generateId = async () => {
      const { data: profiles, error } = await supabase
        .from('reminders')
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

    // Create reminder in DB without calendar_event_id first
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        id: newId,
        users_id: userId,
        title,
        description,
        remind_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) return res.status(400).json({ error: error.message });

    // Create event in Google Calendar
    const event = await googleCalendarService.createCalendarEvent(user, data);

    // Update reminder with calendar_event_id
    const { error: updateError } = await supabase
      .from('reminders')
      .update({ calendar_event_id: event.id })
      .eq('id', data.id);

    if (updateError) {
      console.error('Failed to update calendar_event_id:', updateError);
    }

    res.status(201).json({ ...data, calendar_event_id: event.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('users_id', userId)
      .order('remind_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
