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
      link_video_topic: { 
        type: Sequelize.STRING
      },
      recurso: { 
        type: Sequelize.STRING
      }
    });
    return Topic;
  };

