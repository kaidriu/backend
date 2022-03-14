module.exports = (sequelize , Sequelize) =>{
    const Task = sequelize.define("task",{
        name_task :{
            type : Sequelize.STRING
        },
        description_task : {
            type : Sequelize.STRING
        },
       file_task :{
            type : Sequelize.STRING
        },
        days_task : {
            type : Sequelize.INTEGER
        }

    });

    return Task;
};