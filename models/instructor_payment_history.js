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
      ruc: {
        type: Sequelize.STRING
      },
      business_name:{
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.BOOLEAN,
      }
    });
    return instructor_payment_history;
  };
