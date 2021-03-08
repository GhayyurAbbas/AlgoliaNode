const afRepo = require("./af/af.repo");
const repos = {};
repos["afRepo"] = afRepo;
console.log('repo index')
module.exports = repos;