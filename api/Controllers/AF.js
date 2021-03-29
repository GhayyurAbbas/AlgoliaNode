/* #region  package imports */
const algoliasearch = require("algoliasearch");
const afcollector = require("../collectors/AFCollector");
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
/* #endregion */

//this function is parsing xml string to json data. Here we are using xml2js package provided by npm........
 function get_json_parsed_data(data) {

    console.log('entering the parsed function')
 
    var options = {fullTagEmptyElement:false,strict:false,ignoreComment: true, alwaysChildren: true,compact:true,ignoreDeclaration:true, ignoreAttributes:true};
   // fs.truncate('./Algolia.json', 0, function () { console.log('done') })
    console.log("<<<<<<<<<<<<<<<<<<<<<<DATA>>>>>>>>>>>>>>>>>>>>>>>");
  console.log(data);
  console.log("<<<<<<<<<<<<<<<<<<<<<<END DATA>>>>>>>>>>>>>>>>>>>>>>>");
  
    var result= convert.xml2js(data.trim(), options);
  console.log("<<<<<<<<<<<<<<<<<<<<<<RESULT>>>>>>>>>>>>>>>>>>>>>>>");
  console.log(result.ReturnVoucherObj.Vouchers.Voucher);
  console.log("<<<<<<<<<<<<<<<<<<<<<<END RESULT>>>>>>>>>>>>>>>>>>>>>>>");
    fs.writeFileSync('./Algolia.json',JSON.stringify(result.ReturnVoucherObj.Vouchers.Voucher));
    //console.log(JSON.stringify(result))
     const obj = require('../../Algolia.json');
     console.log(obj);
 //const obj=JSON.parse(obj1)
     var oo = [];
     var a = obj;
    // var options = {ignoreComment: true, alwaysChildren: true,compact:true,ignoreDeclaration:true};
    // var result =  convert.xml2js(data, options);
    // const obj = result;
    // var oo = [];
    // var a = obj.ReturnVoucherObj?obj.ReturnVoucherObj.Vouchers?obj.ReturnVoucherObj.Vouchers.Voucher:[]:[];

   console.log(a)
    var lastitem = null;
    fs.unlinkSync('./Algolia.json')
    console.log('starting looop');

    for (i = 0; i < a.length; i++) {
        var additem = true;
        var item = new BBVItem();
        item.BBVID = BBVConstants.BBV_AF_ID_Prefix + ("VoucherID" in a[i])?a[i].VoucherID._text:'';
        item.PromotionID = ("VoucherID" in a[i])?a[i].VoucherID._text:'';
        item.Advertiser =('MerchantSiteName' in a[i])?a[i].MerchantSiteName._text:'';
        item.AdvertiserID = ('ProgrammeID' in a[i])?a[i].ProgrammeID._text:'';
        item.DataType = ('VoucherCode' in a[i])?((assert(a[i].VoucherCode._text, 'N/A') || isNullOrWhiteSpace(a[i].VoucherCode._text)) ? '2' : '1'):'';
        item.Code = ('VoucherCode' in a[i])?a[i].VoucherCode._text:'';
        item.Title =('VoucherDescription' in a[i])? a[i].VoucherDescription._text:'';
        item.ShortDescription =('CategoryName' in a[i])? a[i].CategoryName._text:'';
        item.Categories =('CategoryName' in a[i])? a[i].CategoryName._text:'';
        item.Starts = ('StartDate' in a[i])?a[i].StartDate._text:'';
        item.Ends = ('EndDate' in a[i])?a[i].EndDate._text:'';
        item.DeepLinkTracking = ('Tracking_URL' in a[i])?a[i].Tracking_URL._text:'';
        item.LogoLink =('ImageURL' in a[i])? a[i].ImageURL._text:'';
        item.objectID = BBVConstants.BBV_AF_ID_Prefix +('VoucherID' in a[i])? a[i].VoucherID._text:'';
        //fp
        console.log('first point');
        console.log(item);
        if (isNullOrWhiteSpace(item.DeepLinkTracking)) {
           console.log('wrong one')
            continue
        }
    
        if (lastitem != null) {
            if (assert(lastitem.BBVID, item.BBVID) && assert(lastitem.PromotionID, item.PromotionID) && assert(lastitem.Code, item.Code)) {
                additem = false

                if (!lastitem.Categories.includes(item.Categories)) {
                    lastitem.Categories += ',' + item.Categories;
                }
            }
        }
        console.log('second point')
        if (additem) {
            if (isNullOrWhiteSpace(item.Starts)) {
                continue;
            }
            var start = new Date(item.Starts);


            var end;
            if (!isNullOrWhiteSpace(item.Ends)) {
                end = new Date(item.Ends);
            }
            else {
                end = new Date(start.getDate() + 5);
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
                console.log(JSON.parse(JSON.stringify(item)))
                oo.push(JSON.parse(JSON.stringify(item)));
                lastitem = item;
            }
            else if (end>tempdate) {
                item.Status = "Active";
                console.log(JSON.parse(JSON.stringify(item)))
                oo.push(JSON.parse(JSON.stringify(item)));

                lastitem = item;
            }
            else {
                item.Status = "Expired";
                console.log(item.Status)
            }
            console.log('item added')

        }
    }
    console.log('done')
     console.log(oo.length)
    return oo;
}

exports.script_vouchers = async function (req, res) {
    try {

        var flagNewData = false;
        var xmldata = afcollector.get_vouchers();

        var oo = [] 
        console.log('vouchers recieved');
        console.log(xmldata)
        if (!oo.includes("error")) {

            //dumping temporarily 
            console.log('dumping data');
            repos.afRepo.dump_temp({ Date: Date.now(), RawData: xmldata, status: 'Not Processed', collector: { name: 'AF', } },).then(async function()
            {
     
         console.log('entering loop');
         let i=0;
            var tempdbdata = []
          
                tempdbdata=await repo.get_temp("AF");
             console.log(i, "temp data Length:", tempdbdata.length);
           

            console.log('raw data dumped');
            console.log('from mongo');
            console.log(tempdbdata.length);
            let vouchersarray = [];
            tempdbdata.forEach(
                function (item) {
                    vouchersarray.push(...get_json_parsed_data(item.RawData));
                    repos.afRepo.update_rawdata_status(item._id);
                }
            )
                console.log(vouchersarray.length)
            ///////////////////////////////////first check point**************
            //
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
del.delete_expired_vouchers();
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
            });
      

        
          
        
           


        }
        else {
            var errobj = {
                statusCode: "500",
                body: oo
            }
            
        }

    }
    catch (err) {
        console.log(err)
       
    }

}
