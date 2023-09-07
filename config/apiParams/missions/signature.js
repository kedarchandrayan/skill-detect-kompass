const rootPrefix = '../../..',
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  apiNameConstants = require(rootPrefix + '/lib/globalConstant/apiName');

const missionConfig = {
  [apiNameConstants.createMissionApi]: {
    mandatory: [
      {
        parameter: 'name',
        validatorConfig: {
          validateNonEmptyString: 'Invalid mission name.'
        }
      },
      {
        parameter: 'resume_folder_url',
        validatorConfig: {
          validateURL: 'Invalid resume folder url.'
        }
      }
    ],
    optional: [
      {
        parameter: 'skills',
        validatorConfig: {
          validateNonEmptyStringArray: 'Skills array is empty.'
        }
      },
      {
        parameter: 'total_experience_details',
        validatorConfig: {
          validateNonEmptyString: 'Invalid total experience details.'
        }
      },
      {
        parameter: 'min_cgpa',
        validatorConfig: {
          validateFloatValue: 'Invalid min cgpa.'
        }
      },
      {
        parameter: 'custom_selection_criteria',
        validatorConfig: {
          validateNonEmptyStringArray: 'Skills array is empty.'
        }
      }
    ]
  },
  [apiNameConstants.listMissionsApi]: {
    mandatory: [],
    optional: [
      {
        parameter: 'page',
        validatorConfig: {
          validateNaturalNumber: 'Invalid page number'
        }
      }
    ]
  },
  [apiNameConstants.getMissionApi]: {
    mandatory: [
      {
        parameter: 'mission_id',
        validatorConfig: {
          validateNaturalNumber: 'Invalid mission id'
        }
      }
    ]
  }
};

module.exports = missionConfig;
