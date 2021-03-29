const algoliasearch=require("algoliasearch");
const repo = require("./api/repositories/af/af.repo");
const client=algoliasearch("WS3OELWDQ8","cfcde2a48b6802bc8ffb27a500e12652");
const index=client.initIndex("Test");
 

// try{

//     const slowAndSteady = new Promise(function(resolve, reject) {
//         setTimeout(async function() {
//             console.log('start');
//       await      index.saveObjects(actors)
//             resolve();
//         }, 5000);
//     });
//     slowAndSteady
//         .then(function(r) {
//             console.log('end'+r);
//         });
    
// }
// catch(r){console.log("error is="+r)}
// const objects = [{
//     firstname: 'ghayyur',
//     lastname: 'abbas'
//   }, {
//     firstname: 'Muhammad',
//     lastname: 'Usman'
//   }];
  
//   index
//     .saveObjects(objects, { autoGenerateObjectIDIfNotExist: true })
//     .then(({ objectIDs }) => {
//       console.log(objectIDs);
//     });

    // index.search('find firstname that starts with g').then(({ hits }) => {
    //     console.log(hits);
    //   });
    //starts here
    var http = require('http'),
    fs = require('fs');
    var d = new Date();
     
    // var ddate = d.getDate();
    // var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    // var year = d.getFullYear();
    // var date=year+''+month+''+day+'.txt';
     function intervalFunc() {
        console.log('Cant stop me now!');
      }
       var dddd=null;
    function myFunc(arg) {
        // fs.readFile("F:/Algolia.txt", 'utf8', function(err, data) {
        //     if (!err) {
        //         dddd=data.split('\n');
        //     }
        // });
         dddd= fs.readFileSync('F:/Algolia.txt','utf8').split('\n');
         console.log(dddd[0].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g')))
      // console.log(dddd);
      }
      const fetch=require('node-fetch');
    function a(cb)
   {
    return new Promise((resolve,reject)=>{
        fetch('https://darwin.affiliatewindow.com/export-promotions/106661/2571471843d88e4100767d8799760845?promotionType=voucher&categoryIds=&regionIds=1&advertiserIds=&membershipStatus=&promotionStatus=')
        //.then(res=>JSON.parse(res))
       .then(json=>{
         //  console.log(json.body);
        var file= fs.createWriteStream("./AlgoliaWebGains.text")
     json.body.pipe(file);
    file.on('finish',resolve);
    //        resolve(json)
        });
//          http.get('http://api.webgains.com/2.0/vouchers?key=8f0c5709832e2c29764bbfa6fc2bb82e&campaignId=197159&filters={"showexpired":"false","orderby":"programName","order":"asc","filterby":"ALL_PROGRAMS"}', function(response) {
//     console.log(JSON.stringify(response));
//     console.log('if');
//      var file= fs.createWriteStream("./Algolia.json")
//      response.pipe(file);
//    file.on('finish',resolve);
//   //  resolve(file);
   
//     //cb();
//     //  dddd= fs.readFileSync('F:/Algolia.txt','utf8').split('\n');
//     //     console.log(dddd[0].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g')))
// //cb();
// })
    });
//console.log('hello')
   }

    function b()
   {
   // a(function() {
    try{
        dddd= fs.readFileSync('./Algolia.txt','utf8').split('\n');
   
        console.log(dddd[0].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g')))
   //return dddd[0].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g'))
    }catch(err){}
//} );
//,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$
//for(;;){if(dddd){return dddd[0].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g'))}}
}
   a().then(function(res){
       console.log('returns')
    dddd= fs.readFileSync('./AlgoliaWebGains.text','utf8').split('\n')
  //  var asa=dddd[1];
   // aaaa=asa.split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g'))
for(i=1;i<dddd.length;i++)
{
    console.log(dddd[i].split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g')));

}
   // console.log(dddd.split(new RegExp(',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)', 'g'))[0])
    //fs.unlinkSync('./AlgoliaWebGains.text')
   });
// const dotenv=require('dotenv');
// dotenv.config();
// const aa=require('./api/Controllers/POS');
// aa.script_vouchers();
//b();
// const xml2js = require('xml2js');
// //const fs = require('fs');

// // read XML from a file
// const xml = fs.readFileSync('D:/Algolia.xml');

// // convert XML to JSON
// xml2js.parseString(xml, { mergeAttrs: false }, (err, result) => {
//     if (err) {
//         throw err;
//     }

//     console.log('here')
//     // `result` is a JavaScript object
//     // convert it to a JSON string
//     const json = JSON.stringify(result, null, 4);

//     // save JSON in a file
//     fs.writeFileSync('D:/Algolia.json', json);
//    console.log(result)

// }); 
// const obj=require("D:/Algolia.json");
// var oo=[];

// // console.log(obj.ReturnVoucherObj.Vouchers[0].Voucher[0])
// var a=obj.ReturnVoucherObj.Vouchers[0].Voucher;
// for(i=0;i<a.length;i++)
// {
//     oo.push({
//         ProgrammeID: a[i].ProgrammeID[0],
 
//     })
// }
// console.log(oo)

// var url = "mongodb://localhost:27017/Algolia";

// const MongoClient = require('mongodb');
// const uri = url;

// MongoClient.connect( url,function(err,db){
//    // console.log(db)
//     db.collection("tempdb").insertMany(oo, function(err, res) {
//       console.log('enter')
//       if (err) throw err;
//       console.log("Number of documents inserted: " + res.insertedCount);
//       db.close();
//       })
//     });
// var MongoClient = require('mongodb');
// var url = "mongodb://localhost:27017/Algolia";
//     //endshere
//     var a=get_temp()
//     console.log('data in a' +a)
// index
// .saveObjects(oo, { autoGenerateObjectIDIfNotExist: true })
// .then(({ objectIDs }) => {
//   console.log(objectIDs);
// });
//   index
//     .saveObjects(obj.ReturnVoucherObj.Vouchers[0].Voucher, { autoGenerateObjectIDIfNotExist: true })
//     .then(({ objectIDs }) => {
//       console.log(objectIDs);
//     });
//   index.search('WALKER50').then(({ hits }) => {
//         console.log(hits);
//       });
// async function get_temp(){
//     // MongoClient.connect(url, function(err, db) {
//     //     if (err) throw err;
//     //    ;
//     //     db.collection("tempdb").find({}).toArray(function(err, result) {
//     //       if (err) throw err;
//     //     //  console.log('result'+result);
//     //       db.close();
//     //      // console.log(result)
//     //       return result
//     //     });
//     //   });
//     var d=new Date();
//     var a= await index.search('query', {
//       filters: `EndUnixTimeStamp < ${Math.floor(new Date(d).getTime() / 1000)}`
//     })
//     console.log('data in a' +a)
//     console.log(a);
// }
// const cron=require('node-cron');
// let shell=require('shelljs');

// cron.schedule('*/10 * * * * *',function(){
//     console.log('fully fueled and reloaded');
//     if(shell.exec("dir").code !==0)
//     {console.log('something went wrong')}
// });