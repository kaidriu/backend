module.exports = (sequelize , Sequelize) =>{
    const Task = sequelize.define("task",{
        name_task :{
            type : Sequelize.STRING
        },
        description_task : {
            type : Sequelize.STRING(5000)
        },
       file_task :{
            type : Sequelize.STRING
        },
        days_task : {
            type : Sequelize.INTEGER
        },
        file_types:{
            type : Sequelize.ARRAY(Sequelize.TEXT)
        },
        file_weight:{
            type : Sequelize.DOUBLE
        },
    });

    return Task;
};