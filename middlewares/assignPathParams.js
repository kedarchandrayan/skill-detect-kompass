const rootPrefix = '..',
  sanitizer = require(rootPrefix + '/middlewares/sanitizer');

module.exports = (req, res, next) => {
  req.params = sanitizer.sanitizeParams(req.params || {});
  Object.assign(req.decodedParams, req.params);

  next();
};
