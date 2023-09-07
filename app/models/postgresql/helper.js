class PostgresqlModelHelper {
  /**
   * Add timestamp related hooks
   *
   * @param Model
   */
  addTimestampHooks(Model) {
    // Define hooks to update createdAt and updatedAt with epoch timestamps
    Model.addHook('beforeCreate', (instance) => {
      instance.dataValues.createdAt = Math.floor(Date.now() / 1000);
      instance.dataValues.updatedAt = Math.floor(Date.now() / 1000);
    });

    Model.addHook('beforeBulkCreate', (instances) => {
      for (const instance of instances) {
        instance.dataValues.createdAt = Math.floor(Date.now() / 1000);
        instance.dataValues.updatedAt = Math.floor(Date.now() / 1000);
      }
    });

    Model.addHook('beforeBulkUpdate', (instance) => {
      instance.attributes.updatedAt = Math.floor(Date.now() / 1000);
    });

    Model.addHook('beforeUpdate', (instance) => {
      instance.dataValues.updatedAt = Math.floor(Date.now() / 1000);
    });
  }
}

module.exports = new PostgresqlModelHelper();
