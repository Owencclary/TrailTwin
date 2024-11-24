const filterEventsWithRadius = (events, userLat, userLon, searchRadius) => {
  const EARTH_RADIUS = 6371000; // Earth's radius in meters

  // Helper function to calculate distance between two coordinates using the Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = degrees => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c; // Distance in meters
  }

  // Filter events that are within the search radius
  const filteredEvents = events.filter(event => {
    const distance = calculateDistance(
      userLat,
      userLon,
      event.meetup_lat,
      event.meetup_lon
    );
    return distance <= searchRadius;
  });

  return filteredEvents;
};

export default filterEventsWithRadius;
