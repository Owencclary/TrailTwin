const checkForMaxEvents = events => {
  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];

  // Filter events that match today's date
  const eventsToday = events.filter(event => event.date === today);

  // Check if there are 3 or more events and log the result
  const result = eventsToday.length >= 3;
  console.log(
    result
      ? 'There are 3 or more events today.'
      : 'There are less than 3 events today.'
  );

  // Return the result
  return result;
};

export default checkForMaxEvents;
