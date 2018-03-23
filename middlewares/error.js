module.exports = function(err, req, res, next) {
  return res.status(err.status || 400).send(err);
};