module.exports = (sequelize, Sequelize) => {
    const RequestCourse = sequelize.define("requestCourse", {

      name: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      info: {
        type: Sequelize.STRING
      },
      linkYt: {
        type: Sequelize.STRING
      },
      certificate: {
        type: Sequelize.STRING  
      },
      startDate: {
        type: Sequelize.STRING  
      },
      finishDate: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING 
      },
      state: {
        type: Sequelize.STRING
      }

    });
  
    return RequestCourse;
  };

