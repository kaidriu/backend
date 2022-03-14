module.exports = (sequelize, Sequelize) => {
    const Topic = sequelize.define("topic", {
   
      number_topic:{
        type: Sequelize.INTEGER
      },
      title_topic: { 
        type: Sequelize.STRING
      },
      description_topic: { 
        type: Sequelize.STRING
      },
      recurso: { 
        type: Sequelize.STRING
      },
      demo:{
        type: Sequelize.BOOLEAN
      },
      uri_video:{
        type: Sequelize.STRING
      }
    });
    return Topic;
  };

