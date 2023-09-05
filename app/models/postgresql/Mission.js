const { Model, DataTypes, Op } = require('sequelize');

const rootPrefix = '../../..',
  SequelizeProvider = require(rootPrefix + '/lib/providers/Sequelize'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  MissionModelConstants = require(rootPrefix + '/lib/globalConstant/model/mission'),
  postgresqlModelHelper = require(rootPrefix + '/app/models/postgresql/helper');

const sequelize = SequelizeProvider.getInstance(databaseConstants.mainDbName);

class Mission extends Model {}

Mission.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name'
    },
    resumeFolderUrl: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'resume_folder_url'
    },
    reportUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'report_url'
    },
    minCgpa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'min_cgpa'
    },
    totalCount: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: 'total_count'
    },
    processedCount: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: 'processed_count'
    },
    customSelectionCriteria: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'custom_selection_criteria'
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      get() {
        return MissionModelConstants.statuses[this.getDataValue('status')];
      },
      set(value) {
        this.setDataValue('status', MissionModelConstants.invertedStatuses[value]);
      }
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'updated_at'
    }
  },
  {
    sequelize: sequelize,
    modelName: 'Mission',
    tableName: 'missions',
    timestamps: true,
    underscored: true
  }
);

postgresqlModelHelper.addTimestampHooks(Mission);

MissionModelConstants.addHook('beforeFind', 'convertStatus', async (options) => {
  if (options.where && options.where.status) {
    const statusString = options.where.status;
    options.where.status = MissionModelConstants.invertedStatuses[statusString];
  }
});

module.exports = Mission;
