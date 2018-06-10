const fs = require('fs-extra');
const _ = require('lodash');
const moment = require('moment');
const klaw = require('klaw')
const { pd } = require('pretty-data');

const getKmlData = function() {
  return new Promise(function(resolve, reject) {
    const dataDumpPaths = []
    klaw('./output/raw-data')
    .on('data', function(dataDumpStream) {
      if (dataDumpStream.stats.isDirectory()) return;
      dataDumpPaths.push(dataDumpStream.path)
    })
    .on('end', function() {
      const taggedPaths = _.map(dataDumpPaths, (path) => ({
        id: path.match(/\/([\d-^/]+)\.json/)[1],
        path
      }));

      const sortedPaths = _.sortBy(taggedPaths, 'id');

      const dataDumpRequests = _.map(sortedPaths, ({ path }) => fs.readJSON(path));

      Promise.all(dataDumpRequests)
      .then(function (dataDumps) {
        const locationData = _.map(dataDumps, function (dataDump, index) {
          return {
            id: sortedPaths[index].id,
            data: pd.xml(dataDump.data)
          };
        });

        resolve(locationData);
      })
      .catch(reject);
    });
  });
};

const processData = async function() {
  const kmlData = await getKmlData();

  return Promise.all(_.map(kmlData, async function ({ id, data }) {
    const date = moment(id);
    const outputDirectory = `./output/data/${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}/`;
    await fs.ensureDir(outputDirectory)
    return fs.writeFile(`${outputDirectory}location.kml`, data);
  }));
};

module.exports = processData;
