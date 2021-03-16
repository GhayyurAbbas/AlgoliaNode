const algoliasearch=require("algoliasearch");
const repos = require("../repositories/index");
const { json } = require("express");
const client=algoliasearch("WS3OELWDQ8","cfcde2a48b6802bc8ffb27a500e12652");
const index=client.initIndex("Test");
var http = require('http'),
fs = require('fs');


//this function is requesting collector for vouchers and then it is writing that data to xml file and also returning the xml data
exports.get_vouchers = ()=> {
    try{
        let res;
        console.log('get_voucher enter')
        //following url is provided by collectors 
        var request = http.get("http://ws-external.afnt.co.uk/apiv1/AFFILIATES/af_vouchers.asmx/Vouchers_getAllVouchers?username=muneeba.64@gmail.com&password=International01", function(response) {
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
    var data = fs.readFileSync('e:/Algolia.xml', 'utf8');
    
//collectorsresponse
//vouchers

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
