const filterEventsWithoutUser = (events, userId) => {
  return events.filter(event => event.user_id !== userId);
};

export default filterEventsWithoutUser;
