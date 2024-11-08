const axios = require('axios');
const fs = require('fs');

require('dotenv').config();  // Load environment variables

const API_KEY = process.env.GOOGLE_API_KEY;  // Use the API key from the environment
const LOCATION = '52.3676,4.9041';  // Coordinates of Amsterdam's city center
const RADIUS = 5000;  // Search within a 5 km radius
const PLACE_TYPES = {'hotel': 'hotels.csv', 'hospital': 'hospitals.csv'};

async function fetchPlaces(type) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LOCATION}&radius=${RADIUS}&type=${type}&key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data.results;
}

async function savePlacesToCsv() {
  for (const [type, fileName] of Object.entries(PLACE_TYPES)) {
    const places = await fetchPlaces(type);

    const csvData = [];
    csvData.push(['Name', 'Latitude', 'Longitude', 'Place ID']);
    places.forEach(place => {
      csvData.push([
        place.name,
        place.geometry.location.lat,
        place.geometry.location.lng,
        place.place_id
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    fs.writeFileSync(fileName, csvContent, 'utf8');
  }
  console.log("CSV files created successfully!");
}

savePlacesToCsv().catch(err => console.error(err));
