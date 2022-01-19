module.exports = (sequelize, Sequelize) => {
    const UserType = sequelize.define("userType", {


      nametype: {
        type: Sequelize.STRING
      }

    });
  
    return UserType;
  };

