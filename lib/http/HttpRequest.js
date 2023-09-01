const axios = require('axios');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

const rootPrefix = '../..',
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  standardResponse = require(rootPrefix + '/lib/standardResponse');

class HttpRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async makeRequest(method, endpoint, data = null, headers = {}) {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        headers
      });

      logger.log('HTTP response:', response.data);

      return standardResponse.success({
        responseData: response.data,
        response: {
          headers: response.headers,
          status: response.status
        }
      });
    } catch (error) {
      // Handle errors here
      logger.error(' HTTP error:', error);

      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        return standardResponse.error(
          'l_httpr_1',
          { status: error.response.status, data: error.response.data },
          `HTTP request failed with status ${error.response.status}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        return standardResponse.error('l_httpr_2', { request: error.request }, 'No response received from server');
      } else {
        // Something happened in setting up the request
        return standardResponse.error('l_httpr_3', { errorMessage: error.message }, 'Failed to setup HTTP request');
      }
    }
  }

  async get(endpoint, headers = {}) {
    return this.makeRequest('GET', endpoint, null, headers);
  }

  async post(endpoint, data = {}, headers = {}) {
    return this.makeRequest('POST', endpoint, data, headers);
  }

  async patch(endpoint, data = {}, headers = {}) {
    return this.makeRequest('PATCH', endpoint, data, headers);
  }
}

module.exports = HttpRequest;
