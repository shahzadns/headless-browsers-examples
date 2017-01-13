/**
 * Created by Shahzad on 13/01/2017.
 */

(function () {
  'use strict';

  /*dependencies*/
  var Nightmare = require('nightmare');


  /*locals*/
  var browser, personName;

  /*initialization*/
  browser = Nightmare();

  personName = 'Zain Abbas'; //should be dynamic via process params

  loginToHRIS({ //should be dynamic via process params
    username: 'shahzad.nawaz',
    password: ''
  });


  /*function declarations*/

  //logs hello to nightmare with its version
  function loginToHRIS(credentials) {
    var URL;

    //URL = 'https://hr.mobilelive.ca/symfony/web/index.php/policy/companyContact?sortField=firstMiddleName&sortOrder=ASC';
    URL = 'https://hr.mobilelive.ca/symfony/web/index.php/auth/login';
    //URL = 'https://www.google.com.pk/';

    //console.log(URL);

    //execute the request
    browser
      .goto(URL)
      //.type('#txtUsername', credentials.username)
      //.type('#txtPassword', credentials.password)
      //.click('#btnLogin')
      //.wait('#contactList')
      //.evaluate(getPersonDetails)
      .end()
      .then(function (details) {
        console.log('Contact details retrieved');
        console.log(details);
      });
  }

  //return details object for the given person name.
  function getPersonDetails(name) {
    var details;

    details = {};

    //console.log('Jquery version', $.fn.jquery);


    return {};
  }

})();
