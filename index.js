const serverless = require('serverless-http'),
  express = require('express'),
  morgan = require('morgan'),
  helmet = require('helmet'),
  bodyParser = require('body-parser');

const rootPrefix = '.',
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  sanitizer = require(rootPrefix + '/middlewares/sanitizer'),
  setResponseHeader = require(rootPrefix + '/middlewares/setResponseHeader'),
  assignParamsToRequest = require(rootPrefix + '/middlewares/assignParams'),
  apiRoutes = require(rootPrefix + '/routes/index');

// Set worker process title.
process.title = 'Smart Talent Rover API node worker';

const app = express();

// Use Morgan middleware to log requests
app.use(morgan('combined'));

// Helmet can help protect the app from some well-known web vulnerabilities by setting HTTP headers appropriately.
app.use(helmet());

// Node.js body parsing middleware. Default limit is 100kb
app.use(bodyParser.json({ limit: '2mb' }));

// Parsing the URL-encoded data with the qs library (extended: true). Default limit is 100kb
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));

// Set response header to prevent response caching
app.use(setResponseHeader());

// Sanitize body and query params to remove html tags and javascript
app.use(sanitizer.sanitizeBodyAndQuery);

// Assign params to req.decodedParams and req.internalDecodedParams
// IMPORTANT NOTE: Don't assign parameters before sanitization.
app.use(assignParamsToRequest.assignParams);

app.use('/api', apiRoutes);

// Error handling middleware for 404 - Page Not Found
app.use(function (req, res, next) {
  return standardResponse
    .error('i_1', { path: req.path }, standardResponse.errorMessage.notFound, standardResponse.errorCode.notFound)
    .render(res);
});

// Error handling middleware for 500 - Internal Server Error
app.use(function (err, req, res, next) {
  const errorObj = standardResponse.error('i_2', { path: req.path, error: err.toString(), stack: err.stack });
  logger.error('Internal error', errorObj);
  // Notify error to rollbar
  errorObj.notify().catch((rollbarErr) => {
    logger.error('Error in notifying error to rollbar: ', rollbarErr);
  });
  return errorObj.render(res);
});

// If running in development mode, start the server on port 3000, else export handler for lambda
if (coreConstants.ENVIRONMENT === 'local') {
  logger.log('Server running on 3000');
  app.listen(3000);
  module.exports = { handler: app };
} else if (coreConstants.ENVIRONMENT === 'test') {
  // Export the app for testing
  module.exports = { handler: app };
} else {
  // Create an API Gateway proxy handler
  const handler = serverless(app);
  // Export the handler for Lambda
  module.exports = { handler };
}
