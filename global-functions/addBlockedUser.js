const addBlockedUser = (userData, userId) => {
  // Log the input data for debugging
  console.log('Received userData:', userData);
  console.log('Received userId:', userId);

  // Ensure userData is an array and has at least one item
  if (!Array.isArray(userData) || userData.length === 0) {
    console.error('Error: userData is not a valid array or is empty.');
    return []; // Return an empty array if userData is invalid
  }

  // Access the first user in the array
  let user = userData[0];

  // Check if blocked_users exists and is an array, otherwise initialize it
  if (!Array.isArray(user.blocked_users)) {
    console.warn(
      'Warning: blocked_users is not defined or is null. Initializing to an array.'
    );
    user.blocked_users = [];
  }

  console.log('Initial blocked_users:', user.blocked_users);

  // Add the userId if it's not already present
  if (!user.blocked_users.includes(userId)) {
    user.blocked_users.push(userId);
    console.log('User ID added to blocked_users.');
  } else {
    console.log('User ID already exists in blocked_users, not adding.');
  }

  console.log('Updated blocked_users:', user.blocked_users);

  // Return only the updated blocked_users array
  return user.blocked_users;
};

export default addBlockedUser;
