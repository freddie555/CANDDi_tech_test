const request = require('request');
const fetchData = require('./fetchData');
const cheerio = require('cheerio');
const async = require('async');

module.exports = (req, res) => {
  const domain = 'http://www.' + req.body.email.slice(req.body.email.indexOf('@') + 1);
  console.log(domain, 'domain');
  const requestHome = (callback) => {
    request({
      method: 'GET',
      url: domain
    }, function (err, response, body) {
      console.log(body, 'body');
      if (err) return callback(err);

      let $ = cheerio.load(body);
      const domainData = fetchData($('div').text());

      const hrefs = $('a').map((i, el) => { return $(el).attr('href'); }).get();
      console.log(hrefs, 'first hrefa');
      const filteredHrefs = hrefs.map((href) => {
        if (href[0] === '/') href = domain + href;
        return href;
      })
      .filter((href) => {
        return href.slice(0, 4) === 'http';
      });
      console.log(filteredHrefs, 'filtered');
      callback(null, domainData, filteredHrefs);
    }
  );
  };

  const requestLinks = (domainData, hrefs, callback) => {
    console.log(domainData, 'data');
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
     if (err) return res.status(404).send({error: err});
     return res.status(200).send({data});
   });
};
