const filterBlockedUsers = (userData, blockedUserIds) => {
  // Log input data for debugging
  console.log('Received userData:', userData);
  console.log('Received blockedUserIds:', blockedUserIds);

  // Ensure userData is an array
  if (!Array.isArray(userData) || userData.length === 0) {
    console.error('Error: userData is not a valid array or is empty.');
    return []; // Return an empty array if userData is invalid
  }

  // Ensure blockedUserIds is an array
  if (!Array.isArray(blockedUserIds) || blockedUserIds.length === 0) {
    console.warn('Warning: blockedUserIds is not a valid array or is empty.');
    return userData; // Return the original userData if there are no blocked users
  }

  // Filter out users whose user_id is in the blockedUserIds array
  const filteredUsers = userData.filter(
    user => !blockedUserIds.includes(user.user_id)
  );

  // Log the filtered users
  console.log('Filtered Users:', filteredUsers);

  // Return the filtered array of users
  return filteredUsers;
};

export default filterBlockedUsers;
