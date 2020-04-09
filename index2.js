const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = (passTimes) => {
  for (const timeObj of passTimes) {
    const data = Date(timeObj.risetime);
    const duration = timeObj.duration;
    console.log(`Next pass at ${data} for ${duration} seconds!`)
  }
}

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });