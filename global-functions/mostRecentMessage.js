const mostRecentMessage = data => {
  // Sort the data by 'created_at' field in descending order
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    console.log(
      `Comparing ${a.message} (${dateA}) and ${b.message} (${dateB})`
    );
    return dateB - dateA;
  });

  // Check if data is not empty and return the message from the most recent entry
  if (sortedData.length > 0) {
    return sortedData[0].message;
  } else {
    return null;
  }
};

export default mostRecentMessage;
