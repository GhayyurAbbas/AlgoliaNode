const mongodb = require("./../../helper/mongodb/mongodb.adapter");
const afService = {};
afService.dump_temp = (data)=>{
    return new Promise((resolve,reject)=>{
      mongodb();
        var dbo = db.db("TempAlgolia");
 
        dbo.collection("customers").insertMany(data, function(err, res) {
          if (err) throw err;
          console.log("Number of documents inserted: " + res.insertedCount);
          db.close();
          })
})
}
afService.dump_local = (data)=>{
    return new Promise((resolve,reject)=>{
      mongodb();
        var dbo = db.db("LocalAlgolia");
 
        dbo.collection("customers").insertMany(data, function(err, res) {
          if (err) throw err;
          console.log("Number of documents inserted: " + res.insertedCount);
          db.close();
          })
})
}

module.exports = afService;