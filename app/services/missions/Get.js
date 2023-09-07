const { Op } = require('sequelize');

const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission');

class GetMission extends ServiceBase {
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.missionId = Number(params.mission_id);

    oThis.mission = {};
  }

  /**
   * Async perform
   *
   * @returns {Promise<void>}
   *
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    // NOTE: All basic validations are done in Param Validation Layer.

    await oThis._fetchMissionRecord();

    return oThis._prepareMissionResponse();
  }

  /**
   * Fetch Mission record
   *
   * @sets oThis.mission
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchMissionRecord() {
    const oThis = this;

    // Fetch mission records
    const mission = await MissionModel.fetchMissionById(oThis.missionId);

    if (!mission) {
      // Todo:: throw error
      // Todo:: param validate error at signature
    }

    oThis.mission = mission;
  }

  /**
   * Prepare mission  response.
   * @returns {Object}
   * @private
   */
  _prepareMissionResponse() {
    const oThis = this;

    return standardResponse.success({
      mission: oThis.mission
    });
  }
}

module.exports = GetMission;
