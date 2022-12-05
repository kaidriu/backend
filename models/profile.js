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
        type: Sequelize.STRING(600),
      },
      phone: {
        type: Sequelize.STRING      
      },
      education:{
        type: Sequelize.STRING
      },
      user_id_drive:{
        type: Sequelize.STRING
      }
    });
  
    return Profile;
  };

