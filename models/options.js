module.exports = (sequelize, Sequelize) => {
    const Options = sequelize.define("options", {
        options: { 
            type: Sequelize.STRING
          },
          answer:{
              type: Sequelize.BOOLEAN
          }
    });
    return Options;
  };

