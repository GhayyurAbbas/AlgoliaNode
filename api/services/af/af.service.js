const mongodb = require("./../../helper/mongodb/mongodb.adapter");
   var MongoClient = require('mongodb');
      var url = "mongodb://localhost:27017/Algolia";
const afService = {};
afService.dump_temp = (data)=>{
    return new Promise((resolve,reject)=>{
     // var url = "mongodb://localhost:27017/Algolia";

   console.log('in service')
      const uri = url;
      
      MongoClient.connect( url,function(err,db){
         // console.log(db)
          db.collection("tempdb").insertMany(data, function(err, res) {
            console.log('enter')
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            console.log('ret')
            return data;
            })
          });
          return data;
      // index
})
}
afService.dump_local = (data)=>{
    return new Promise((resolve,reject)=>{
    
      const uri = url;
      
      MongoClient.connect( url,function(err,db){
         // console.log(db)
          db.collection("tempdb").insertMany(data, function(err, res) {
            console.log('enter')
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            return data;
            })
          });
          return data;
})
}

module.exports = afService;