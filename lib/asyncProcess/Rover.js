const he = require('he');

const rootPrefix = '../..',
  googleDriveHelper = require(rootPrefix + '/lib/googleDrive'),
  fileParser = require(rootPrefix + '/lib/pdfParser'),
  SpreadSheetHelper = require(rootPrefix + '/lib/SpreadSheetHelper'),
  AiProcessor = require(rootPrefix + '/lib/AiProcessor'),
  MissionModel = require(rootPrefix + '/app/models/postgresql/Mission'),
  missionModelConstants = require(rootPrefix + '/lib/globalConstant/model/mission');

class Rover {
  constructor(messagePayload) {
    const oThis = this;

    oThis.missionId = messagePayload.mission_id;
    oThis.resumeFileId = messagePayload.resume_file_id;
    oThis.reportSsId = messagePayload.report_ss_id;

    oThis.missionJSON = null;
    oThis.resumeFilePath = null;
    oThis.resumeFileContent = null;
    oThis.selectionCriteria = '';
    oThis.aiResponse = null;
  }

  /**
   * Perform
   *
   * @returns {Promise<void>}
   */
  async perform() {
    const oThis = this;

    await oThis._fetchMission();

    await oThis._downloadFile();

    await oThis._readFileContent();

    oThis._preparePrompt();

    await oThis._aiExtractMatches();

    await oThis._appendToReport();

    await oThis._incrementProcessedCount();

    await oThis._markCompleteIfAllDone();
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
      where: { id: oThis.missionId }
    });

    if (!mission) {
      return Promise.reject(standardResponse.error('l_ap_ts_fm_1'));
    }

    const missionJSON = mission.toJSON();

    if (!missionJSON.id || missionJSON.status !== missionModelConstants.inProgressStatus) {
      return Promise.reject(standardResponse.error('l_ap_ts_fm_2'));
    }

    oThis.missionJSON = missionJSON;
  }

  /**
   * Download file
   *
   * @sets oThis.resumeFilePath
   *
   * @returns {Promise<void>}
   * @private
   */
  async _downloadFile() {
    const oThis = this;

    oThis.resumeFilePath = await googleDriveHelper.downloadFromGoogleDrive(oThis.resumeFileId, '/tmp');
  }

  /**
   * Read file content
   *
   * @sets oThis.resumeFileContent
   *
   * @returns {Promise<void>}
   * @private
   */
  async _readFileContent() {
    const oThis = this;

    oThis.resumeFileContent = await fileParser.extractTextFromPDF(oThis.resumeFilePath);
  }

  /**
   * Prepare prompt
   *
   * @private
   */
  _preparePrompt() {
    const oThis = this;

    oThis._parseTotalExperience();

    oThis._parseMinCgpa();

    oThis._parseSkills();

    oThis._parseCustomSelectionCriteria();
  }

  /**
   * AI extract matches
   *
   * @sets oThis.aiResponse
   *
   * @returns {Promise<void>}
   * @private
   */
  async _aiExtractMatches() {
    const oThis = this;

    oThis.aiResponse = await new AiProcessor(oThis.selectionCriteria, oThis.resumeFileContent).extract();
  }

  /**
   * Apped to report
   *
   * @returns {Promise<void>}
   * @private
   */
  async _appendToReport() {
    const oThis = this;

    // 'Name', 'Email', 'Phone Number', 'Total Work Ex', 'Confidence', 'Positives', 'Negatives'

    const name = oThis.aiResponse.name;
    const email = oThis.aiResponse.email;
    const phoneNumber = `${oThis.aiResponse.phone_number}`;
    const totalWorkEx = oThis.aiResponse.total_work_experience;
    const confidence = oThis.aiResponse.match_confidence_score;
    const criteria = oThis.aiResponse.criteria;

    let positives = '';
    let negatives = '';

    for (const criterion of criteria) {
      const criterionParsedData = `- ${criterion.criterion_summary}\n`;

      if (criterion.is_matched == true || criterion.is_matched == "true") {
        positives += criterionParsedData;
      } else {
        negatives += criterionParsedData;
      }
    }

    const sheetName = `Talent Rover Mission ${oThis.missionJSON.id}`;

    await new SpreadSheetHelper().appendRows(oThis.reportSsId, sheetName, [
      [
        name,
        email,
        phoneNumber,
        totalWorkEx,
        confidence,
        positives,
        negatives
      ]
    ]);
  }

  /**
   * Increment processed count
   *
   * @returns {Promise<void>}
   * @private
   */
  async _incrementProcessedCount() {
    const oThis = this;

    await MissionModel.incrementProcessedCount(oThis.missionId);
  }

  /**
   * Mark complete
   *
   * @returns {Promise<void>}
   * @private
   */
  async _markCompleteIfAllDone() {
    const oThis = this;

    await MissionModel.markComplete(oThis.missionId);
  }

  /**
   * Parse total experience
   *
   * @sets oThis.selectionCriteria
   *
   * @private
   */
  _parseTotalExperience() {
    const oThis = this;

    if (!oThis.missionJSON.totalExperienceDetails) {
      return;
    }

    const totalExperienceArray = JSON.parse(oThis.missionJSON.totalExperienceDetails);
    const parsedArray = [];

    for (const totalExElement of totalExperienceArray) {
      parsedArray.push(`${he.decode(totalExElement.op)} ${totalExElement.val}`);
    }

    oThis.selectionCriteria = oThis.selectionCriteria + `\nTotal experience requirement: ${parsedArray.join(' AND ')}`;
  }

  /**
   * Parse min CGPA
   *
   * @sets oThis.selectionCriteria
   *
   * @private
   */
  _parseMinCgpa() {
    const oThis = this;

    if (!oThis.missionJSON.minCgpa) {
      return;
    }

    oThis.selectionCriteria = oThis.selectionCriteria + `\nMinimum CGPA requirement: ${oThis.missionJSON.minCgpa}`;
  }

  /**
   * Parse Skills
   *
   * @sets oThis.selectionCriteria
   *
   * @private
   */
  _parseSkills() {
    const oThis = this;

    const skills = oThis.missionJSON.skills;

    if (!skills) {
      return;
    }

    oThis.selectionCriteria = oThis.selectionCriteria + `\nExpertize in these skills required: ${skills}`;
  }

  /**
   * Parse custom selection criteria
   *
   * @sets oThis.selectionCriteria
   *
   * @private
   */
  _parseCustomSelectionCriteria() {
    const oThis = this;

    const customCriteria = oThis.missionJSON.customSelectionCriteria;

    if (!customCriteria) {
      return;
    }

    oThis.selectionCriteria = oThis.selectionCriteria + `\nCustom requirements: ${customCriteria}`;
  }
}

module.exports = Rover;
