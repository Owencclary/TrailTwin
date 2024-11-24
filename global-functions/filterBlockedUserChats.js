const filterBlockedUserChats = (chatData, blockedUserIds) => {
  // Log input data for debugging
  console.log('Received chatData:', chatData);
  console.log('Received blockedUserIds:', blockedUserIds);

  // Ensure chatData is an array
  if (!Array.isArray(chatData) || chatData.length === 0) {
    console.error('Error: chatData is not a valid array or is empty.');
    return []; // Return an empty array if chatData is invalid
  }

  // Ensure blockedUserIds is an array
  if (!Array.isArray(blockedUserIds) || blockedUserIds.length === 0) {
    console.warn('Warning: blockedUserIds is not a valid array or is empty.');
    return chatData; // Return the original chatData if there are no blocked users
  }

  // Filter out chats that include a blocked user ID in the user_ids column
  const filteredChats = chatData.filter(chat => {
    // Check if any user_id in the chat's user_ids is in the blockedUserIds array
    const hasBlockedUser = chat.user_ids.some(userId =>
      blockedUserIds.includes(userId)
    );
    return !hasBlockedUser; // Keep the chat if no blocked user is found
  });

  // Log the filtered chats
  console.log('Filtered Chats:', filteredChats);

  // Return the filtered array of chats
  return filteredChats;
};

export default filterBlockedUserChats;
