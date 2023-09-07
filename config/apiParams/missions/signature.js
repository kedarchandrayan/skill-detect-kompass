const rootPrefix = '../../..',
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  apiNameConstants = require(rootPrefix + '/lib/globalConstant/apiName');

const missionConfig = {
  [apiNameConstants.createMissionApi]: {
    mandatory: [
      {
        parameter: 'name',
        validatorConfig: {
          validateNonEmptyString: standardResponse.errorMessage.invalidNonEmptyString('name')
        }
      },
      {
        parameter: 'resume_folder_url',
        validatorConfig: {
          isValidURL: 'Invalid resume folder url.'
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
          validateNaturalNumber: 
        }
      },
      {
        parameter: 'custom_selection_criteria',
        validatorConfig: {
          // validateNonEmptyString: standardResponse.errorMessage.invalidNonEmptyString('custom_selection_criteria')
          // Todo:: @Shraddha validate selection criteria length
          // validateChecklistDescriptionLength: standardResponse.errorMessage.tooLongString(
          //   'description',
          //   checklistPropertyConstants.maxDescriptionSize
          // )
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
