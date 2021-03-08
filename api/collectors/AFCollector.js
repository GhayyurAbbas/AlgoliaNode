const algoliasearch=require("algoliasearch");
const repos = require("../repositories/index");
const { json } = require("express");
const client=algoliasearch("WS3OELWDQ8","cfcde2a48b6802bc8ffb27a500e12652");
const index=client.initIndex("Test");
var http = require('http'),
fs = require('fs');
const xml2js = require('xml2js');
exports.get_vouchers = async function(req, res) {
    try{
        var request = http.get("http://ws-external.afnt.co.uk/apiv1/AFFILIATES/af_vouchers.asmx/Vouchers_getAllVouchers?username=muneeba.64@gmail.com&password=International01", function(response) {
    if (response.statusCode === 200) {
        var file = fs.createWriteStream("D:/Algolia.xml");
        response.pipe(file);
    }
    request.setTimeout(12000, function () {
        request.abort();
    });
});

const xml = fs.readFileSync('D:/Algolia.xml');
xml2js.parseString(xml,{trim:true},{explicitArray:true}, { mergeAttrs: false }, (err, result) => {
    if (err) {
        throw err;
    }
    const json = JSON.stringify(result, null, 4);
    fs.writeFileSync('D:/Algolia.json', json);

}); 
const obj=require("D:/Algolia.json");
var oo=[];
var a=obj.ReturnVoucherObj.Vouchers[0].Voucher;
for(i=0;i<a.length;i++)
{
    oo.push({
        ProgrammeID: a[i].ProgrammeID[0],
 
    })
}
console.log(oo)
//dumping temporarily 
var flagNewData=true;
const data = await repos.afRepo.dump_temp(oo);

if(flagNewData){

    index
    .saveObjects(oo, { autoGenerateObjectIDIfNotExist: true })
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    });
}


    var errobj={
        statusCode:"200",
        body:"Vouchers Successfully updated to Algolia"
    }
           res.json(errobj)
    }
    catch(err)
    {
var errobj={
    statusCode:"500",
    body:JSON.stringify(err)
}
res.send(errobj)
    }
    
  };
  