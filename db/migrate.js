// To know more about the sample usage, refer to: ./help.md
const fs = require('fs'),
  program = require('commander');

program
  .option('--up <up>', 'Specify a specific migration version to perform.')
  .option('--down <down>', 'Specify a specific migration version to revert.')
  .option('--generate <name>', 'Specify migration name to generate with bare minimum content.')
  .option('--migrationFolder <folderPath>', 'Specify the custom migration folder absolute path.')
  .parse(process.argv);

const rootPrefix = '..',
  ExecuteQuery = require(rootPrefix + '/db/ExecuteQuery'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  dbKindConstants = require(rootPrefix + '/lib/globalConstant/dbKind'),
  logger = require(rootPrefix + '/lib/customConsoleLogger');

const defaultMigrationFolder = __dirname + '/migration',
  mainDbName = databaseConstants.mainDbName;

/**
 * Class to manage migrations.
 *
 * @class DbMigrate
 */
class DbMigrate {
  /**
   * Constructor
   *
   * @constructor
   */
  constructor() {
    const oThis = this;

    oThis.upVersion = program.opts().up;
    oThis.downVersion = program.opts().down;

    // Disabling xRay for migrations, as it fails during code build
    oThis.enableXRay = false;

    oThis.allVersionMap = {};
    oThis.existingVersionMap = {};
    oThis.missingVersions = [];
  }

  /**
   * Main performer for class.
   *
   * @param {object} params
   * @param {string} [params.migrationFolder]
   */
  async perform(params) {
    const oThis = this;

    // If migration folder is not passed, use default migration folder
    oThis.migrationFolder = (params || {}).migrationFolder || defaultMigrationFolder;

    await oThis._asyncPerform();

    logger.win('Done!');
  }

  /**
   * Async perform.
   *
   * @return {Promise<void>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    // Fetch all versions from migration folder
    oThis._fetchAllVersionsFromMigrationFolder();

    // Fetch existing versions
    await oThis._fetchExistingVersions();

    // If upVersion is passed, run that migration
    if (oThis.upVersion) {
      if (oThis.existingVersionMap[oThis.upVersion]) {
        throw new Error('Migration version ' + oThis.upVersion + ' is already up.');
      }

      // Run migration
      await oThis._runMigration(oThis.upVersion);

      // If downVersion is passed, revert that migration
    } else if (oThis.downVersion) {
      if (!oThis.existingVersionMap[oThis.downVersion]) {
        throw new Error('Migration version ' + oThis.downVersion + ' is NOT up. Reverting it is not allowed.');
      }

      // Revert migration
      await oThis._revertMigration(oThis.downVersion);

      // If no version is passed, run all missing migrations
    } else {
      // Find missing versions and sort them
      oThis._findMissingVersions();

      // Looping over the missing versions to run the migrations.
      for (let index = 0; index < oThis.missingVersions.length; index++) {
        const version = oThis.missingVersions[index];

        // Run migration
        await oThis._runMigration(version);
      }
    }
  }

  /**
   * Run migration.
   *
   * @param {string} version
   *
   * @return {Promise<void>}
   * @private
   */
  async _runMigration(version) {
    const oThis = this;

    const migrationFile = oThis.allVersionMap[version];

    logger.log('-----------------------------------------');
    logger.step('Executing migration version(', version, ')');

    const versionInfo = require(oThis.migrationFolder + '/' + migrationFile);

    for (let index = 0; index < versionInfo.up.length; index++) {
      const query = versionInfo.up[index];

      await oThis._executeQuery(versionInfo, query);
    }

    const insertVersionSql = `INSERT INTO schema_migrations (version) VALUES (${version});`;

    await new ExecuteQuery(mainDbName, insertVersionSql, oThis.enableXRay).perform();

    logger.win('Executed migration version(', version, ')');
    logger.log('-----------------------------------------');
  }

  /**
   * Revert migration
   *
   * @param {string} version
   *
   * @return {Promise<void>}
   * @private
   */
  async _revertMigration(version) {
    const oThis = this;

    const migrationFile = oThis.allVersionMap[version];

    logger.log('-----------------------------------------');
    logger.step('Reverting migration version(', version, ')');

    const versionInfo = require(oThis.migrationFolder + '/' + migrationFile);

    for (let index = 0; index < versionInfo.down.length; index++) {
      const query = versionInfo.down[index];

      await oThis._executeQuery(versionInfo, query);
    }

    const insertVersionSql = `DELETE FROM schema_migrations WHERE version = '${version}';`;

    await new ExecuteQuery(mainDbName, insertVersionSql, oThis.enableXRay).perform();

    logger.win('Reverted migration version(', version, ')');
    logger.log('-----------------------------------------');
  }

  /**
   * Fetch all versions from migration folder
   *
   * @sets oThis.allVersionMap
   *
   * @return {Promise<void>}
   * @private
   */
  _fetchAllVersionsFromMigrationFolder() {
    const oThis = this;

    const fileNames = fs.readdirSync(oThis.migrationFolder);
    oThis.allVersionMap = {};

    for (let index = 0; index < fileNames.length; index++) {
      const currFile = fileNames[index];
      const currVersion = currFile.split('_')[0];

      if (currVersion) {
        oThis.allVersionMap[currVersion] = currFile;
      }
    }
  }

  /**
   * Fetch existing versions
   *
   * @sets oThis.existingVersionMap
   *
   * @return {Promise<void>}
   * @private
   */
  async _fetchExistingVersions() {
    const oThis = this;

    const schemaMigrationQuery = 'SELECT * FROM schema_migrations;';

    const versionQueryResult = await new ExecuteQuery(mainDbName, schemaMigrationQuery, oThis.enableXRay).perform();

    const rows = (versionQueryResult || [])[0] || [];

    oThis.existingVersionMap = {};

    for (let index = 0; index < rows.length; index++) {
      const currRow = rows[index];

      oThis.existingVersionMap[currRow.version] = 1;
    }
  }

  /**
   * Find missing versions and sort them
   *
   * @sets oThis.missingVersions
   *
   * @return {Promise<void>}
   * @private
   */
  _findMissingVersions() {
    const oThis = this;

    // When this file is exported as a module same instance has returned
    oThis.missingVersions = [];

    for (const version in oThis.allVersionMap) {
      if (!oThis.existingVersionMap[version]) {
        oThis.missingVersions.push(parseInt(version));
      }
    }

    oThis.missingVersions.sort();
  }

  /**
   * Execute query
   *
   * @param {object} versionInfo
   * @param {string} query
   *
   * @returns {Promise<void>}
   * @private
   */
  async _executeQuery(versionInfo, query) {
    const oThis = this;
    let dbName = versionInfo.dbName;
    let dbKind = versionInfo.dbKind;

    if (dbKind === dbKindConstants.sqlDbKind) {
      return new ExecuteQuery(dbName, query, oThis.enableXRay).perform();
    } else throw new Error(`Invalid dbKind-${dbKind}`);
  }
}

if (require.main === module) {
  // If executed as a standalone script
  const migrationFolder = program.opts().migrationFolder || defaultMigrationFolder;
  if (program.opts().generate) {
    const fileName = migrationFolder + '/' + Date.now() + '_' + program.opts().generate + '.js';
    const fileDummyData =
      'const migrationName = {\n' +
      '  dbName: <db name>,\n' +
      '  up: [<array of sql queries>],\n' +
      '  down: [<array of sql queries>],\n' +
      '  dbKind: <db kind>,\n' +
      '};\n' +
      '\n' +
      'module.exports = migrationName;';

    fs.appendFile(fileName, fileDummyData, function (err) {
      if (err) {
        logger.error(err);
      }

      logger.log('The file ' + fileName + ' is created!');
    });
  } else {
    new DbMigrate()
      .perform({ migrationFolder })
      .then(function () {
        process.exit(0);
      })
      .catch(function (err) {
        logger.error(err);
        process.exit(1);
      });
  }
} else {
  // If imported as a module
  module.exports = new DbMigrate();
}
