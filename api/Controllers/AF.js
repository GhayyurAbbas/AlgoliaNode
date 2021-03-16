/* #region  package imports */
const algoliasearch = require("algoliasearch");
const afcollector = require("../collectors/AFCollector");
const repos = require("../repositories/index");
const client = algoliasearch("WS3OELWDQ8", "cfcde2a48b6802bc8ffb27a500e12652");
const index = client.initIndex("Test");
var MongoClient = require('mongodb');
const repo = require("../repositories/af/af.repo");
var url = "mongodb://localhost:27017/Algolia";
const xml2js = require('xml2js');
var http = require('http'),
    fs = require('fs');
var assert = require('assert')
const BBVConstants = require('../../BBVConstants')
const isNullOrWhiteSpace = require('../../isNullOrWhiteSpace')
const BBVItem = require('../Models/BBVItem')
var format = require('dateFormat');
/* #endregion */

//this function is parsing xml string to json data. Here we are using xml2js package provided by npm........
function get_json_parsed_data(data) {

    console.log('entering the parsed function')
    // const xml = fs.readFileSync('D:/Algolia.xml');
    xml2js.parseString(data, { trim: true }, { explicitArray: true }, { mergeAttrs: false }, (err, result) => {
        if (err) {
            throw err;
        }
        const json = JSON.stringify(result, null, 4);
        fs.truncate('./Algolia.json', 0, function () { console.log('done') })
        fs.writeFileSync('./Algolia.json', json);

    });
    console.log('parsed')
    const obj = require("../../Algolia.json");

    var oo = [];
    var a = obj.ReturnVoucherObj.Vouchers[0].Voucher;
    var lastitem = null;
    console.log('starting looop');

    for (i = 0; i < a.length; i++) {
        var additem = true;
        var item = new BBVItem();
        item.BBVID = BBVConstants.BBV_AF_ID_Prefix + a[i].VoucherID[0];
        item.PromotionID = a[i].VoucherID[0];
        item.Advertiser = a[i].MerchantSiteName[0];
        item.AdvertiserID = a[i].ProgrammeID[0];
        item.DataType = (assert(a[i].VoucherCode[0], 'N/A') || isNullOrWhiteSpace(a[i].VoucherCode[0])) ? '2' : '1';
        item.Code = a[i].VoucherCode[0];
        item.Title = a[i].VoucherDescription[0];
        item.ShortDescription = a[i].CategoryName[0];
        item.Categories = a[i].CategoryName[0];
        item.Starts = a[i].StartDate[0];
        item.Ends = a[i].EndDate[0];
        item.DeepLinkTracking = a[i].Tracking_URL[0];
        item.LogoLink = a[i].ImageURL[0];
        item.objectID = BBVConstants.BBV_AF_ID_Prefix + a[i].VoucherID[0];
        //fp
        console.log('first point');
        console.log(item);
        if (isNullOrWhiteSpace(item.DeepLinkTracking)) {
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
        //sp,format.ISO8601_FORMAT
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
            console.log(format(start, 'yyyy-mm-ddTHH:MM:ss').toString().replace('A', 'T'))
            var now = Date.now();
            // item.Starts = format(start, 'yyyy-mm-ddTHH:MM:ss').toUTCString().replace('A', 'T') + ":dd/MM/yyyy HH:mm:ss";
            item.Starts = start.toUTCString() + ":dd/MM/yyyy HH:mm:ss";
            item.Ends = end.toUTCString() + ':dd/MM/yyyy HH:mm:ss';
            console.log(item.Ends)

            item.StartUnixTimeStamp = Math.floor(new Date(start).getTime() / 1000);
            item.EndUnixTimeStamp = Math.floor(new Date(end).getTime() / 1000);
            console.log(item.StartUnixTimeStamp)
            // const diffTime = Math.abs(date2 - date1);
            // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // console.log(Math.ceil(Math.abs(start - Date.now()) / (1000 * 60 * 60 * 24)))
            console.log(start > Date.now())
            var tempdate=new Date();
            console.log(start<tempdate)
            if (start>tempdate){
                item.Status = "Upcoming";
                console.log(item.Status)
                oo.push(JSON.parse(JSON.stringify(item)));
                lastitem = item;
            }
            else if (end>tempdate) {
                item.Status = "Active";
                console.log(item.Status)
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
    //  console.log(oo)
    return oo;
}

exports.script_vouchers = async function (req, res) {
    try {

        var flagNewData = false;
        var xmldata = afcollector.get_vouchers();

        var oo = []
        //console.log(oo)
        console.log('vouchers recieved');
        console.log(xmldata)
        if (!oo.includes("error")) {

            //dumping temporarily 
            console.log('dumping data');
            repos.afRepo.dump_temp({ Date: Date.now(), RawData: xmldata, status: 'Not Processed', collector: { name: 'AF', } },);
            // var tempdbdata=oo
            var tempdbdata = await repo.get_temp();
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

            console.log(vouchersarray)
            ///////////////////////////////////first check point**************
            //
            var filteredarray = []
            var localdbdata = await repos.afRepo.get_local();
            console.log('local')
            console.log(localdbdata)
            var counter = 0;

            vouchersarray.forEach(function (item) {
                var flag = true;
                localdbdata.forEach(function (item2) {

                    if (item.PromotionID == item2.PromotionID) { flag = false; console.log(item.PromotionID + ' ' + item2.PromotionID); }

                });
                if (flag == true) { filteredarray.push(item); }
            });
            /////with filter
            // vouchersarray.forEach(function (item) {
              
            //     var retdata=data.filter(
            //         function(data){ return data.name == code }
            //     );
            //     if (retdata.length==0) { filteredarray.push(item); }
            // });
            console.log('filtered data')
            console.log(filteredarray)
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
                // index
                //     .saveObjects(filteredarray, { autoGenerateObjectIDIfNotExist: true })
                //     .then(({ objectIDs }) => {
                //         console.log(objectIDs);
                //     });
                flagNewData = false;
                var errobj = {
                    statusCode: "200",
                    body: "Vouchers Successfully updated to Algolia"
                }
                // res.json(errobj)
            }
            else {
                var errobj = {
                    statusCode: "200",
                    body: "Something went wrong"
                }
                // res.json(errobj)
            }


        }
        else {
            var errobj = {
                statusCode: "500",
                body: oo
            }
            // res.json(errobj)
        }

    }
    catch (err) {
        console.log(err)
        // var errobj = {
        //     statusCode: "500",
        //     body: JSON.stringify(err)
        // }
        // res.json(errobj)
    }

}