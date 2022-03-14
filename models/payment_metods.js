module.exports = (sequelize, Sequelize) => {
    const Payment_method = sequelize.define("payment_method", {
        payment_method: { 
            type: Sequelize.STRING
          }
    });
    return Payment_method;
  };

