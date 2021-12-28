module.exports = {
    HOST: "8.tcp.ngrok.io",
    USER: "admin",
    PASSWORD: "solsito28",
    DB: "cursos",
    //BD EN HEROKU
    // HOST: "ec2-54-162-211-113.compute-1.amazonaws.com",
    // USER: "ryhcrxjegaemes",
    // PASSWORD: "640051b0e5d29a45fe85d77395cf07b6b38e10e204b7d63e666cf394f845f69c",
    // DB: "d4hjoafh59htip",
    // Comentario desde remoto att. marco
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