const cron=require('node-cron');
let shell=require('shelljs');
const af=require('../api/Controllers/AF');
const pos=require('../api/Controllers/POS');
const webgains=require('../api/Controllers/Webgains');
const aw=require('../api/Controllers/AW');
exports.nightly_schedular=function()
{
    cron.schedule('0 * * * * *',function(){
        console.log('fully fueled and reloaded');
        //af.script_vouchers();
         // pos.script_vouchers();
         //webgains.script_vouchers();
         aw.script_vouchers();
        try{


        }catch(err){console.log(err)}
        if(shell.exec("dir").code !==0)
        {console.log('something went wrong')}
    });
}
