
module.exports = (sequelize, Sequelize) => {
    const userDetail = sequelize.define("userDetail", {

        aboutMe: {
            type : Sequelize.STRING
        },
        linkCurriculum: {
            type : Sequelize.STRING
        },
        user_labels:{
            type: Sequelize.ARRAY(Sequelize.TEXT)
        },
        linkYT:{
            type: Sequelize.STRING
        },
        linkfb: {
            type: Sequelize.STRING
        },
        linkTW:{
            type:Sequelize.STRING
        },
        linkIG:{
            type:Sequelize.STRING
        },
        bank:{
            type:Sequelize.STRING
        },        
        account_type:{
            type:Sequelize.STRING
        } ,     
        owner_name:{
            type:Sequelize.STRING
        } ,
        account_number:{
            type:Sequelize.STRING
        } ,
        account_paypal:{
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

