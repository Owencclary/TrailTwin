const filterEventList = (
  events,
  eventTypeFilter,
  tagsFilter,
  rideNameFilter,
  trailFilter,
  skillLevelFilter,
  minDateFilter,
  maxDateFilter,
  startTimeAfterFilter,
  startTimeBeforeFilter,
  rideLengthFilter
) => {
  const filteredEvents = events.filter(event => {
    // Filter by eventType
    if (eventTypeFilter && event.event_type !== eventTypeFilter) {
      return false;
    }

    // Filter by tags (must contain at least one of the tags in tagsFilter)
    if (tagsFilter && !tagsFilter.some(tag => event.tags.includes(tag))) {
      return false;
    }

    // Filter by ride name (should contain rideNameFilter as substring)
    if (
      rideNameFilter &&
      !event.event_name.toLowerCase().includes(rideNameFilter.toLowerCase())
    ) {
      return false;
    }

    // Filter by trail name (should contain trailFilter as substring)
    if (
      trailFilter &&
      !event.trail_names.toLowerCase().includes(trailFilter.toLowerCase())
    ) {
      return false;
    }

    // Filter by skill level (must match or contain any level in skillLevelFilter)
    if (
      skillLevelFilter &&
      !skillLevelFilter.some(level => event.skill_level.includes(level))
    ) {
      return false;
    }

    // Filter by minimum and maximum date
    const eventDate = new Date(event.date);
    if (minDateFilter && eventDate < new Date(minDateFilter)) {
      return false;
    }
    if (maxDateFilter && eventDate > new Date(maxDateFilter)) {
      return false;
    }

    // Filter by start time (should be within the start time range)
    if (
      startTimeAfterFilter !== null &&
      event.start_time < startTimeAfterFilter
    ) {
      return false;
    }
    if (
      startTimeBeforeFilter !== null &&
      event.start_time > startTimeBeforeFilter
    ) {
      return false;
    }

    // Filter by ride length
    if (rideLengthFilter !== null && event.ride_length !== rideLengthFilter) {
      return false;
    }

    // If all filters pass
    return true;
  });

  return filteredEvents;
};

export default filterEventList;
