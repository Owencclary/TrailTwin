const sortMessagesAscending = messages => {
  return messages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
};

export default sortMessagesAscending;
