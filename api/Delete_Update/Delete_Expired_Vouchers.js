/* #region  package imports */
const repos = require("../repositories/index");
const algoliasearch = require("algoliasearch");
//algolia data goes here
const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
// const client = algoliasearch("GN8PSCG4T1", "acb3451cc065202afcedd46c4e51fad4");
const index = client.initIndex(process.env.ALGOLIA_INDICE);
//const index = client.initIndex("test");
/* #endregion */


//function being exported which hopefully gets the expired vouchers from the data base and then deletes them from the algolia
exports.delete_expired_vouchers = async function (req, res) {
    try {
var todaydate=new Date();
    var expired_vouchers=await repos.afRepo.get_expired_vouchers(Math.floor(todaydate.getTime() / 1000));
    console.log(expired_vouchers)
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