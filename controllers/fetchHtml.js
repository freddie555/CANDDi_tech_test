const request = require('request');
const fetchData = require('./fetchData');
const cheerio = require('cheerio');
const async = require('async');

module.exports = (email) => {
  const domain = 'http://www.' + email.slice(email.indexOf('@') + 1);
  const requestHome = (callback) => {
    console.log('Requesting home page...');

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

  const requestLinks = (domainData, hrefs, callback) => {
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

  async.waterfall([
    requestHome,
    requestLinks
  ], (err, data) => {
    if (err) {
      console.log('There is an error');
    } else {
      console.log(`\nHere is your data for ${email}:\n\nemails:\n${data.emails}\n\nlinks:\n${data.links}\n`);
    }
  });
};
