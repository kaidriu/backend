module.exports = (sequelize, Sequelize) => {
  const Quiz = sequelize.define("quiz", {
    time: {
      type: Sequelize.INTEGER
    },
    timeActivate: {
      type: Sequelize.INTEGER
    },
    tittle_quizz: {
      type: Sequelize.STRING
    },
    note_weight_quiz:{
      type : Sequelize.DOUBLE
  },
  });
  return Quiz;
};

