module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("course", {
      title: { 
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      objectives: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      image_course: {
        type: Sequelize.STRING
      },
      link_presentation: {
        type: Sequelize.STRING
      },   
      mode: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      price:{
        type: Sequelize.DOUBLE
      }
    });
    return Course;
  };

