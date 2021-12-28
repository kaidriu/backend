module.exports = (sequelize, Sequelize) => {
    const Publication = sequelize.define("ubication", {

      country: { 
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      }
      // userId: {
      //   allowNull: true,
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'users',
      //     key: 'id'
      //   }
      // }
    });
  



    return Publication;
  };

