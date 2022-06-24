module.exports = (sequelize , Sequelize) =>{
    const Archive = sequelize.define("archive",{
        id_drive_archive :{
            type : Sequelize.STRING
        },
        link_archive_Drive : {
            type : Sequelize.STRING
        },
        name_archive:{
            type : Sequelize.STRING
        }
    });

    return Archive;
};