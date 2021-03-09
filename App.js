const algoliasearch=require("algoliasearch");
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
    var http = require('http'),
    fs = require('fs');

var request = http.get("http://ws-external.afnt.co.uk/apiv1/AFFILIATES/af_vouchers.asmx/Vouchers_getAllVouchers?username=muneeba.64@gmail.com&password=International01", function(response) {
    if (response.statusCode === 200) {
        var file = fs.createWriteStream("D:/Algolia.xml");
        response.pipe(file);
    }
    // Add timeout.
    request.setTimeout(12000, function () {
        request.abort();
    });
});

// fs.readFile("D:/Algolia.xml", 'utf8', function(err, data) {
//     if (!err) {
//         console.log(data);
//     }
// });
const xml2js = require('xml2js');
//const fs = require('fs');

// read XML from a file
const xml = fs.readFileSync('D:/Algolia.xml');

// convert XML to JSON
xml2js.parseString(xml, { mergeAttrs: false }, (err, result) => {
    if (err) {
        throw err;
    }

    console.log('here')
    // `result` is a JavaScript object
    // convert it to a JSON string
    const json = JSON.stringify(result, null, 4);

    // save JSON in a file
    fs.writeFileSync('D:/Algolia.json', json);
   console.log(result)

}); 
const obj=require("D:/Algolia.json");
var oo=[];

// console.log(obj.ReturnVoucherObj.Vouchers[0].Voucher[0])
var a=obj.ReturnVoucherObj.Vouchers[0].Voucher;
for(i=0;i<a.length;i++)
{
    oo.push({
        ProgrammeID: a[i].ProgrammeID[0],
 
    })
}
console.log(oo)

var url = "mongodb://localhost:27017/Algolia";

const MongoClient = require('mongodb');
const uri = url;

MongoClient.connect( url,function(err,db){
   // console.log(db)
    db.collection("tempdb").insertMany(oo, function(err, res) {
      console.log('enter')
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
      })
    });
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