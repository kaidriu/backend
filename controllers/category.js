const { response } = require('express');

const db = require('../database/db')

const { Op } = require("sequelize");

const Category = db.category;
const Subcategory = db.subcategory;
const sequelize = require("sequelize");

const GetSubCategory = async (req, res = response) => {

    const { name_category } = req.params;

    const category = await Category.findOne({
        where: { name_category }
    });

    const subcategory = await Subcategory.findAll({
        where: { categoryId: category.id },
        attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] },
    });

    res.json({
        subcategory
    })
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