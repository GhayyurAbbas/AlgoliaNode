var MongoClient = require('mongodb').MongoClient;
var url = process.env.CONNECTION_STRING;
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