const rootPrefix = '../..',
  SingleMissionFormatter = require(rootPrefix + '/formatters/missions/Single'),
  standardResponse = require(rootPrefix + '/lib/standardResponse');

class ListOfMissionFormatter {
  constructor(serviceResponse) {
    const oThis = this;

    serviceResponse = serviceResponse || {};

    oThis.missions = serviceResponse.data.missions;
    oThis.hasNextPage = serviceResponse.data.hasNextPage;
  }

  /**
   * Format
   *
   * @returns {*|result}
   */
  format() {
    const oThis = this;

    const formatMissions = [];

    for (const mission of oThis.missions) {
      formatMissions.push(SingleMissionFormatter.formatUsing(mission));
    }

    return standardResponse.success({
      missions: formatMissions,
      has_next_page: oThis.hasNextPage
    });
  }
}

module.exports = ListOfMissionFormatter;
