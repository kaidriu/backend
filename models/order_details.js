module.exports = (sequelize, Sequelize) => {
    const Order_details = sequelize.define("order_details", {
      discount_order_details: { 
        type: Sequelize.DOUBLE
      },
      total_order_details: {
        type: Sequelize.STRING(5000),
      }
    });
    return Order_details;
  };

