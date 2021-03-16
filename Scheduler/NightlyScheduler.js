const cron=require('node-cron');
let shell=require('shelljs');
const af=require('../api/Controllers/AF');
exports.nightly_schedular=function()
{
    cron.schedule('0 52 14 * * *',function(){
        console.log('fully fueled and reloaded');
        af.script_vouchers();
        if(shell.exec("dir").code !==0)
        {console.log('something went wrong')}
    });
}