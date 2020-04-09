const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation(function(error, passTimes) {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // console.log(Date(passTimes[0].risetime))
  for (const timeObj of passTimes) {
    const data = Date(timeObj.risetime);
    const duration = timeObj.duration;
    console.log(`Next pass at ${data} for ${duration} seconds!`)
  }
})