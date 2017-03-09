const Knwl = require('knwl.js');
const _ = require('underscore');
const placesPlugin = require('../node_modules/knwl.js/default_plugins/places');
const emailsPlugin = require('../node_modules/knwl.js/default_plugins/emails');
const phonesPlugin = require('../node_modules/knwl.js/experimental_plugins/international_phones');

module.exports = (body) => {
  let domainData = {};
  let knwlInstance = new Knwl('english');
  knwlInstance.register('emails', emailsPlugin);
  knwlInstance.register('phones', phonesPlugin);
  knwlInstance.register('places', placesPlugin);
  knwlInstance.init(body);
  domainData.emails = _.uniq(knwlInstance.get('emails').map((emailObj) => { return emailObj.address; }));
  domainData.phones = _.uniq(knwlInstance.get('phones').map((phoneObj) => { return phoneObj.phone; }));
  domainData.places = _.uniq(knwlInstance.get('places').map((placeObj) => { return placeObj.place; }));
  return domainData;
};
