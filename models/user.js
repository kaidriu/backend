
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      google: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      }, 
    });
    return User;
  };