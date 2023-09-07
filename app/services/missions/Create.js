const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  MissionConstants = require(rootPrefix + '/lib/globalConstant/model/mission'),
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission'),
  taskQueue = require(rootPrefix + '/lib/messageBroker/taskQueue'),
  asyncProcessConstants = require(rootPrefix + '/lib/globalConstant/asyncProcess');

class CreateMission extends ServiceBase {
  constructor(params) {
    super(params);

    const oThis = this;
    oThis.name = params.name;
    oThis.resumeFolderUrl = params.resume_folder_url;
    oThis.skills = params.skills || [];
    oThis.totalExperienceDetails = params.total_experience_details || null;
    oThis.minCgpa = params.min_cgpa || null;
    oThis.customSelectionCriteria = params.custom_selection_criteria || null;
    oThis.missionDetails = null;
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

    oThis._sanitizeParams();

    await oThis._validateGoogleDriveFolder();

    await oThis._createEntryInMissionsTable();

    await oThis._fetchMissionDetails();

    await oThis._processResumes();

    return oThis._prepareMissionCreateResponse();
  }

  /**
   * Sanitize params
   *
   * @private
   */
  _sanitizeParams() {
    const oThis = this;

    oThis.name && (oThis.name = oThis.name.trim());
    oThis.resumeFolderUrl && (oThis.resumeFolderUrl = oThis.resumeFolderUrl.trim());
    oThis.customSelectionCriteria && (oThis.customSelectionCriteria = oThis.customSelectionCriteria.trim());
  }

  /**
   * Validate google drive folder
   *
   * @returns {Promise<void>}
   */
  async _validateGoogleDriveFolder() {
    const oThis = this;

    // Todo:: @Shraddha validate google drive folder url later
  }

  /**
   * Create entry in missions table
   *
   * @sets oThis.missionDetails
   *
   * @returns {Promise<void>}
   *
   * @private
   */
  async _createEntryInMissionsTable() {
    const oThis = this;

    const params = {
      name: oThis.name,
      resumeFolderUrl: oThis.resumeFolderUrl,
      status: MissionConstants.createdStatus,
      totalCount: 0,
      processedCount: 0
    };

    if (oThis.skills) {
      params.skills = oThis.skills.join(',');
    }

    if (oThis.minCgpa) {
      params.minCgpa = oThis.minCgpa;
    }

    if (oThis.customSelectionCriteria) {
      params.customSelectionCriteria = oThis.customSelectionCriteria;
    }

    if (oThis.totalExperienceDetails) {
      params.totalExperienceDetails = oThis.totalExperienceDetails;
    }

    oThis.missionDetails = await MissionModel.create(params);

    // Todo:: @shraddha Flush cache after mission cache implementation
  }

  /**
   * Fetch mission details
   *
   * @sets oThis.missionDetails
   *
   * @returns {Promise<never>}
   *
   * @private
   */
  async _fetchMissionDetails() {
    const oThis = this;

    // cache fetch later

    const missionId = oThis.missionDetails.id;

    const missionRecord = await MissionModel.findByPk(missionId);

    oThis.missionDetails = missionRecord ? missionRecord.toJSON() : {};
  }

  /**
   * Process Resumes
   *
   * @returns {Promise<void>}
   * @private
   */
  async _processResumes() {
    const oThis = this;

    const payload = {
      mission_id: oThis.missionDetails.id
    };

    await taskQueue.enqueue(asyncProcessConstants.taskSplitterTaskKind, payload);
  }

  /**
   * Prepare mission create response
   *
   * @returns {*|result}
   *
   * @private
   */
  _prepareMissionCreateResponse() {
    const oThis = this;

    return standardResponse.success({
      mission: oThis.missionDetails
    });
  }
}

module.exports = CreateMission;
