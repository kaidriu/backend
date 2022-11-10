module.exports = {

  // BD EN ELEPHANT
  //  HOST: "castor.db.elephantsql.com",
  // USER: "odcwqpiy",
  // PASSWORD: "vvlJcM_48UQPvkBi_d6RxnkQllhR8FeQ",
  // DB: "odcwqpiy", 



  // HOST: "containers-us-west-59.railway.app",
  // USER: "postgres",
  // PASSWORD: "nE7N9STUzqMBzhKCJp6o",
  // DB: "railway", 
  HOST: "dpg-cdm6n7qrrk0d9h04u56g-a.oregon-postgres.render.com",
  USER: "slatter",
  PASSWORD: "AFmX9OnaccGIRUzX2aFnIw7SwX8cfaOs",
  DB: "db_curos_smhv_eymm",
  PORT: 5432, 

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