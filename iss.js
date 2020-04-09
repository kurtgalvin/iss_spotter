const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/${ip}`, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body).data
    callback(error, {
      latitude: data.latitude, 
      longitude: data.longitude
    })
  })
}

const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const lon = coords.longitude;
  request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    callback(null, data.response)
  })
};

const nextISSTimesForMyLocation = function(callback) {
  return new Promise((resolve, reject) => {
    fetchMyIP((error, ip) => {
      if (error) {
        reject(error);
      }
      resolve(ip)
    })
  })
  .then((ip) => {
    return new Promise((resolve, reject) => {
      fetchCoordsByIP(ip, (error, coords) => {
        if (error) {
          reject(error);
        }
        resolve(coords);
      })
    })
  })
  .then((coords) => {
    return new Promise((resolve, reject) => {
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          reject(error)
        }
        callback(null, data)
      })
    })
  })
  .catch((reason) => {
    callback(reason, null)
  })
}

module.exports = { nextISSTimesForMyLocation };