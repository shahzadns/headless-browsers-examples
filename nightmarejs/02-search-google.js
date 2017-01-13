/**
 * Created by Shahzad on 13/01/2017.
 */

(function () {
  'use strict';

  /*dependencies*/
  var Nightmare = require('nightmare');


  /*locals*/
  var browser, search;

  /*initialization*/
  browser = Nightmare();

  search = 'Headless Browsers';
  searchGoogle(search);


  /*function declarations*/

  //logs hello to nightmare with its version
  function searchGoogle(searchString) {
    var URL, encodedString;

    //encodes the string for query
    encodedString = encodeURIComponent(searchString);

    //Google desired - replace the encoded space with plus character
    encodedString = encodedString.replace(/%20/g, '+');

    //generate URL to use for query
    URL = 'https://www.google.com.pk/#q=' + encodedString;

    console.log(URL);

    //execute the request
    browser
      .goto(URL)
      //.wait('#main #cnt #center_col #res ._NId') //faster but could get outdated if Google changes the layout
      .wait('#res')
      .evaluate(function () {
        var resultsDOM, resultsArray;

        resultsArray = [];

        resultsDOM = document.querySelectorAll('#res ._NId h3 a');

        for (var i = 0; i < resultsDOM.length; i++) {
          resultsArray.push({
            title: resultsDOM[i].innerHTML,
            link: resultsDOM[i].href
          });
        }

        return resultsArray;
      })
      .end()
      .then(function (results) {
        console.log('Top 10 results retrieved');
        console.log(results);
      });

  }

})();
