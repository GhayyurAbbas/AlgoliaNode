var http = require('http'),
fs = require('fs');
const fetch=require('node-fetch');
//this function is requesting collector for vouchers and then it is writing that data to text file 
webgain={}

webgain.get_vouchers_WebGainsVoucherData = ()=> {
    try{
       
        //following url is provided by collectors 
        return new Promise((resolve,reject)=>{
            fetch(process.env.WEBGAINSVOUCHERDATA_COLLECTOR_KEY)
            //.then(res=>JSON.parse(res))
           .then(json=>{
             //  console.log(json.body);
            var file= fs.createWriteStream("./AlgoliaWebGains.json")
         json.body.pipe(file);
        
        //        resolve(json)
            }).then(function(){
                   fetch(process.env.WEBGAINSDEALSDATA_COLLECTOR_KEY)
            //.then(res=>JSON.parse(res))
           .then(json=>{
             //  console.log(json.body);
            var file2= fs.createWriteStream("./AlgoliaWebGains2.json")
         json.body.pipe(file2);
        file2.on('finish',resolve);
        //        resolve(json)
            });
            });
         
       });


}
    catch(err)
    {

return "error: "+err
    }

  };
 
  module.exports=webgain;