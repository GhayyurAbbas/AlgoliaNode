const algoliasearch=require("algoliasearch");
const afcollector = require("../collectors/AFCollector");
const repos = require("../repositories/index");
const client=algoliasearch("WS3OELWDQ8","cfcde2a48b6802bc8ffb27a500e12652");
const index=client.initIndex("Test");
var MongoClient = require('mongodb');
const repo = require("../repositories/af/af.repo");
var url = "mongodb://localhost:27017/Algolia";
const xml2js = require('xml2js');
var http = require('http'),
fs = require('fs');
var assert=require('assert')
const BBVConstants=require('../../BBVConstants')
const isNullOrWhiteSpace=require('../../isNullOrWhiteSpace')

// async function  get_temp(){
//     let d=[]
// var db=await MongoClient.connect(url);
// d=await db.collection("tempdb").find({}).toArray()
//       return d;
      
  
// }
//this function is parsing xml string to json data. Here we are using xml2js package provided by npm........
function get_json_parsed_data(data){

console.log('entering the parsed function')
   // const xml = fs.readFileSync('D:/Algolia.xml');
    xml2js.parseString(data,{trim:true},{explicitArray:true}, { mergeAttrs: false }, (err, result) => {
        if (err) {
            throw err;
        }
        const json = JSON.stringify(result, null, 4);
        fs.truncate('D:/Algolia.json', 0, function(){console.log('done')})
        fs.writeFileSync('D:/Algolia.json', json);
    
    }); 
    console.log('parsed')
    const obj=require("D:/Algolia.json");
   
    var oo=[];
    var a=obj.ReturnVoucherObj.Vouchers[0].Voucher;
    for(i=0;i<a.length;i++)
    {
        oo.push({
            BBVID:BBVConstants.BBV_AF_ID_Prefix+a[i].VoucherID[0],
            PromotionID: a[i].VoucherID[0],
            Advertiser: a[i].MerchantSiteName[0],
            AdvertiserID: a[i].ProgrammeID[0],
            DataType: (assert(a[i].VoucherCode[0],'N/A')||isNullOrWhiteSpace(a[i].VoucherCode[0]))?'2':'1',
            Code:a[i].VoucherCode[0],
            Title:a[i].VoucherDescription[0],
            ShortDescription:a[i].CategoryName[0],
            Categories:a[i].CategoryName[0],
            Starts:a[i].StartDate[0],
            Ends:a[i].EndDate[0],
            DeepLinkTracking:a[i].Tracking_URL[0],
            LogoLink:a[i].ImageURL[0],
            objectID:BBVConstants.BBV_AF_ID_Prefix+a[i].VoucherID[0],
     
        })
    }
  //  console.log(oo)
    return oo;
}
exports.script_vouchers = async function(req, res) {
    try{
        
var flagNewData=false;
var xmldata=afcollector.get_vouchers()

var oo=[]
//console.log(oo)
console.log('vouchers recieved')
console.log(xmldata)
if(!oo.includes("error")){

    //dumping temporarily 
    console.log('dumping data')
    repos.afRepo.dump_temp({Date:Date.now(),RawData:xmldata,status:'Not Processed',collector:{name:'AF',   }}, );
// var tempdbdata=oo
 var tempdbdata=await repo.get_temp()
 console.log('raw data dumped')
 console.log('from mongo')
 console.log(tempdbdata.length)
 let vouchersarray=[];
 tempdbdata.forEach(
     function(item)
     {
         vouchersarray.push(...get_json_parsed_data(item.RawData))
     }
 )
 console.log(vouchersarray.length)
 ///////////////////////////////////first check point**************
 //
// var filteredarray=[]
// tempdbdata.forEach(function(item) {
//     if (item.ProgrammeID in localdbdata) {
//         console.log('already present')
//     }
//     else{
//      filteredarray.push({
//         ProgrammeID: item.ProgrammeID,
 
//     })
//     }
//   });
  //repos.afRepo.dump_local(filteredarray);
flagNewData=true;

if(flagNewData){

    // index
    // .saveObjects(filteredarray, { autoGenerateObjectIDIfNotExist: true })
    // .then(({ objectIDs }) => {
    //   console.log(objectIDs);
    // });
    flagNewData=false;
     var errobj={
        statusCode:"200",
        body:"Vouchers Successfully updated to Algolia"
    }
           res.json(errobj)
}
else{
    var errobj={
    statusCode:"200",
    body:"Something went wrong"
}
       res.json(errobj)
}

   
}
else{
    var errobj={
        statusCode:"500",
        body:oo
    }
           res.json(errobj)
}

    }
    catch(err)
    {
var errobj={
    statusCode:"500",
    body:JSON.stringify(err)
}
res.json(errobj)
    }

}