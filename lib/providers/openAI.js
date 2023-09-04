const { OpenAI: OpenAIClient } = require('openai');

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

class OpenAIProvider {
  getInstance() {
    return new OpenAIClient({
      apiKey: coreConstants.OPENAI_KEY
    });
  }
}

module.exports = new OpenAIProvider();
