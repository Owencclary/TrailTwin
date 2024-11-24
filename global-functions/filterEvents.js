const filterEvents = (
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
  // Ensure events is a valid array
  if (!Array.isArray(events)) {
    console.warn('Events data is not an array. Returning empty result.');
    return [];
  }

  return events.filter(event => {
    // Check start time filter
    const eventStartTime = parseInt(event.start_time, 10);
    if (
      (startTimeAfterFilter !== undefined &&
        eventStartTime < startTimeAfterFilter) ||
      (startTimeBeforeFilter !== undefined &&
        eventStartTime > startTimeBeforeFilter)
    ) {
      return false;
    }

    // Check event type filter
    if (event.event_type !== eventTypeFilter) {
      return false;
    }

    // Check tags filter
    if (!event.tags || !tagsFilter.every(tag => event.tags.includes(tag))) {
      return false;
    }

    // Check ride name filter
    if (
      !event.event_name.toLowerCase().includes(rideNameFilter.toLowerCase())
    ) {
      return false;
    }

    // Check trail filter
    if (!event.trail_names.toLowerCase().includes(trailFilter.toLowerCase())) {
      return false;
    }

    // Check skill level filter
    const eventSkillLevels = JSON.parse(event.skill_level);
    if (!eventSkillLevels.includes(skillLevelFilter)) {
      return false;
    }

    // Check date filters
    const eventDate = new Date(event.date).getTime();
    if (
      eventDate < new Date(minDateFilter).getTime() ||
      eventDate > new Date(maxDateFilter).getTime()
    ) {
      return false;
    }

    // Check ride length filter
    if (event.ride_length !== rideLengthFilter) {
      return false;
    }

    return true;
  });
};

export default filterEvents;
