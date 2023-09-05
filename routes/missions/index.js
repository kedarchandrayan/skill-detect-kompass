const express = require('express');
const router = express.Router();

const rootPrefix = '../..',
  apiNameConstants = require(rootPrefix + '/lib/globalConstant/apiName'),
  assignPathParams = require(rootPrefix + '/middlewares/assignPathParams'),
  SingleMissionFormatter = require(rootPrefix + '/formatters/missions/Single'),
  RoutesHelper = require(rootPrefix + '/routes/helper');

router.post('/', async function (req, res, next) {
  req.internalDecodedParams.api_name = apiNameConstants.createMissionApi;

  const dataFormatterFunc = async function (serviceResponse) {
    return new SingleMissionFormatter(serviceResponse).format();
  };

  const params = {
    req: req,
    res: res,
    servicePath: '/app/services/missions/Create',
    onServiceSuccess: dataFormatterFunc
  };

  Promise.resolve(await new RoutesHelper(params).perform());
});

module.exports = router;
