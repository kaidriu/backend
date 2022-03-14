module.exports = (sequelize, Sequelize) => {
    const Country = sequelize.define("country", {
        name_country: { 
            type: Sequelize.STRING
          }
    });
    return Country;
  };

