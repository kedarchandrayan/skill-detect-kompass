const rootPrefix = '../..',
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  missionModelConstants = require(rootPrefix + '/lib/globalConstant/model/mission');

class TaskSplitter {
  constructor(messagePayload) {
    const oThis = this;

    oThis.missionId = messagePayload.mission_id;

    oThis.missionJSON = null;
  }

  async perform() {
    const oThis = this;

    await oThis._fetchMission();

    await oThis._updateMissionStatus();
  }

  /**
   * Fetch mission
   *
   * @sets oThis.missionJSON
   *
   * @returns {Promise<never>}
   * @private
   */
  async _fetchMission() {
    const oThis = this;

    const mission = await MissionModel.findOne({
      where: { id: oThis.missionId },
    });

    if(!mission) {
      return Promise.reject(standardResponse.error('l_ap_ts_fm_1'));
    }

    const missionJSON = mission.toJSON();

    if(!missionJSON.id || missionJSON.status !== missionModelConstants.createdStatus) {
      return Promise.reject(standardResponse.error('l_ap_ts_fm_2'));
    }

    oThis.missionJSON = missionJSON;
  }

  /**
   * Update mission status
   *
   * @returns {Promise<void>}
   * @private
   */
  async _updateMissionStatus() {
    const oThis = this;

    const [rowsUpdated, [updatedMission]] = await MissionModel.update(
      {
        status: missionModelConstants.inProgressStatus
      },
      {
        where: {
          id: oThis.missionId
        },
        returning: true, // This option returns the updated mission record
      }
    );

    oThis.missionJSON = updatedMission.toJSON()
  }
}

module.exports = TaskSplitter;
