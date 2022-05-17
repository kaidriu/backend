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
    }
  });
  return Quiz;
};

