const Knwl = require('knwl.js');
const _ = require('underscore');

module.exports = (body) => {
  let domainData = {};
  let knwlInstance = new Knwl('english');
  knwlInstance.init(body);
  domainData.emails = _.uniq(knwlInstance.get('emails').map((emailObj) => { return emailObj.address; }));
  domainData.links = _.uniq(knwlInstance.get('links').map((linkObj) => { return linkObj.link; }));
  return domainData;
};
