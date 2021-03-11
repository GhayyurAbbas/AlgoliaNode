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


//function being exported which hopefully gets the expired vouchers from the data base and then deletes them from the algolia
exports.delete_expired_vouchers = async function (req, res) {
    try {

    var expired_vouchers=await repos.afRepo.get_expired_vouchers(Math.floor(new Date(start).getTime() / 1000));
    if(expired_vouchers.length>0)
    {
//call to algolia for deleting the expired vouchers
        index.deleteObjects(expired_vouchers);
    }
    }
    catch (err) {
    return 'error';
    }

}
//this code will be used in nightly service to delete all the expired vouchers from algolia . The idea was that we have to minimize the hits to algolia as they are paid so we controll
//our call with such filters