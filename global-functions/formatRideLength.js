const formatRideLength = number => {
  if (number === null) {
    return ''; // Return an empty string if number is null
  }
  return number === 1 ? `${number} Hour` : `${number} Hours`;
};

export default formatRideLength;
