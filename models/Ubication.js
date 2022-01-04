module.exports = (sequelize, Sequelize) => {
    const Ubication = sequelize.define("ubication", {

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
    },
    {
      tableName: 'Ubication',
	    freezeTableName: true,
    }
    );
  



    return Ubication;
  };

