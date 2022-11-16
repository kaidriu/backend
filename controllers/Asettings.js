const { response } = require("express");
const db = require("../database/db");
const { Op } = require("sequelize");

const driveHelpers = require('../helpers/drive');


const bankAccount = db.bank_account;
const banner = db.banner;

//BANK ACCOUNTS
const getBankAccounts = async (req, res = response) => {
    try {

        const bankAccounts = await bankAccount.findAll({order: ['id']});

        res.status(200).json(bankAccounts);
        
    } catch (error) {
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const postBankAccount = async (req, res = response) => {
    try {

        const { owner_name, owner_document, number, bank_name, bank_type, bank_country, owner_email, state = 'activo' } = req.body;

        const BankAccount = new bankAccount({ owner_name, owner_document, number, bank_name, bank_type, bank_country, owner_email, state });

        await BankAccount.save();
    
        res.status(200).json({BankAccount});
        
    } catch (error) {
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const putBankAccount = async (req, res = response) => {
    try {

        const { id, owner_name, owner_document, number, bank_name, bank_type, bank_country, owner_email, state } = req.body;

        const BankAccount = await bankAccount.findByPk(id);

        await BankAccount.update({owner_name, owner_document, number, bank_name, bank_type, bank_country, owner_email, state});

        res.status(200).json({BankAccount});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const deleteBankAccount = async (req, res = response) => {
    try {

        const { id } = req.params;

        const BankAccount = await bankAccount.findByPk(id);

        await BankAccount.destroy();

        res.status(200).json({BankAccount});

    } catch (error) {
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

//BANNERS
const getBanners = async (req, res = response) => {
    try {

        const banners = banner.findAll();

        res.status(200).json({banners});

    } catch (error) {
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const postBanner = async (req, res = response) => {
    try {

        const { banner_name } = req.body;

        const { archivo } = req.files;
        
        const { tempFilePath } = archivo;
            
        const uploadedImage = await driveHelpers.uploadBannerImage(tempFilePath, archivo.name, archivo.mimetype)
       
        const fileURLs = await driveHelpers.generatePublicUrl(uploadedImage);

        const Banner = new banner({banner_name, banner_link: fileURLs.webContentLink});
                    
        await Banner.save();

        res.status(200).json({Banner});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const deleteBanner = async (req, res = response) => {
    try {

        const { id } = req.params;

        const Banner = banner.findByPk(id);

        await deleteFile(driveHelpers.getIdFromUrl(Banner.banner_link));

        await Banner.destroy();

        res.json({Banner});
        
    } catch (error) {
        res.status(400).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

module.exports = {
    getBankAccounts,
    postBankAccount,
    putBankAccount,
    deleteBankAccount,
    getBanners,
    postBanner,
    deleteBanner
}

