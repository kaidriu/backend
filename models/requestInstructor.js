module.exports = (sequelize, Sequelize) => {
    const RequestInstructor = sequelize.define("requestInstructor", {


      linkYT: {
        type: Sequelize.STRING
      },
      aboutMe: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      fecha: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },

    });
  
    return RequestInstructor;
  };

