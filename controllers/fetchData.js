const Knwl = require('knwl.js');
const placesPlugin = require('../node_modules/knwl.js/default_plugins/places');
const emailsPlugin = require('../node_modules/knwl.js/default_plugins/emails');
const phonesPlugin = require('../node_modules/knwl.js/default_plugins/phones');

module.exports = (body) => {
  let domainData = {};
  let knwlInstance = new Knwl('english');
  knwlInstance.register('emails', emailsPlugin);
  knwlInstance.register('phones', phonesPlugin);
  knwlInstance.register('places', placesPlugin);
  knwlInstance.init(body);
  domainData.emails = knwlInstance.get('emails').map((emailObj) => { return emailObj.address; });
  domainData.phones = knwlInstance.get('phones').map((phoneObj) => { return phoneObj.phone; });
  domainData.places = knwlInstance.get('places').map((placeObj) => { return placeObj.place; });
  return domainData;
};