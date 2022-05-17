module.exports = (sequelize, Sequelize) => {
    const instructor_payment_history = sequelize.define("instructor_payment_history", {
      entity: { 
        type: Sequelize.STRING
      },
      count_payment: {
        type: Sequelize.STRING,
      },
      date_instructor_payment_history: {
        type: Sequelize.DATE,
      },
      total_instructor_payment_history: {
        type: Sequelize.DOUBLE,
      },
    });
    return instructor_payment_history;
  };

