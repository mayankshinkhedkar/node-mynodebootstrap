import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import database from '../../config/database';
import localLogger from '../../localLoggerSetup';

const dbConfig = database.mysql;
const db = {};

const sequelize = new Sequelize(
  dbConfig.db,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    timezone: dbConfig.timezone,
    logging: (message) => {
      localLogger.info(message);
    },
    dialect: 'mysql',
    define: {
      underscored: true,
      freezeTableName: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: true
    },
    // similar for sync: you can define this to always force sync for models
    // sync: { force: true },
    // pool configuration used to pool database connections
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  }
);

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].seedData) {
    db[modelName].seedData(config);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db