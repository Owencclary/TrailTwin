const foundEvents = events => {
  // Check if events is a valid array and has data
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }
  return true;
};

export default foundEvents;
