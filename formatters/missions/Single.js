const rootPrefix = '../..',
  standardResponse = require(rootPrefix + '/lib/standardResponse');

class SingleMissionFormatter {
  constructor(serviceResponse) {
    const oThis = this;

    serviceResponse = serviceResponse || {};

    oThis.mission = serviceResponse.data.mission;
  }

  /**
   * Format
   *
   * @returns
   */
  format() {
    const oThis = this;

    return standardResponse.success({
      mission: SingleMissionFormatter.formatUsing(oThis.mission)
    });
  }

  /**
   * Format using mission details
   *
   * @param mission
   * @returns
   */
  static formatUsing(mission) {
    return {
      id: mission.id,
      name: mission.name,
      resume_folder_url: mission.resumeFolderUrl,
      report_url: mission.reportUrl,
      skills: mission.skills.split(','),
      total_experience_details: mission.totalExperienceDetails,
      min_cgpa: mission.minCgpa,
      custom_selection_criteria: mission.customSelectionCriteria,
      status: mission.status,
      total_count: mission.totalCount,
      processed_count: mission.processedCount,
      created_at: mission.createdAt,
      updated_at: mission.updatedAt
    };
  }
}

module.exports = SingleMissionFormatter;
