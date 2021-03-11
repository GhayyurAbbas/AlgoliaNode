const services = require("../../services/index");
const repo = {};
//read af.service.js for documentation of implementation for following functions
repo.dump_temp = async (data) => {
    try {
console.log('in repos')
        return services.afService.dump_temp(data);

    } catch (e) {
        throw e;
    }
}
repo.dump_local = async (data) => {
    try {

        return services.afService.dump_local(data);

    } catch (e) {
        throw e;
    }
}
repo.get_temp = async () => {
    try {

    ;
      return  services.afService.get_temp();

    } catch (e) {
        throw e;
    }
}
repo.get_local = async () => {
    try {

    ;
      return  services.afService.get_local();

    } catch (e) {
        throw e;
    }
}
repo.get_expired_vouchers = async (todayunixtimestamp) => {
    try {

    ;
      return  services.afService.get_expired_vouchers(todayunixtimestamp);

    } catch (e) {
        throw e;
    }
}
repo.update_rawdata_status = async (id) => {
    try {

    ;
      return  services.afService.update_rawdata_status(id);

    } catch (e) {
        throw e;
    }
}
module.exports = repo;