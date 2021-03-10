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
        fs.truncate('D:/Algolia.xml', 0, function(){
         //   console.log('done')
        })
        //writing xml response to Algolia.xml file
        var file = fs.createWriteStream("D:/Algolia.xml");
        response.pipe(file);
    
      // repos.afRepo.dump_temp({Date:Date.now(),RawData:response,status:'Not Processed'});
    }
    request.setTimeout(12000, function () {
        request.abort();
    });
});
const xml = fs.readFileSync('D:/Algolia.xml');
try {
    //reading xml as string and returning
    var data = fs.readFileSync('D:/Algolia.xml', 'utf8');
   //console.log(data);
//     repos.afRepo.dump_temp({Date:Date.now(),RawData:xmldata,status:'Not Processed',
// collector:{
//     name:'AF',
    
// }
// },
//     );
    return data    
} catch(e) {
    console.log('Error:', e.stack);
}

// xml2js.parseString(xml,{trim:true},{explicitArray:true}, { mergeAttrs: false }, (err, result) => {
//     if (err) {
//         throw err;
//     }
//     const json = JSON.stringify(result, null, 4);
//     fs.writeFileSync('D:/Algolia.json', json);

// });
// const obj=require("D:/Algolia.json");
// var oo=[];
// var a=obj.ReturnVoucherObj.Vouchers[0].Voucher;
// for(i=0;i<a.length;i++)
// {
//     oo.push({
//         ProgrammeID: a[i].ProgrammeID[0],
//collectorsresponse
//vouchers

//     })
// }
// console.log(oo)
// return oo;
// //dumping temporarily
// var flagNewData=false;
// repos.afRepo.dump_temp(oo);
// flagNewData=true;

// if(flagNewData){

//     index
//     .saveObjects(oo, { autoGenerateObjectIDIfNotExist: true })
//     .then(({ objectIDs }) => {
//       console.log(objectIDs);
//     });
//     flagNewData=false;
// }


//     var errobj={
//         statusCode:"200",
//         body:"Vouchers Successfully updated to Algolia"
//     }
//            res.json(errobj)
    }
    catch(err)
    {
// var errobj={
//     statusCode:"500",
//     body:JSON.stringify(err)
// }
return "error: "+err
    }

  };
