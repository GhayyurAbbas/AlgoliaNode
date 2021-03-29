/* #region  package imports */
const algoliasearch = require("algoliasearch");
const awcollector = require("../collectors/AWCollector");
const repos = require("../repositories/index");
const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDICE);
const repo = require("../repositories/af/af.repo");
var assert = require('assert')
const BBVConstants = require('../../BBVConstants')
const isNullOrWhiteSpace = require('../../isNullOrWhiteSpace')
const BBVItem = require('../Models/BBVItem')
var convert = require('xml-js');
var fs = require('fs');
// const dotenv=require('dotenv');
// dotenv.config();
/* #endregion */
function get_json_parsed_data(data)
{console.log("enter in the function")
var a=data.split('\n');
console.log(a[1])
var oo=[];
    for (i = 1; i < a.length; i++) {
        var additem = true;
        var item = new BBVItem();
        if(a[i]=="")continue;
        var aitem=a[i].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g'));
        item.BBVID = BBVConstants.BBV_AW_ID_Prefix +aitem[0]!=""?aitem[0].replace('"','').replace('"',''):"";
        item.PromotionID = aitem[0]!=""?aitem[0].replace('"','').replace('"',''):"";
        item.Advertiser =aitem[1].replace('"','').replace('"','');
        item.AdvertiserID = aitem[2].replace('"','').replace('"','');
        item.DataType = aitem[3].replace('"','').replace('"','')=='Vouchers Only'?'1':'2';
        item.Code = aitem[4]!=undefined?aitem[4].replace('"','').replace('"',''):"";
        item.Title =aitem[5].replace('"','').replace('"','');
        //item.ShortDescription =('CategoryName' in a[i])? a[i].CategoryName._text:'';
        item.Categories =aitem[8]!=""?aitem[8].replace('"','').replace('"',''):"";
        aitem[6]=aitem[6].replace('"','').replace('"','')
        if(aitem[6]!=''&&aitem[6]!=undefined&&aitem[6]!=null){
            var sd=aitem[6].split('/');
            aitem[6]=sd[1]+'/'+sd[0]+'/'+sd[2];
        }
        item.Starts = aitem[6];
        aitem[7]=aitem[7].replace('"','').replace('"','');
        if(aitem[7]!=''&&aitem[7]!=undefined&&aitem[7]!=null){
            var sd=aitem[7].split('/');
            aitem[7]=sd[1]+'/'+sd[0]+'/'+sd[2];
        }
        item.Ends = aitem[7];
        item.DeepLinkTracking = aitem[11].replace('"','').replace('"','');
        item.Deeplink=aitem[12]!=""?aitem[12].replace('"','').replace('"',''):"";
        item.DateAdded=aitem[16]!=""?aitem[16].replace('"','').replace('"',''):"";
        item.LogoLink ="https://www.blablavouchers.com/blablavouchersdata/images/" + aitem[2].replace('"','').replace('"','') + ".gif";
        item.objectID = BBVConstants.BBV_POS_ID_Prefix +aitem[0].replace('"','').replace('"','');
        item.Regions=aitem[9]!=""?aitem[9].replace('"','').replace('"',''):"";
        item.Terms=aitem[10]!=""?aitem[10].replace('"','').replace('"',''):"";

        //fp
        console.log('first point');
      //  console.log(item);
   
        console.log('second point')
       // if (additem) {
            if (isNullOrWhiteSpace(item.Starts)) {
                continue;
            }
            var start = new Date(item.Starts);


            var end;
            if (!isNullOrWhiteSpace(item.Ends)) {
                end = new Date(item.Ends);
            }
            else {
                
                console.log(item.Starts)
                end = new Date(start+ 5 * 24 * 60 * 60 * 1000);
                console.log(end);
                item.SaveLocalKey = false;
            }
            //tp
            console.log('third point')
   
            var now = Date.now();
           item.Starts = start.toUTCString() + ":dd/MM/yyyy HH:mm:ss";
            item.Ends = end.toUTCString() + ':dd/MM/yyyy HH:mm:ss';
            console.log(item.Ends)

            item.StartUnixTimeStamp = Math.floor(new Date(start).getTime() / 1000);
            item.EndUnixTimeStamp = Math.floor(new Date(end).getTime() / 1000);
            console.log(item.StartUnixTimeStamp)
           console.log(start > Date.now())
            var tempdate=new Date();
            console.log(start<tempdate)
            if (start>tempdate){
                item.Status = "Upcoming";
               // console.log(JSON.parse(JSON.stringify(item)))
                oo.push(JSON.parse(JSON.stringify(item)));
                lastitem = item;
            }
            else if (end>tempdate) {
                item.Status = "Active";
             //   console.log(JSON.parse(JSON.stringify(item)))
                oo.push(JSON.parse(JSON.stringify(item)));

                lastitem = item;
            }
            else {
                item.Status = "Expired";
                console.log(item.Status)
            }
            console.log('item added')

       // }
    }
    console.log('done')
     console.log(oo.length)
    return oo;
}
exports.script_vouchers = async function (req, res) {
    try{

        awcollector.get_vouchers().then(
 function(){

       var textdata= fs.readFileSync('./AlgoliaAW.text','utf8');
   //var dddd=textdata.split('\n');
    fs.unlinkSync('./AlgoliaAW.text')
    repos.afRepo.dump_temp({ Date: Date.now(), RawData: textdata.toString(), status: 'Not Processed', collector: { name: 'AW', } },).then(async function()
    {
        var tempdbdata = []
          
        tempdbdata=await repo.get_temp("AW");
        console.log(tempdbdata.length);
        let vouchersarray = [];
        tempdbdata.forEach(
            function (item) {
                vouchersarray.push(...get_json_parsed_data(item.RawData));
                repos.afRepo.update_rawdata_status(item._id);
            }
        )
     //   console.log(vouchersarray);
     /////////////////////////////////////
     var filteredarray = []
     var localdbdata = await repos.afRepo.get_local();
     console.log('local')
     console.log(localdbdata.length)
     var counter = 0;
if(localdbdata)
{
vouchersarray.forEach(function (item) {
         var flag = true;
         localdbdata.forEach(function (item2) {

             if (item.PromotionID == item2.PromotionID) { flag = false; console.log(item.PromotionID + ' ' + item2.PromotionID); }

         });
         if (flag == true) { filteredarray.push(item);flag=true; }
     });
}
else{

filteredarray=vouchersarray;
}
console.log('filtered data')
     console.log(filteredarray.length)
     if (filteredarray.length > 0) { repos.afRepo.dump_local(filteredarray) }
     flagNewData = true;

     if (flagNewData) {
try{
index
             .saveObjects(filteredarray, { autoGenerateObjectIDIfNotExist: true })
             .then(({ objectIDs }) => {
                 console.log(objectIDs);
             });
}
catch(err){console.log(err)}
const del=require('../Delete_Update/Delete_Expired_Vouchers')
try{
//del.delete_expired_vouchers();
}
catch(err){console.log(err)}
    
         flagNewData = false;
         var errobj = {
             statusCode: "200",
             body: "Vouchers Successfully updated to Algolia"
         }
        
     }
     else {
         var errobj = {
             statusCode: "200",
             body: "Something went wrong"
         }
        
     }
     //////////////////////////////////////
    })

}
);
console.log('hello')
    }
    catch(err){}
}