const request = require('request');
const cheerio = require('cheerio');

const fetchData = require('./fetchData');

module.exports = function (callback) {
  console.log('Requesting home page...');
  const domain = this.domain;
  request({
    method: 'GET',
    url: domain
  }, function (err, response, body) {
    if (err) return callback(err);
    console.log('Searching through home page...');
    let $ = cheerio.load(body);
    const domainData = fetchData($('div').text());

    const hrefs = $('a').map((i, el) => { return $(el).attr('href'); }).get();
    const filteredHrefs = hrefs.map((href) => {
      if (href[0] === '/') href = domain + href;
      return href;
    })
    .filter((href) => {
      return href.slice(0, 4) === 'http';
    });
    callback(null, domainData, filteredHrefs);
  }
);
};
