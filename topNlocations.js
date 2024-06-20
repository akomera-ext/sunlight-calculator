const fs = require('fs');
const { Transform } = require('stream');
const SunCalc = require('suncalc');
const path = require('path');
const JSONStream = require('JSONStream');

// Define the input file path
const inputFilePath = path.join(__dirname, 'locations.json');

// Transform stream to calculate sunlight duration
class SunlightDurationTransform extends Transform {
  constructor(date, topN) {
    super({ objectMode: true });
    this.date = date;
    this.topN = topN
    this.places = [];
  }

  _transform(chunk, encoding, callback) {
      const { name, latitude, longitude } = chunk;
      const times = SunCalc.getTimes(this.date, latitude, longitude);
      const sunrise = times.sunrise;
      const sunset = times.sunset;
      const duration = (sunset - sunrise) / (1000 * 60 * 60); // duration in hours

      this.places.push({ name, latitude, longitude, sunlightDuration: parseFloat(duration.toFixed(2)) });

    callback();
  }

  _flush(callback) {
    // Sort places by sunlight duration in descending order
    this.places.sort((a, b) => b.sunlightDuration - a.sunlightDuration);


    // Get the top N places
    const topNPlaces = this.places.slice(0, this.topN);

    console.log(`Top ${this.topN} places with the longest daylight duration:`, topNPlaces);
    callback();
  }
}

// Function to calculate and print the place with the longest daylight duration for a given date
function findLongestDaylightPlace(date, topN) {
  // Create read stream
  const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
  const transformStream = new SunlightDurationTransform(date, topN);

  //A streaming JSON parser can process large JSON data without loading the entire data into memory preventing syntax errors if the split occurs in the middle of a string or a structure.
  const jsonStream = JSONStream.parse('*');

  // Pipe the streams
  readStream
  .pipe(jsonStream)
  .pipe(transformStream)
    .on('finish', () => {
      console.log('\n','Sunlight duration calculations are complete.');
    })
    .on('error', err => {
      console.error('An error occurred:', err);
    });
}

// Example usage of the function
const date = new Date("2024-03-02");
const topN = 5;
findLongestDaylightPlace(date, topN);