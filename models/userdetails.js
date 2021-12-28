
module.exports = (sequelize, Sequelize) => {
    const userDetail = sequelize.define("userDetail", {

        aboutMe: {
            type : Sequelize.STRING
        },
        linkCurriculum: {
            type : Sequelize.STRING
        },
        linkYT:{
            type: Sequelize.STRING
        },
        linkfb: {
            type: Sequelize.STRING
        },
        linkTW:{
            type:Sequelize.STRING
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
  



    return userDetail;
  };

