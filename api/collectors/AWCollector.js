var http = require('http'),
fs = require('fs');
const fetch=require('node-fetch');
//this function is requesting collector for vouchers and then it is writing that data to text file 
exports.get_vouchers = ()=> {
    try{
       
        //following url is provided by collectors 
        return new Promise((resolve,reject)=>{
   fetch(process.env.AWDATA_COLLECTOR_KEY)
   .then(json=>{
      console.log(json.body);
   var file= fs.createWriteStream("./AlgoliaAW.text")
json.body.pipe(file);
file.on('finish',resolve);
//        resolve(json)
   });
       });


}
    catch(err)
    {

return "error: "+err
    }

  };