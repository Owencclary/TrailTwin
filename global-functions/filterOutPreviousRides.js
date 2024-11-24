const filterOutPreviousRides = events => {
  // Filter out events with the status "Previous"
  return events.filter(event => event.event_status !== 'Previous');
};

export default filterOutPreviousRides;
