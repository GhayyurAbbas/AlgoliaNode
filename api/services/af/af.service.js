/* #region  imports */
const mongodb = require("./../../helper/mongodb/mongodb.adapter");
var MongoClient = require('mongodb');
// const dotenv=require('dotenv');
// dotenv.config();
var url = process.env.CONNECTION_STRING;
const afService = {};

/* #endregion */
//dumping data to collectorsresponse
afService.dump_temp = (data) => {
  return new Promise((resolve, reject) => {

    console.log('in service'+url)
    const uri = url;

    MongoClient.connect(url, function (err, db) {
      console.log(data)
      db.collection("collectorsresponse").insertOne(data)
    });
    resolve(data)
    // index
  })
}
afService.dump_temp2 = (data) => {
  return new Promise((resolve, reject) => {

    console.log('in service'+url)
    const uri = url;

    MongoClient.connect(url, function (err, db) {
      console.log(data)
      db.collection("collectorsresponse").insertMany(data)
    });
    resolve(data)
    // index
  })
}
//getting all not processed objects 
afService.get_temp = async (collectorname) => {
  let d = []
  var db = await MongoClient.connect(url);
  d = await db.collection("collectorsresponse").find({ status: 'Not Processed',collector:{name:collectorname} }).toArray()
  return d;
}
//updating status of not processed rawdata to processed
afService.update_rawdata_status = async (id) => {
  return new Promise((resolve, reject) => {

    const uri = url;

    MongoClient.connect(url, function (err, db) {
      // console.log(db)
      var myquery = { _id: id };
      var newvalues = { $set: { status: 'Processed' } };
      db.collection("collectorsresponse").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
        resolve(id);
      });
    });

  })
}
afService.get_local = async () => {
  let d = []
  var db = await MongoClient.connect(url);
  d = await db.collection("vouchers").find({}).toArray()
  return d;
}
//unix timestamp for testing 3/11/2021 mm/dd/yyyy 1615462304
afService.get_expired_vouchers = async (todayunixtimestamp) => {
  let d = []
  var db = await MongoClient.connect(url);
  d = await db.collection("vouchers").find({ EndUnixTimeStamp: { $lt: todayunixtimestamp } }).toArray()
  return d;
}
//dumping data to collection vouchers 
afService.dump_local = (data) => {
  return new Promise((resolve, reject) => {

    const uri = url;

    MongoClient.connect(url, function (err, db) {
      db.collection("vouchers").insertMany(data, function (err, res) {
        console.log('enter')
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();

      })
    });

  })
}

module.exports = afService;
