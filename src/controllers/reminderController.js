const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const googleCalendarService = require('../services/googleCalendarService');

exports.createReminder = async (req, res) => {
  try {
    const { title, description, remind_at } = req.body;
    const user = req.user;

    // Create reminder in DB without calendar_event_id first
    const { data, error } = await supabase
      .from('reminders')
      .insert({
        id: uuidv4(),
        users_id: user.id,
        title,
        description,
        remind_at,
        created_at: new Date().toISOString(),
      })
      .single();

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
