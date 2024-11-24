const unreadMessages = messages => {
  // Ensure messages is a non-empty array
  if (!Array.isArray(messages) || messages.length === 0) {
    return true; // If there are no messages, consider all messages as read
  }

  // Check if there is any unread message
  for (const message of messages) {
    if (!message.is_read) {
      return false; // If there's an unread message, return false
    }
  }

  return true; // All messages are read
};

export default unreadMessages;
