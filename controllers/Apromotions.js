const { response } = require("express");
const db = require("../database/db");
const { Op } = require("sequelize");
const { Sequelize } = require("../database/db");
const discount = require("../models/discount");
const courses = db.course;
const orderDetails = db.order_details;
const user = db.user;
const subcategory = db.subcategory;
const category = db.category;
const Discount = db.discount;


const postDiscount = async (req, res = response) => {

    try {

        const { title, from, to, percentage, state, subcategoriesIds } = req.body;

        const discount = new Discount({title, from, to, percentage, state, subcategoriesIds});

        await discount.save();
    
        res.status(200).json({discount});

    }catch (error) {
        
        res.status(500).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const putDiscount = async (req, res = response) => {
    try {

        const { id, title, from, to, percentage, state, subcategoriesIds} = req.body;

        const discount = await Discount.findByPk(id);

        await discount.update({title, from, to, percentage, state, subcategoriesIds});
    
        res.status(200).json({discount});

    }catch (error) {
        res.status(500).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const getDiscounts = async (req, res = response) => {
    try {

        const discounts = await Discount.findAll();

        let queryPromises = [];

        discounts.map((discount)=>{
            queryPromises.push(
                subcategory.findAll({
                    attributes:['id', 'name_subcategory'],
                    where: {
                        id: {
                            [Op.in] : discount.subcategoriesIds
                        }
                    }
                }).then((subcategories)=>{
                    discount.dataValues.subcategories = subcategories
                })
            );
        });

        await Promise.all(queryPromises);
 
        res.status(200).json({discounts});

    }catch (error) {
        res.status(500).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

module.exports = {
    postDiscount,
    putDiscount,
    getDiscounts
}