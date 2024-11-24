const checkForGroupRide = tags => {
  // Check if tags is an array and includes "Group Ride"
  if (Array.isArray(tags) && tags.includes('Group Ride')) {
    return 'Yes';
  }
  // Check if tags is exactly "Group Ride" as a single string
  if (tags === 'Group Ride') {
    return 'Yes';
  }
  return null;
};

export default checkForGroupRide;
