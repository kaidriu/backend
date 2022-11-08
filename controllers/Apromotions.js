const { response } = require("express");
const db = require("../database/db");
const { Op } = require("sequelize");
const subcategory = db.subcategory;
const category = db.category;
const Discount = db.discount;


const postDiscount = async (req, res = response) => {

    try {

        const { title, from, to, percentage } = req.body;

        let { subcategoriesIds } = req.body;

        subcategoriesIds = JSON.parse(subcategoriesIds);

        let state = 'pendiente';

        if (new Date(from) < Date.now()) {
            state = 'activo';             
        }

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

        const { id, title, from, to, percentage, state} = req.body;

        let { subcategoriesIds } = req.body;

        subcategoriesIds = JSON.parse(subcategoriesIds);

        const discount = await Discount.findByPk(id);

        await discount.update({title, from, to, percentage, state, subcategoriesIds});
    
        res.status(200).json({discount});

    }catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'error: ',
            error: error.message
        });
    }
}

const getDiscounts = async (req, res = response) => {
    try {

        const {finished} = req.query;

        let whereState;

        if(finished == 'true'){
            whereState = {
                [Op.in] : ['finalizado']
            }
        }else {
            whereState = {
                [Op.not] : ['finalizado']
            }
        }

        const discounts = await Discount.findAll({
            where: {
                state: whereState
            }
        });

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
                    discount.dataValues.subcategories = subcategories; 
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

const getDiscountCategories = async (req, res = response) => {
    
    try {
        const {idD} = req.params;

        const discount = await Discount.findByPk(idD);

        const categories = await category.findAll({
            attributes:['id', 'name_category'],
            include: {
                model: subcategory,
                required: true,
                attributes:['id', 'name_subcategory'],
                where: {
                    id: {
                        [Op.in] : discount.subcategoriesIds
                    }
                }
            }
        });

        res.status(200).json({categories});
        
    } catch (error) {
        res.status(500).json({
            msg: 'error: ',
            error: error.message
        });
    }

}

const deleteDiscount = async (req, res = response) => {
    try {

        const { idD } = req.params;

        const discount = await Discount.findByPk(idD);

        let from = new Date(discount.from);

        if (from < Date.now() || discount.state != 'pendiente') {
            throw new Error('No se puede eliminar el registro');
        }

        discount.destroy();
        
        res.status(200).json({ok: true}); 

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
    getDiscounts,
    deleteDiscount,
    getDiscountCategories
}