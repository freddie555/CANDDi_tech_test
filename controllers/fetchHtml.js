const request = require('request');
const fetchData = require('./fetchData');
const cheerio = require('cheerio');

module.exports = (req, res) => {
  const domain = 'http://www.' + req.body.email.slice(req.body.email.indexOf('@') + 1);
  request({
    method: 'GET',
    url: domain
  }, function (err, response, body) {
    let $ = cheerio.load(body);
    console.log($('a').text(), 'all h1s');
    if (err) return res.status(404).send({error: err});
    return res.status(200).send(fetchData(body));
  }
  );
};
