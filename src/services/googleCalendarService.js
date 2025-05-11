const { calendar, oauth2Client } = require('../config/google');

async function createCalendarEvent(user, reminder) {
  try {
    // Set credentials for the user
    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
      expiry_date: user.expiry_date,
    });

    const event = {
      summary: reminder.title,
      description: reminder.description,
      start: {
        dateTime: new Date(reminder.remind_at).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(new Date(reminder.remind_at).getTime() + 30 * 60000).toISOString(), // 30 minutes duration
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

async function updateCalendarEvent(user, reminder) {
  try {
    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
      expiry_date: user.expiry_date,
    });

    const event = {
      summary: reminder.title,
      description: reminder.description,
      start: {
        dateTime: new Date(reminder.remind_at).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(new Date(reminder.remind_at).getTime() + 30 * 60000).toISOString(),
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: reminder.calendar_event_id,
      resource: event,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

async function deleteCalendarEvent(user, calendarEventId) {
  try {
    oauth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer',
      expiry_date: user.expiry_date,
    });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: calendarEventId,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};
