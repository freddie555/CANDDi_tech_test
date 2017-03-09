const request = require('request');
const cheerio = require('cheerio');
const async = require('async');

const fetchData = require('./fetchData');

module.exports = (domainData, hrefs, callback) => {
  console.log('Searching through website links...');
  async.eachSeries(hrefs, (href, eachCb) => {
    request({
      method: 'GET',
      url: href
    }, (err, response, hrefBody) => {
      if (err) return eachCb(err);
      let $ = cheerio.load(hrefBody);
      const linkData = fetchData($('div').text());
      linkData.emails.forEach((email) => {
        if (!domainData.emails.includes(email)) { domainData.emails.push(email); }
      });
      linkData.links.forEach((link, i) => {
        if (link && !domainData.links.includes(link)) { domainData.links.push(link); }
      });
      eachCb();
    });
  }, (err) => {
    if (err) return callback(err);
    callback(null, domainData);
  });
};
