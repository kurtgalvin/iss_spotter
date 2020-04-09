const request = require('request');

const fetchMyIP = function() {
  return new Promise((resolve, reject) => {
    request('https://api.ipify.org/?format=json', function(error, response, body) {
      if (error) {
        reject(error);
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        reject(Error(msg));
      }
      resolve(JSON.parse(body).ip);
    });
  })
};

const fetchCoordsByIP = function(ip) {
  return new Promise((resolve, reject) => {
    request(`https://ipvigilante.com/${ip}`, function(error, response, body) {
      if (error) {
        reject(error);
      }
  
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
        reject(Error(msg));
      }
  
      const data = JSON.parse(body).data
      resolve({
        latitude: data.latitude, 
        longitude: data.longitude
      })
    })
  })
}

const fetchISSFlyOverTimes = function(coords) {
  const lat = coords.latitude;
  const lon = coords.longitude;
  return new Promise((resolve, reject) => {
    request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, function(error, response, body) {
      if (error) {
        reject(error);
      }
  
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`;
        reject(Error(msg));
      }
  
      const data = JSON.parse(body);
      resolve(data.response)
    })
  })
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
}

module.exports = { nextISSTimesForMyLocation };