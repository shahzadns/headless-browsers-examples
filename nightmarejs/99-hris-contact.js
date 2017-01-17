/**
 * Created by Shahzad on 13/01/2017.
 */

(function () {
  'use strict';

  /*dependencies*/
  var Nightmare = require('nightmare');
  var json2csv = require('json2csv');

  var fs = require('fs');

  /*locals*/
  var browser, columns;

  /*initialization*/

  //columns mapping for extracting contact details
  columns = {
    labels: ['First (& Middle) Name', 'Last Name', 'Job Title', 'Location', 'Email', 'Work Telephone'],
    keys: ['firstAndMidName', 'lastName', 'jobTitle', 'location', 'email', 'workTelephone']
  };

  //initiate the browser instance
  browser = Nightmare({
    switches: {
      'ignore-certificate-errors': true
    }
  });

  //check for missing credentials
  if (!process.argv[2] || !process.argv[3]) {
    console.log('Missing credentials. Expected command format "node 99-hris-contact.js john.doe yourpassword"');
    return;
  }

  //start the party
  loginToHRIS({ //should be dynamic via process params
    username: process.argv[2],
    password: process.argv[3]
  });


  /*function declarations*/

  //logs in to the HRIS and extract the info
  function loginToHRIS(credentials) {
    var URL;

    URL = 'https://hr.mobilelive.ca/symfony/web/index.php/policy/companyContact?sortField=firstMiddleName&sortOrder=ASC';

    //execute the request
    browser
      .goto(URL)
      .type('#txtUsername', credentials.username)
      .type('#txtPassword', credentials.password)
      .click('#btnLogin')
      .wait(function () {

        //look for contacts list if correct credentials provided OR for error message if credentials are not valid
        return document.querySelector('#contactList') || document.querySelector('#spanMessage');
      })
      .evaluate(loginHandler)
      .end()
      .then(function (data) {
        var csv;

        if (data.contacts) {

          console.log(data.contacts.length + ' contacts retrieved', data.contacts[0]);

          //convert JSON into CSV
          csv = json2csv({
            data: data.contacts,
            fields: columns.keys,
            fieldNames: columns.labels
          });

          //create a CSV file on same directory
          fs.writeFile('ml-hris-contacts.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
          });

        } else {
          console.log('retrieving contact details failed.');
          console.log(data.error);
        }

        browser.end();
      })
      .catch(function (reason) {
        console.log('retrieving contact details failed.');
        console.log(reason);
      });
  }

  //checks for login success and errors
  function loginHandler() {
    var data;

    data = {};

    if ($('#contactList').length) {

      data.contacts = extractContacts();

    } else if ($('#spanMessage').length) {

      data.error = $('#spanMessage').text();

    } else {

      data.error = 'Sorry something went wrong. Couldn\'t reach to contacts section.';
    }

    return data;

    /*functions declarations within instance scope*/

    //returns all contacts as a JSON
    function extractContacts() {
      var columnsKeys, contacts, contact;

      //TODO refactor to utilized columns.keys on both ends. could use it as script with .inject()
      //columns mapping for extracting
      columnsKeys = ['firstAndMidName', 'lastName', 'jobTitle', 'location', 'email', 'workTelephone'];

      //contact list to be filled up
      contacts = [];

      //iterate through each contact
      $('#tableWrapper table tbody tr').each(function () {

        //refresh the contact detail for new one
        contact = {};

        //iterate through each column
        $(this).children('td').each(function (colIndex) {

          //add column info into the current contact details according to the columns mapping
          contact[columnsKeys[colIndex]] = $(this).text() || 'Not Available';
        });

        //add the contact into the list
        contacts.push(contact);
      });

      //return the extracted contacts list JSON
      return contacts;
    }

  }

})();
