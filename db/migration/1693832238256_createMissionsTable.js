const rootPrefix = '../..',
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  dbKindConstants = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = databaseConstants.mainDbName;
const dbKind = dbKindConstants.sqlDbKind;

// Create missions table SQL query
const createTable =
  'CREATE TABLE missions (\n' +
  '  id bigserial NOT NULL,\n' +
  '  name varchar(100) NOT NULL,\n' +
  '  resume_folder_url varchar(100) NOT NULL,\n' +
  '  report_url varchar(255),\n' +
  '  total_experience_details varchar(255),\n' +
  '  min_cgpa numeric(3, 2),\n' +
  '  skills varchar(1024),\n' +
  '  total_count smallint NOT NULL,\n' +
  '  processed_count smallint NOT NULL,\n' +
  '  custom_selection_criteria varchar(1024),\n' +
  '  status smallint NOT NULL,\n' +
  '  created_at integer NOT NULL,\n' +
  '  updated_at integer NOT NULL,\n' +
  '  PRIMARY KEY (id)\n' +
  ');\n';

// Drop missions table SQL query
const dropTableQuery = 'DROP TABLE IF EXISTS missions;';

const createMissionsTableMigration = {
  dbKind: dbKind,
  dbName: dbName,
  up: [createTable],
  down: [dropTableQuery]
};
module.exports = createMissionsTableMigration;
