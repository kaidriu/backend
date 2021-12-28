module.exports = (sequelize, Sequelize) => {
    const UserType = sequelize.define("userType", {


      name: {
        type: Sequelize.STRING
      }

    });
  
    return UserType;
  };

