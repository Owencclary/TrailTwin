const formatJSON = jsonString => {
  try {
    // Parse the JSON string into an array
    const arr = JSON.parse(jsonString);

    // Check if the parsed result is an array
    if (Array.isArray(arr)) {
      return arr.join(' - ');
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

export default formatJSON;
