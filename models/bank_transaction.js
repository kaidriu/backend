module.exports = (sequelize , Sequelize) =>{
    const bankAccount = sequelize.define("bank_transaction",{
        /* banner_name: {
            type : Sequelize.STRING
        },
        banner_link: {
            type : Sequelize.STRING
        } */
    });

    return bankAccount;
};