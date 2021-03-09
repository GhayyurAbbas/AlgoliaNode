'use strict';

const { fstat } = require('fs');

module.exports = function(app) {
  var afcollector = require('../collectors/AFCollector');
  var afcontroller = require('../Controllers/AF');

  // todoList Routes
  app.route('/api/AF/')
    .get(afcontroller.script_vouchers)


 
    
};