const validateInputs = (
  eventName,
  trails,
  meetupLat,
  meetupLon,
  date,
  startTime,
  rideType,
  tags
) => {
  // Array of all inputs to check
  const inputs = [
    eventName,
    trails,
    meetupLat,
    meetupLon,
    date,
    startTime,
    rideType,
    tags,
  ];

  // Check each input; if any is null or undefined, return false
  for (const input of inputs) {
    if (input === null || input === undefined) {
      return false;
    }
  }

  // If all inputs are valid, return true
  return true;
};

export default validateInputs;
