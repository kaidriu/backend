module.exports = (sequelize, Sequelize) => {
    const Order_details = sequelize.define("order_details", {
      discount_order_details: { 
        type: Sequelize.DOUBLE
      },
      discountCode_order_details: { 
        type: Sequelize.STRING
      },
      discountPercentage_order_details: { 
        type: Sequelize.DOUBLE
      },
      total_order_details: {
        type: Sequelize.DOUBLE,
      }
    });
    return Order_details;
  };

