module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profile", {
      edad: { 
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      image_perfil: {
        type: Sequelize.STRING
        
      },
      profession: {
        type: Sequelize.STRING
      },
      aboutMe: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING      
      },
      education:{
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
  
    return Profile;
  };

