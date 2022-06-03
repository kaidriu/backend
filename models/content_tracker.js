module.exports = (sequelize, Sequelize) => {
    const Content_tracking = sequelize.define("content_tracking", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
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
      },
      link_task:{
        type: Sequelize.STRING
      },
      link_task_download:{
        type: Sequelize.STRING
      },
      qualification_task:{
        type: Sequelize.DOUBLE
      },
      date_finish_task:{
        type: Sequelize.DATE
      },
      comment_task:{
        type: Sequelize.STRING
      },
      task_name_student:{
        type: Sequelize.STRING
      },
      id_task_student:{
        type:Sequelize.STRING
      },
      test_student:{
        type:Sequelize.JSONB
      },
      date_quiz_student:{
        type: Sequelize.DATE
      },
      qualification_test:{
        type:Sequelize.DOUBLE
      }
      
    });
    return Content_tracking;
  };

