module.exports = {
    // HOST: "bym8pshutkczle2kolvq-postgresql.services.clever-cloud.com",
    // USER: "ucnmbx7jusqxudb9zdxr",
    // PASSWORD: "a4KXHj8r4YPqDSoQDkUi",
    // DB: "bym8pshutkczle2kolvq",
    // Comentario desde remoto att. marco
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "solsito28",
    DB: "cursos",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };