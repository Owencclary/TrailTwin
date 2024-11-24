const addAttendee = (eventData, userId) => {
  // Log the input data for debugging
  console.log('Received eventData:', eventData);
  console.log('Received userId:', userId);

  // Ensure eventData is an array and has at least one item
  if (!Array.isArray(eventData) || eventData.length === 0) {
    console.error('Error: eventData is not a valid array or is empty.');
    return []; // Return an empty array if eventData is invalid
  }

  // Access the first event in the array
  let event = eventData[0];

  // Check if attendee_ids exists and is an array, otherwise initialize it
  if (!Array.isArray(event.attendee_ids)) {
    console.warn(
      'Warning: attendee_ids is not defined or is null. Initializing to an array.'
    );
    event.attendee_ids = [];
  }

  console.log('Initial attendee_ids:', event.attendee_ids);

  // Add the userId if it's not already present
  if (!event.attendee_ids.includes(userId)) {
    event.attendee_ids.push(userId);
    console.log('User ID added to attendee_ids.');
  } else {
    console.log('User ID already exists in attendee_ids, not adding.');
  }

  console.log('Updated attendee_ids:', event.attendee_ids);

  // Return only the updated attendee_ids array
  return event.attendee_ids;
};

export default addAttendee;
