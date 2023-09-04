const rootPrefix = '..',
  openAIConstants = require(rootPrefix + '/lib/globalConstant/openAI'),
  openAIProvider = require(rootPrefix + '/lib/providers/openAI');

class OpenAI {
  constructor({ selectionCriteria, resumeDetails }) {
    const oThis = this;

    oThis.selectionCriteria = selectionCriteria;
    oThis.resumeDetails = resumeDetails;
  }

  async getScanResult() {
    const oThis = this;

    oThis._preparePrompt();

    const response = await (openAIProvider.getInstance()).chat.completions.create({
      model: 'gpt-3.5-turbo-16k', // NOTE: gpt-3.5-turbo was giving insufficient tokens error.
      messages: [
        {
          role: 'user',
          content: oThis.prompt
        }
      ],
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const relevantResponse = JSON.parse((response.choices[0] || {}).message.content || '');

    console.log(JSON.stringify(relevantResponse, null, 4));

    return relevantResponse;
  }

  _preparePrompt() {
    const oThis = this;

    const placeholdersValueMap = {
      [openAIConstants.selectionCriteriaPlaceholder]: oThis.selectionCriteria,
      [openAIConstants.resumeDetailsPlaceholder]: oThis.resumeDetails
    };

    let prompt = openAIConstants.promptWithPlaceHolder;

    const regExp = /{{(\w*)}}/gm;
    let match;

    while ((match = regExp.exec(prompt))) {
      const strToReplace = match[0];
      const placeholder = match[1];
      const placeholderValue = placeholdersValueMap[placeholder];

      if (placeholderValue) {
        prompt = prompt.replace(strToReplace, placeholderValue);
      }
    }

    oThis.prompt = prompt;
  }
}

module.exports = OpenAI;
