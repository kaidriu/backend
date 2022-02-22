module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
      buyer_name: { 
        type: Sequelize.STRING
      },
      buyer_address: {
        type: Sequelize.STRING,
      },
      buyer_email: {
        type: Sequelize.STRING
      },
      buyer_phone: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.DOUBLE
      },   
      file_transaction_url: {
        type: Sequelize.STRING
      },
      total_order:{
        type: Sequelize.DOUBLE
      }
    });
    return Order;
  };

