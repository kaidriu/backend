module.exports = {

  //BD EN ELEPHANT
   HOST: "castor.db.elephantsql.com",
  USER: "odcwqpiy",
  PASSWORD: "vvlJcM_48UQPvkBi_d6RxnkQllhR8FeQ",
  DB: "odcwqpiy", 

  // // BD LOCAL
  // HOST: "localhost",
  // USER: "postgres",
  // PASSWORD: "solsito28",
  // DB: "cursos",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};