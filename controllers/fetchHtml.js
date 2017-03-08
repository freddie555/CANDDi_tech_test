const request = require('request');
const fetchData = require('./fetchData');
const cheerio = require('cheerio');
const async = require('async');

module.exports = (req, res) => {
  const domain = 'http://www.' + req.body.email.slice(req.body.email.indexOf('@') + 1);

  const requestHome = (callback) => {
    request({
      method: 'GET',
      url: domain
    }, function (err, response, body) {
      if (err) return callback(err);
      let domainData = fetchData(body);
      let $ = cheerio.load(body);
      const hrefs = $('a').map((i, el) => { return $(el).attr('href'); }).get();
      const filteredHrefs = hrefs.map((href) => {
        if (href[0] === '/') href = domain + href;
        return href;
      })
      .filter((href) => {
        return href.slice(0, 4) === 'http';
      });
      callback(null, domainData, filteredHrefs)
    }

    );
  }

  const requestLinks = (domainData, hrefs, callback) => {
    console.log(hrefs, 'hrefs');
    console.log(domainData, 'domainData');
    async.eachSeries(hrefs, (href, eachCb) => {
      request({
        method: 'GET',
        url: href
      }, (err, response, hrefBody) => {
        if (err) {console.log('there is error');return eachCb(err);}
        console.log('each');
        const linkData = fetchData(hrefBody);
        domainData.emails = domainData.emails.concat(linkData.emails);
        domainData.phones = domainData.phones.concat(linkData.phones);
        domainData.places = domainData.places.concat(linkData.places);
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
