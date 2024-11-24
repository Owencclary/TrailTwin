const removeAttendee = (eventData, userId) => {
  // Log the input data to see exactly what we're receiving
  console.log('Received eventData:', eventData);
  console.log('Received userId:', userId);

  // Ensure eventData is an array and has at least one item
  if (!Array.isArray(eventData) || eventData.length === 0) {
    console.error('Error: eventData is not a valid array or is empty.');
    return []; // Return an empty array if eventData is invalid
  }

  // Access the first event in the array
  let event = eventData[0];

  // Check if the event has an attendee_ids array; initialize it if null or undefined
  if (!Array.isArray(event.attendee_ids)) {
    console.warn(
      'Warning: attendee_ids is not defined or is null in the event object. Initializing to an empty array.'
    );
    event.attendee_ids = [];
  }

  console.log('Initial attendee_ids:', event.attendee_ids);
  console.log('User ID to remove:', userId);

  // Remove the userId if it exists in the array
  if (event.attendee_ids.includes(userId)) {
    event.attendee_ids = event.attendee_ids.filter(id => id !== userId);
    console.log('User ID removed from attendee_ids.');
  } else {
    console.log('User ID does not exist in attendee_ids, no removal needed.');
  }

  console.log('Updated attendee_ids:', event.attendee_ids);

  // Return the updated attendee_ids array
  return event.attendee_ids;
};

export default removeAttendee;
