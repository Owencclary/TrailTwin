const isUserInArray = (userIds, userId) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return false;
  }
  return userIds.includes(userId);
};

export default isUserInArray;
