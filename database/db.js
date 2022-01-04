const dbConfig = require("./config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  // port: 5432,
  // Ubuntu
  // port: 17398,

// 
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

// const sequelize = new Sequelize('postgres://ryhcrxjegaemes:640051b0e5d29a45fe85d77395cf07b6b38e10e204b7d63e666cf394f845f69c@ec2-54-162-211-113.compute-1.amazonaws.com:5432/d4hjoafh59htip');

const db = {};


//relaciones

      db.Sequelize = Sequelize;
      db.sequelize = sequelize;



      db.user = require("../models/user.js")(sequelize, Sequelize);
      db.profile = require("../models/profile.js")(sequelize, Sequelize);
      db.Ubication = require("../models/Ubication")(sequelize, Sequelize);
      db.UserType = require("../models/UserType")(sequelize, Sequelize);

      db.title = require("../models/title")(sequelize, Sequelize);
      db.userDetails = require("../models/userdetails")(sequelize, Sequelize);

      db.requestI = require("../models/requestInstructor")(sequelize, Sequelize);
      db.requestC = require("../models/requestCourse")(sequelize, Sequelize);



      db.user.belongsTo(db.profile);
      db.profile.hasOne(db.user);

      db.profile.belongsTo(db.UserType);
      db.UserType.hasOne(db.profile);
      
      db.profile.belongsTo(db.Ubication);
      db.Ubication.hasOne(db.profile);


      db.userDetails.hasOne(db.profile);
      db.profile.belongsTo(db.userDetails);


      db.title.belongsTo(db.user);
      db.user.hasMany(db.title);



      db.requestI.belongsTo(db.profile);
      db.profile.hasOne(db.requestI);


      db.requestC.belongsTo(db.profile);
      db.profile.hasOne(db.requestC);
      






module.exports = db;