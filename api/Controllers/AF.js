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
// async function  get_temp(){
//     let d=[]
// var db=await MongoClient.connect(url);
// d=await db.collection("tempdb").find({}).toArray()
//       return d;
      
  
// }
function get_json_parsed_data(){

    const xml = fs.readFileSync('D:/Algolia.xml');
    xml2js.parseString(xml,{trim:true},{explicitArray:true}, { mergeAttrs: false }, (err, result) => {
        if (err) {
            throw err;
        }
        const json = JSON.stringify(result, null, 4);
        fs.writeFileSync('D:/Algolia.json', json);
    
    }); 
    console.log('parsed')
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
    return oo;
}
exports.script_vouchers = async function(req, res) {
    try{
        
var flagNewData=false;
var xmldata=afcollector.get_vouchers()

var oo=get_json_parsed_data()
console.log(oo)
if(!oo.includes("error")){
    //dumping temporarily 
 



repos.afRepo.dump_temp({Date:Date.now(),RawData:xmldata,status:'Not Processed'});
var tempdbdata=oo
var localdbdata=await repo.get_local()
var filteredarray=[]
tempdbdata.forEach(function(item) {
    if (item.ProgrammeID in localdbdata) {}
    else{
     filteredarray.push({
        ProgrammeID: item.ProgrammeID,
 
    })
    }
  });
  repos.afRepo.dump_local(filteredarray);
flagNewData=true;

if(flagNewData){

    index
    .saveObjects(filteredarray, { autoGenerateObjectIDIfNotExist: true })
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    });
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