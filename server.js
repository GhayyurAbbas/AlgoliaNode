var express = require('express'),
dotenv=require('dotenv');
dotenv.config();
  app = express(),
  port = process.env.PORT || 3000;

  var routes = require('./api/routes/WebApiConfig'); //importing route
routes(app); //register the route
app.listen(port);
const nightly_schedular=require('./Scheduler/NightlyScheduler');
console.log('todo list RESTful API server started on: ' + port);
nightly_schedular.nightly_schedular();
// const pos=require('./api/Controllers/POS');
// pos.script_vouchers();
console.log('schedule set for 12 am');