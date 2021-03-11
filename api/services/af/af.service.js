/* #region  imports */
const mongodb = require("./../../helper/mongodb/mongodb.adapter");
var MongoClient = require('mongodb');
var url = "mongodb://localhost:27017/Algolia";
const afService = {};

/* #endregion */
//dumping data to collectorsresponse
afService.dump_temp = (data) => {
  return new Promise((resolve, reject) => {
    // var url = "mongodb://localhost:27017/Algolia";

    console.log('in service')
    const uri = url;

    MongoClient.connect(url, function (err, db) {
      console.log(data)
      db.collection("tempdb").insertOne(data)
    });
    return data;
    // index
  })
}
//getting all not processed objects 
afService.get_temp = async () => {
  let d = []
  var db = await MongoClient.connect(url);
  d = await db.collection("tempdb").find({ status: 'Not Processed' }).toArray()
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
      db.collection("tempdb").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    });

  })
}
afService.get_local = async () => {
  let d = []
  var db = await MongoClient.connect(url);
  d = await db.collection("localdb").find({}).toArray()
  return d;
}
//unix timestamp for testing 3/11/2021 mm/dd/yyyy 1615462304
afService.get_expired_vouchers = async (todayunixtimestamp) => {
  let d = []
  var db = await MongoClient.connect(url);
  d = await db.collection("localdb").find({ EndUnixTimeStamp: { $lt: todayunixtimestamp } }).toArray()
  return d;
}
//dumping data to collection vouchers 
afService.dump_local = (data) => {
  return new Promise((resolve, reject) => {

    const uri = url;

    MongoClient.connect(url, function (err, db) {
      // console.log(db)
      db.collection("localdb").insertMany(data, function (err, res) {
        console.log('enter')
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();

      })
    });

  })
}

module.exports = afService;