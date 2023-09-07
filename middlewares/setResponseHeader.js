/**
 * Set response headers to prevent response caching
 *
 * @returns {Function}
 *
 */
module.exports = function () {
  return function (req, res, next) {
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Vary', '*');
    res.setHeader('Expires', '-1');
    res.setHeader('Last-Modified', new Date().toUTCString());

    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, OPTIONS, PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'sentry-trace, host-header, authorization, Participant-Id, Origin, X-Requested-With, Accept, Content-Type, Referer, Cookie, Last-Modified, Cache-Control, Content-Language, Expires, Pragma, Content-Type, Authorization, Set-Cookie, Preparation-Time'
    );
    res.header('Access-Control-Allow-Origin', '*');

    next();
  };
};
