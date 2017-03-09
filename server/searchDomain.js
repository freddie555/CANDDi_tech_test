const inquirer = require('inquirer');

const fetchHtml = require('../controllers/fetchHtml');

const searchDomain = () => {
  inquirer.prompt([{name: 'email', message: 'Enter an email to start your search:'}]).then((response) => {
    let email = response.email;

    const handleInvalid = () => {
      inquirer.prompt([{name: 'email', message: 'Invalid email. Please reenter:'}]).then((response) => {
        if (response.email.indexOf('@') === -1 || response.email.indexOf('.') === -1) {
          handleInvalid();
        } else {
          fetchHtml(response.email);
        }
      });
    };

    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      handleInvalid();
    } else {
      fetchHtml(email);
    }
  });
};

searchDomain();

module.exports = searchDomain;
