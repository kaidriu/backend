module.exports = (sequelize , Sequelize) =>{
    const bankAccount = sequelize.define("bank_account",{
        bank_name: {
            type : Sequelize.STRING
        },
        bank_type: {
            type : Sequelize.STRING
        },
        bank_country: {
            type : Sequelize.STRING
        },
        number: {
            type : Sequelize.STRING
        },
        owner_name: {
            type : Sequelize.STRING
        },
        owner_document: {
            type : Sequelize.STRING
        },
        owner_email: {
            type : Sequelize.STRING
        },
        state: {
            type : Sequelize.STRING
        }
    });

    return bankAccount;
};