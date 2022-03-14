module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("course", {
      title: { 
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING(5000),
      },
      description_large: {
        type: Sequelize.STRING(10000),
      },
      objectives: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      learning: {
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
      },
      languaje:{
        type: Sequelize.STRING
      },
      uri_folder:{
        type: Sequelize.STRING
      },
      state_cart:{
        type: Sequelize.BOOLEAN
      },
      valoration:{
        type: Sequelize.INTEGER
      },
      labels: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
    });
    return Course;
  };

