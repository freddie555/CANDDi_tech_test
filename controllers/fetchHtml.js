const request = require('request');
const fetchData = require('./fetchData');
const cheerio = require('cheerio');
const async = require('async');

module.exports = (email) => {
  const domain = 'http://www.' + email.slice(email.indexOf('@') + 1);
  const requestHome = (callback) => {
    request({
      method: 'GET',
      url: domain
    }, function (err, response, body) {
      if (err) return callback(err);

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
    async.eachSeries(hrefs, (href, eachCb) => {
      request({
        method: 'GET',
        url: href
      }, (err, response, hrefBody) => {
        if (err) {console.log('there is error'); return eachCb(err); }

        let $ = cheerio.load(hrefBody);
        const linkData = fetchData($('div').text());
        linkData.emails.forEach((email) => {
          if (!domainData.emails.includes(email)) {domainData.emails.push(email);}
        });
        linkData.phones.forEach((phone) => {
          if (!domainData.phones.includes(phone)) {domainData.phones.push(phone);}
        });
        linkData.places.forEach((place, i) => {
          if (!domainData.places.includes(place)) {domainData.places.push(place);}
        });
        // domainData.emails = domainData.emails.concat(linkData.emails);
        // domainData.phones = domainData.phones.concat(linkData.phones);
        // domainData.places = domainData.places.concat(linkData.places);
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
       console.log('Here is your data:');
       console.log('emails:  ' + data.emails);
       console.log('phone numbers:  ' + data.phones);
       console.log('places:  ' + data.places);
     }
   });
};
