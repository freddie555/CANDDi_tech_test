const express = require('express');
const inquirer = require('inquirer');
const bodyParser = require('body-parser');

const fetchHtml = require('../controllers/fetchHtml');

const searchDomain = () => {
  inquirer.prompt([{name: 'email', message: 'Enter an email to start your search:'}]).then((response) => {
    let email = response.email;
    const handleInvalid = () => {
      inquirer.prompt([{name: 'email', message: 'Invalid email. Please reenter:'}]).then((response) => {
        email = response.email;
      });
    };
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      handleInvalid();
      fetchHtml(email);
    } else {
      console.log('Loading data...');
      fetchHtml(email);
    }
  });
};

searchDomain();


// const app = express();
//
// app.use(bodyParser.json());
//
// app.post('/', (req, res) => {
//   return fetchHtml(req, res);
// });
//
// app.listen(3000, () => {
//   console.log('Listening on port 3000');
// });
