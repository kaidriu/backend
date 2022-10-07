const { response } = require('express');

const db = require('../database/db')

const { Op } = require("sequelize");

const Category = db.category;
const Subcategory = db.subcategory;
const sequelize = require("sequelize");
const errOpNotCompleted = "Servidor: No se pudo completar la operación.";


const GetSubCategory = async (req, res = response) => {

    try {
        const { name_category } = req.params;

        const category = await Category.findOne({
            where: { name_category }
        });

        if(category){

            const subcategory = await Subcategory.findAll({
                where: { categoryId: category.id },
                attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] },
            });

            res.json({
                subcategory
            })

        }else{

            res.status(400).json({
                msg: 'No existe la categoría',
              });

        }

    } catch (error) {
        res.status(500).json({
          msg: errOpNotCompleted,
          error
        });
      }
    
}

const GetCategory = async (req, res = response) => {

    const category = await Category.findAll(
        { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    );

    res.json(
        { category }
    )
}

const getCategoryAndSubcategory = async (req, res = response) => {

    const category = await Category.findAll({ 
        attributes: { 
          exclude: ['createdAt','updatedAt'],
          include:[ 
            [sequelize.literal(`(select array_agg("subcategories"."name_subcategory") from "subcategories" WHERE "subcategories"."categoryId" = "category"."id")`), 'subcategories']
          ]},
      });
    res.json(
        { category }
    )
}


module.exports = {
    GetSubCategory,
    GetCategory,
    getCategoryAndSubcategory
}