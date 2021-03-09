const services = require("../../services/index");
const repo = {};
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
module.exports = repo;