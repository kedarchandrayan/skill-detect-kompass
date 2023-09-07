const { Op } = require('sequelize');

const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  missionConstants = require(rootPrefix + '/lib/globalConstant/model/mission'),
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission');

class GetList extends ServiceBase {
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.page = Number(params.page || 1);

    oThis.offset = null;
    oThis.hasNextPage = null;

    oThis.pageSize = missionConstants.listPageSize;
    oThis.missions = [];
    oThis.missionIds = [];
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
    oThis._computeOffset();

    await oThis._fetchMissionRecords();

    return oThis._prepareResponseMissionList();
  }

  /**
   * Compute offset
   *
   * @sets oThis.offset
   * @private
   */
  _computeOffset() {
    const oThis = this;

    oThis.offset = (oThis.page - 1) * oThis.pageSize;
  }

  /**
   * Fetch Mission records
   *
   * @sets oThis.hasNextPage, oThis.missions, oThis.missionIds
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchMissionRecords() {
    const oThis = this;

    // Fetch mission records
    const missions = await MissionModel.findAll({
      where: {
        status: { [Op.ne]: missionConstants.deletedStatus }
      },
      order: [['id', 'ASC']],
      limit: oThis.pageSize + 1,
      offset: oThis.offset
    });

    // We fetched one extra record to check if there is next page or not.
    oThis.hasNextPage = missions.length === oThis.pageSize + 1;

    // Prepare mission list to be returned.
    for (let index = 0; index < oThis.pageSize; index++) {
      const missionRecord = missions[index];

      if (!missionRecord) {
        break;
      }

      oThis.missions.push(missionRecord.toJSON());
      oThis.missionIds.push(missionRecord.id);
    }
  }

  /**
   * Prepare mission list response.
   * @returns {Object}
   * @private
   */
  _prepareResponseMissionList() {
    const oThis = this;

    return standardResponse.success({
      missions: oThis.missions,
      hasNextPage: oThis.hasNextPage
    });
  }
}

module.exports = GetList;
