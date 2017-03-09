const async = require('async');

const requestHome = require('./requestHome');
const requestLinks = require('./requestLinks');

module.exports = (email) => {
  const domain = 'http://www.' + email.slice(email.indexOf('@') + 1);
  async.waterfall([
    requestHome.bind({domain: domain}),
    requestLinks
  ], (err, data) => {
    if (err) {
      console.log('There is an error');
    } else {
      console.log(`\nHere is your data for ${email}:\n\nemails:\n${data.emails.join('\n')}\n\nlinks:\n${data.links.join('\n')}\n`);
    }
  });
};
