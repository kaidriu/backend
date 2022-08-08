module.exports = (sequelize, Sequelize) => {
    const instructor_payment_history = sequelize.define("instructor_payment_history", {
      payment_method:{
        type: Sequelize.STRING
      },
      entity: { 
        type: Sequelize.STRING
      },
      count_payment: {
        type: Sequelize.STRING,
      },
      total_instructor_payment_history: {
        type: Sequelize.DOUBLE,
      },
      ordersDetailsIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
    });
    return instructor_payment_history;
  };
