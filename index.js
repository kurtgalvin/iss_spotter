const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = (passTimes) => {
  for (const timeObj of passTimes) {
    const data = Date(timeObj.risetime);
    const duration = timeObj.duration;
    console.log(`Next pass at ${data} for ${duration} seconds!`)
  }
}

nextISSTimesForMyLocation()
  .then(printPassTimes)
  .catch(x => console.log(x))