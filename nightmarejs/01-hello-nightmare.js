/**
 * Created by Shahzad on 13/01/2017.
 */

(function () {
  'use strict';

  /*dependencies*/
  var Nightmare = require('nightmare');


  /*locals*/


  /*initialization*/
  hello();


  /*function declarations*/

  //logs hello to nightmare with its version
  function hello() {
    var version;

    version = Nightmare.version;

    console.log('Hello Nightmare v' + version);
  }

})();
