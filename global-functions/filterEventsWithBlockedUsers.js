const filterEventsWithBlockedUsers = (eventsData, blockedUserIds) => {
  // Log input data for debugging
  console.log('Received eventsData:', eventsData);
  console.log('Received blockedUserIds:', blockedUserIds);

  // Ensure eventsData is an array
  if (!Array.isArray(eventsData) || eventsData.length === 0) {
    console.error('Error: eventsData is not a valid array or is empty.');
    return []; // Return an empty array if eventsData is invalid
  }

  // Ensure blockedUserIds is an array
  if (!Array.isArray(blockedUserIds) || blockedUserIds.length === 0) {
    console.warn('Warning: blockedUserIds is not a valid array or is empty.');
    return eventsData; // Return the original eventsData if there are no blocked users
  }

  // Filter out events that contain an attendee ID in the blockedUserIds array
  const filteredEvents = eventsData.filter(event => {
    // Check if attendee_ids exists and is an array
    if (!Array.isArray(event.attendee_ids)) {
      return true; // Keep the event if attendee_ids is not defined or not an array
    }

    // Check if any attendee ID is in the blockedUserIds array
    const hasBlockedUser = event.attendee_ids.some(userId =>
      blockedUserIds.includes(userId)
    );
    return !hasBlockedUser; // Keep the event if no blocked user is found
  });

  // Log the filtered events
  console.log('Filtered Events:', filteredEvents);

  // Return the filtered array of events
  return filteredEvents;
};

export default filterEventsWithBlockedUsers;
