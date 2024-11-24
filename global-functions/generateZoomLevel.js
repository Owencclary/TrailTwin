const generateZoomLevel = searchRadius => {
  const zoomPerRadius = 9 / 25000; // Ratio of 9 zoom levels per 25,000 search radius
  const zoomLevel = zoomPerRadius * searchRadius;
  console.log(
    `For a search radius of ${searchRadius}, the calculated zoom level is ${Math.round(
      zoomLevel
    )}`
  );
  return Math.round(zoomLevel);
};

export default generateZoomLevel;
