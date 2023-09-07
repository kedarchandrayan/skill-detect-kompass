const rootPrefix = '../..',
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission'),
  standardResponse = require(rootPrefix + '/lib/standardResponse'),
  missionModelConstants = require(rootPrefix + '/lib/globalConstant/model/mission'),
  logger = require(rootPrefix + '/lib/customConsoleLogger'),
  SpreadSheetHelper = require(rootPrefix + '/lib/SpreadSheetHelper'),
  taskQueue = require(rootPrefix + '/lib/messageBroker/taskQueue'),
  googleDriveHelper = require('./lib/googleDrive');

class TaskSplitter {
  constructor(messagePayload) {
    const oThis = this;

    oThis.missionId = messagePayload.mission_id;

    oThis.missionJSON = null;
    oThis.driveFileIds = [];
    oThis.createSsResponse = null;
  }

  async perform() {
    const oThis = this;

    try {
      await oThis._fetchMission();

      await oThis._updateMissionStatus(missionModelConstants.inProgressStatus);

      await oThis._fetchFileIds();

      if(!oThis.driveFileIds.length) {
        return oThis._updateMissionStatus(missionModelConstants.completedStatus);
      }

      await oThis._createReportSpreadsheet();

      await oThis._populateMissionDetails();

      await oThis._updateReportUrlAndTotalCount();

      await oThis._enqueueRoverTasks();
    } catch (e) {
      logger.error(e);

      await oThis._updateMissionStatus(missionModelConstants.failedStatus);
    }
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
  async _updateMissionStatus(status) {
    const oThis = this;

    const [rowsUpdated, [updatedMission]] = await MissionModel.update(
      {
        status: status
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

  /**
   * Fetch file ids
   *
   * @sets oThis.driveFileIds
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchFileIds() {
    const oThis = this;

    const driveFileObjects = await googleDriveHelper.getFilesFromDrive(oThis.missionJSON.resumeFolderUrl);

    for(const driveFileObject of driveFileObjects) {
      oThis.driveFileIds.push(driveFileObject.id);
    }
  }

  /**
   * Create report spreadsheet
   *
   * @sets oThis.createSsResponse
   *
   * @returns {Promise<void>}
   * @private
   */
  async _createReportSpreadsheet() {
    const oThis = this;

    const sheetName = `Talent Rover Mission ${oThis.missionJSON.id}`;
    oThis.createSsResponse = await new SpreadSheetHelper().createSpreadSheetAndGetUrl(sheetName,
      ['Mission ID', `${oThis.missionJSON.id}`]);
  }

  /**
   * Populate Mission Details
   *
   * @returns {Promise<void>}
   * @private
   */
  async _populateMissionDetails() {
    const oThis = this;

    const nameRow = ['Name', oThis.missionJSON.name];
    const driveFolderRow = ['Drive Folder', oThis.missionJSON.resumeFolderUrl];
    const totalCountRow = ['Total Count', oThis.driveFileIds.length];
    const blankRow = [];
    const requirementsHeadingRow = ['Requirements:'];

    const totalWorkExObj = JSON.parse(oThis.missionJSON.totalExperienceDetails);
    let strParts = [];
    for(const ele of totalWorkExObj) {
      strParts.push(`${ele.op} ${ele.val}`)
    }
    const totalWorkExRow = ['Total Work Ex', strParts.join(' AND ')];

    const minCgpaRow = ['Min CGPA', oThis.missionJSON.minCgpa];
    const skillsRow = ['Skills', oThis.missionJSON.skills];
    const customCriteriaRow = ['Custom Criteria', oThis.missionJSON.customSelectionCriteria];
    const resumeInfoHeaderRow = [
      'Name', 'Email', 'Phone Number', 'Total Work Ex', 'Confidence', 'Positives', 'Negatives'
    ];

    const sheetName = `Talent Rover Mission ${oThis.missionJSON.id}`;
    await new SpreadSheetHelper().appendRows(oThis.createSsResponse.spreadsheetId, sheetName, [
      nameRow, driveFolderRow, totalCountRow, blankRow, requirementsHeadingRow,
      totalWorkExRow, minCgpaRow, skillsRow, customCriteriaRow, blankRow, blankRow,
      resumeInfoHeaderRow
    ]);
  }

  /**
   * Update report URL and total count
   *
   * @returns {Promise<void>}
   * @private
   */
  async _updateReportUrlAndTotalCount() {
    const oThis = this;

    const [rowsUpdated, [updatedMission]] = await MissionModel.update(
      {
        totalCount: oThis.driveFileIds.length,
        reportUrl: oThis.createSsResponse.spreadsheetUrl
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

  /**
   * Enqueue rover tasks
   *
   * @returns {Promise<void>}
   * @private
   */
  async _enqueueRoverTasks() {
    const oThis = this;

    for(const fileId of oThis.driveFileIds) {
      const payload = {
        mission_id: oThis.missionJSON.id,
        resume_file_id: fileId,
        report_ss_id: oThis.createSsResponse.spreadsheetId
      };

      await taskQueue.enqueue(asyncProcessConstants.roverTaskKind, payload);
    }
  }
}

module.exports = TaskSplitter;
