const packageJson = require('../package.json');
const constants = require('../constants');
module.exports = function (router) {
  const infoKeys = ['name', 'version', 'author', 'description'];
  const info = infoKeys.reduce((infoTmp, k) => {
    infoTmp[k] = packageJson[k];
    return infoTmp;
  }, {});
  router.get('/', (req, res) => res.status(200).send(info));
  router.get('/settings', (req, res) => res.status(200).send(constants));
};