var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports=function (){
    const uri = url;
    const client = new MongoClient(uri);
    try {
       return client;
    } catch (e) {
        console.error(e);
    } finally {
       
    }
}