module.exports = (sequelize , Sequelize) =>{
    const bankAccount = sequelize.define("bank_account",{
        bank_name: {
            type : Sequelize.STRING
        },
        type: {
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
        state: {
            type : Sequelize.STRING
        }
    });

    return bankAccount;
};