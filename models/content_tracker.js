module.exports = (sequelize, Sequelize) => {
    const Content_tracking = sequelize.define("content_tracking", {
      state_content_tacking: { 
        type: Sequelize.BOOLEAN
      },
      score_ct: {
        type: Sequelize.INTEGER
      },
      last_min_video: {
        type: Sequelize.STRING
      },
      last_entre:{
        type: Sequelize.STRING
      }

    });
    return Content_tracking;
  };

