/**
 * Created by Shahzad on 13/01/2017.
 */

(function () {
  'use strict';

  /*dependencies*/
  var Nightmare = require('nightmare');


  /*locals*/
  var browser;

  /*initialization*/
  browser = Nightmare();

  start();


  /*function declarations*/

  //Retrieves the Title and Link info for top 10 google results
  function start() {
    var URL, results;

    results = {
      xoxo: 'xoxo value'
    };

    //generate URL to use for query
    URL = 'https://www.google.com.pk/';

    //console.log(URL);

    //execute the request
    browser
      .goto(URL)
      .evaluate(function () {
        return {foo: 'foo value'};
      })
      //.wait(100)
      //.wait(100)
      //.click('#footer')
      //.wait(100)
      .wait(100)
      .then(function (info) {
        console.log('received eval1 info', info);

        //can maintain module's variables too
        results.eval1 = info;

        return browser.use(function (browser) {

          browser.evaluate(function (eval1Info) {
            eval1Info.bar = 'bar value';
            return eval1Info;

          }, info);

        });
      })
      .then(function (info) {
        console.log('received eval2 info', info);

        //can maintain module's variables too
        results.eval2 = info;

        return browser.use(function (browser) {

          browser
            .evaluate(function (eval2Info) {
              eval2Info.baz = 'baz value';
              return eval2Info;

            }, info);

        });
      })
      .then(function (finalInfo) {
        console.log('received final info');
        console.log(finalInfo);
        console.log(results);
        return browser.end();
      })
      .catch(function (err) {
        console.log('Error occurred.');
        console.log(err);

        return browser.end();
      });

  }

})();
