const filterUsers = (
  data,
  nameFilter,
  ageFilter,
  locationFilter,
  skillLevelFilter,
  ridingStyleFilter,
  lookingForFilter
) => {
  const filteredUsers = Object.values(data).filter(user => {
    // Log filter inputs
    console.log('Filters:');
    console.log('nameFilter:', nameFilter);
    console.log('ageFilter:', ageFilter);
    console.log('locationFilter:', locationFilter);
    console.log('skillLevelFilter:', skillLevelFilter);
    console.log('ridingStyleFilter:', ridingStyleFilter);
    console.log('lookingForFilter:', lookingForFilter);

    // Convert all user fields to strings to support partial matching
    const userStringified = JSON.stringify(user).toLowerCase();

    // Initialize variables for parsed fields
    let skillLevel = [];
    let ridingStyle = [];
    let lookingFor = [];

    // Attempt to parse fields safely; fall back to empty arrays if parsing fails
    try {
      skillLevel =
        typeof user.skill_level === 'string' && user.skill_level.startsWith('[')
          ? JSON.parse(user.skill_level)
          : [user.skill_level];

      ridingStyle =
        typeof user.riding_style === 'string' &&
        user.riding_style.startsWith('[')
          ? JSON.parse(user.riding_style)
          : [user.riding_style];

      lookingFor =
        typeof user.looking_for === 'string' && user.looking_for.startsWith('[')
          ? JSON.parse(user.looking_for)
          : [user.looking_for];
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
    }

    // Check for filters and see if each is included in the corresponding user data (case-insensitive)
    const nameMatch =
      !nameFilter ||
      nameFilter === '' ||
      (typeof nameFilter === 'string' &&
        userStringified.includes(nameFilter.toLowerCase()));
    const ageMatch =
      !ageFilter ||
      ageFilter === '' ||
      userStringified.includes(ageFilter.toString());
    const locationMatch =
      !locationFilter ||
      locationFilter === '' ||
      (typeof locationFilter === 'string' &&
        userStringified.includes(locationFilter.toLowerCase()));

    const skillLevelMatch =
      !skillLevelFilter ||
      skillLevelFilter.length === 0 ||
      (Array.isArray(skillLevelFilter) &&
        skillLevelFilter.some(level =>
          skillLevel.map(s => s.toLowerCase()).includes(level.toLowerCase())
        ));
    const ridingStyleMatch =
      !ridingStyleFilter ||
      ridingStyleFilter.length === 0 ||
      (Array.isArray(ridingStyleFilter) &&
        ridingStyleFilter.some(style =>
          ridingStyle.map(r => r.toLowerCase()).includes(style.toLowerCase())
        ));
    const lookingForMatch =
      !lookingForFilter ||
      lookingForFilter.length === 0 ||
      (Array.isArray(lookingForFilter) &&
        lookingForFilter.some(looking =>
          lookingFor.map(l => l.toLowerCase()).includes(looking.toLowerCase())
        ));

    // Return true if all filters match
    return (
      nameMatch &&
      ageMatch &&
      locationMatch &&
      skillLevelMatch &&
      ridingStyleMatch &&
      lookingForMatch
    );
  });

  // Return the entire JSON array of filtered users
  console.log('Filtered Users:', filteredUsers);
  return filteredUsers;
};

export default filterUsers;
