const rootPrefix = '../../..',
  basicHelper = require(rootPrefix + '/lib/basicHelper'),
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission');

/**
 * Class to get mission details.
 *
 * @class GetMission
 */
class GetMission extends ServiceBase {
  /**
   * Constructor to get mission details.
   *
   * @param {*} params
   */
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

    if (basicHelper.isEmptyObject(mission)) {
      return oThis._error(
        'a_s_m_gm_1',
        { missionId: oThis.missionId },
        'Invalid mission id ',
        standardResponse.errorCode.badRequest
      );
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
