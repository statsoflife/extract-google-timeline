require('dotenv').load();

const moment = require('moment');
const getRawDataFrom = require('./src/get-raw-data');
const processData = require('./src/process-data');

const date = process.argv[2] || moment().subtract(1, 'day').format('YYYY-MM-DD');

async function run() {
  console.log("Pulling raw activity data from Google Maps\n---\n");
  await getRawDataFrom(date);
  console.log("\n---\n");
  console.log("Processing data...");
  await processData();
  console.log(" - Complete")
  console.log("\nGoogle Maps data retrived. Please see the output directory");
};

run();
