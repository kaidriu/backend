module.exports = (sequelize , Sequelize) =>{
    const bankAccount = sequelize.define("bank_account",{
        title: {
            type : Sequelize.STRING
        },
        bank: {
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
        }
    });

    return bankAccount;
};