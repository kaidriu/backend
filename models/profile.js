module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profile", {
      day_of_birthay: { 
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
        
      },
      image_perfil: {
        type: Sequelize.STRING
        
      },
      profession: {
        type: Sequelize.STRING
        
      },
      biogra: {
        type: Sequelize.STRING
        
      },
      addres: {
        type: Sequelize.STRING
        
      },
      phone: {
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

