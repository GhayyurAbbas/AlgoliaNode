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
          console.log(data)
          db.collection("tempdb").insertOne(data)
          });
          return data;
      // index
})
}
afService.get_temp=async()=>{
  let d=[]
  var db=await MongoClient.connect(url);
  d=await db.collection("tempdb").find({status:'Not Processed'}).toArray()
        return d;
}
afService.get_local=async()=>{
  let d=[]
  var db=await MongoClient.connect(url);
  d=await db.collection("localdb").find({}).toArray()
        return d;
}
afService.dump_local = (data)=>{
    return new Promise((resolve,reject)=>{
    
      const uri = url;
      
      MongoClient.connect( url,function(err,db){
         // console.log(db)
          db.collection("localdb").insertMany(data, function(err, res) {
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