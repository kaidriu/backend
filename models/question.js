module.exports = (sequelize, Sequelize) => {
    const Question = sequelize.define("question", {
        question: { 
            type: Sequelize.STRING
          },
        type_answer:{
          type: Sequelize.BOOLEAN
        },
        answer_studen:{
          type: Sequelize.STRING
        },
        weighing:{
          type: Sequelize.DOUBLE
        }
    });
    return Question;
  };

