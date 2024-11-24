const getOtherUserId = (inputUserId, chatDataArray) => {
  // Check if the input is an array and has at least one element
  if (!Array.isArray(chatDataArray) || chatDataArray.length === 0) {
    console.error('Invalid input: chatDataArray is not an array or is empty.');
    return null;
  }

  // Access the first object in the array
  const chatData = chatDataArray[0];

  // Validate the user_ids field
  if (!chatData || !Array.isArray(chatData.user_ids)) {
    console.error('Invalid chat data or user_ids array.');
    return null;
  }

  const userIds = chatData.user_ids;

  // Check if the user_ids array contains the input user ID
  if (userIds.includes(inputUserId)) {
    // Return the user ID that does not match the input user ID
    return userIds.find(id => id !== inputUserId);
  }

  // Return null if the input user ID is not found
  return null;
};

export default getOtherUserId;
