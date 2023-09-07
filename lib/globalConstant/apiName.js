/**
 * Class representing API name constants.
 *
 * @class ApiName
 */
class ApiName {
  get createMissionApi() {
    return 'createMissionApi';
  }

  get listMissionsApi() {
    return 'listMissionsApi';
  }

  get getMissionApi() {
    return 'getMissionApi';
  }
}

module.exports = new ApiName();
