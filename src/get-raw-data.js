const moment = require('moment');
const fs = require('fs-extra');
const axios = require('axios');
const _ = require('lodash');

const sid = process.env.SID;
const hsid = process.env.HSID;
const ssid = process.env.SSID;

const convertToJson = function(response) {
  return JSON.stringify(_.omit(response, [
      'request',
      ['headers', 'set-cookie'],
      ['config', 'headers']
    ]), null, 4)
    .replace(new RegExp(sid, 'g'), '<removed>')
    .replace(new RegExp(hsid, 'g'), '<removed>')
    .replace(new RegExp(ssid, 'g'), '<removed>')
};

const getQueryFor = function(dateInput) {
  const today = moment();
  const date = moment(dateInput);
  return `
    1m8
      1m3
        1i${date.format('YYYY')}
        2i${date.format('M')-1}
        3i${date.format('D')}
      2m3
        1i${date.format('YYYY')}
        2i${date.format('M')-1}
        3i${date.format('D')}`.split('\n').map((value) => value.trim()).join('!').trim();
};

const getPage = function(date) {
  console.log(`Requesting date ${date}...`);

  return axios.get(`https://www.google.com/maps/timeline/kml`, {
    params: {
      authuser: 0,
      pb: getQueryFor(date)
    },
    headers:{
      Cookie:`SID=${sid}; HSID=${hsid}; SSID=${ssid};`
    }
  })
  .then(function(response) {
    console.log(` - Done, retrieved data for ${date}`);
    return fs.outputFile(`./output/raw-data/${date}.json`, convertToJson(response));
  })
}

function getAllPagesFrom(date) {
  const startDate = moment(date);
  const iterations = moment().diff(startDate, 'days');

  return new Promise(async function(resolve, reject) {
    for (let i = 0; i < iterations; i++) {
      try {
        const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');
        await getPage(date);
      } catch (e) {
        console.log('Error', e);
        reject();
        return;
      }
    }
    resolve();
  });
}

module.exports = getAllPagesFrom;
