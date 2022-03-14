module.exports = (sequelize, Sequelize) => {
    const Question_Course = sequelize.define("question_course", {
        question_course: { 
            type: Sequelize.STRING
          },
          answer_course: { 
            type: Sequelize.STRING
          },
    });
    return Question_Course;
  };

