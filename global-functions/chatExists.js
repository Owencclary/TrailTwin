const chatExists = (chats, user_id, otherUserId) => {
  return chats.some(chat => {
    const ids = chat.user_ids.filter(id => id); // Filter out any null or empty values
    return ids.includes(user_id) && ids.includes(otherUserId);
  });
};

export default chatExists;
