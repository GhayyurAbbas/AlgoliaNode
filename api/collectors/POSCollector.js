var http = require('http'),
fs = require('fs');

//this function is requesting collector for vouchers and then it is writing that data to text file 
exports.get_vouchers = ()=> {
    try{
       
        //following url is provided by collectors 
        return new Promise((resolve,reject)=>{
            http.get(process.env.POS_COLLECTOR_KEY, function(response) {
       console.log(response+"res");
       console.log('if');
        var file= fs.createWriteStream("./Algolia.txt")
        response.pipe(file);
      file.on('finish',resolve);
   })
       });


}
    catch(err)
    {

return "error: "+err
    }

  };