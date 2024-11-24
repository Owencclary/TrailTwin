const hasData = json => {
  // Check if the json is not an object or is null/undefined
  if (typeof json !== 'object' || json === null) {
    return false;
  }

  // Check if the object has any non-empty data
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];

      // If value is an object, recursively check it
      if (typeof value === 'object' && value !== null && hasData(value)) {
        return true;
      }

      // If value is not null/undefined/empty string, return true
      if (value !== null && value !== undefined && value !== '') {
        return true;
      }
    }
  }

  // Return false if all fields are empty
  return false;
};

export default hasData;
