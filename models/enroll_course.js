module.exports = (sequelize, Sequelize) => {
    const Enroll_course = sequelize.define("enroll_course", {
      enroll_date: { 
        type: Sequelize.STRING
      },
      status_enroll: {
        type: Sequelize.STRING
      },
      enroll_finish_date: {
        type: Sequelize.STRING
      },
      avg_score:{
        type: Sequelize.INTEGER
      }

    });
    return Enroll_course;
  };

