var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

  var routes = require('./api/routes/WebApiConfig'); //importing route
routes(app); //register the route
app.listen(port);
const nightly_schedular=require('./Scheduler/NightlyScheduler');
console.log('todo list RESTful API server started on: ' + port);
nightly_schedular.nightly_schedular();
console.log('schedule set for 12 am');