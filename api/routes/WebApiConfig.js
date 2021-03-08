'use strict';

const { fstat } = require('fs');

module.exports = function(app) {
  var afcollector = require('../collectors/AFCollector');

  // todoList Routes
  app.route('/api/AF/')
    .get(afcollector.get_vouchers)


 
    
};