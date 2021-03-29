const repos = require("../repositories/index");
const { json } = require("express");
var http = require('http'),
fs = require('fs');


//this function is requesting collector for vouchers and then it is writing that data to xml file and also returning the xml data
exports.get_vouchers = ()=> {
    try{
        let res;
        console.log('get_voucher enter')
        //following url is provided by collectors 
        var request = http.get(process.env.AF_COLLECTOR_KEY, function(response) {
    if (response.statusCode === 200) {
        fs.truncate('./Algolia.xml', 0, function(){})
        //writing xml response to Algolia.xml file
        var file = fs.createWriteStream('./Algolia.xml')
        response.pipe(file);
    }
    request.setTimeout(12000, function () {
        request.abort();
    });
});
const xml = fs.readFileSync('./Algolia.xml');
try {
    //reading xml as string and returning
    var data = fs.readFileSync('./Algolia.xml', 'utf8');
    
//collectorsresponse
//vouchers//
//fs.unlinkSync('./Algolia.xml')
    return data    
} catch(e) {
    console.log('Error:', e.stack);
}
}
    catch(err)
    {

return "error: "+err
    }

  };
