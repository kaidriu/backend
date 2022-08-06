const { response } = require("express");
const db = require('../database/db');
const { Op } = require("sequelize");
const { Sequelize } = require('../database/db');
const courses = db.course;
const packages = db.packageCourse;

const getPackages = async (req, res=response) => {
    const Packages = await packages.findAll({
        include:[
            {
                model: courses,
                as: 'packageToCourse',
                attributes: [
                    "title",
                    "createdAt",
                    "id",
                    "image_course",
                ]
            }
        ]
    });
    res.json({Packages}); 
}

const postPackages = async (req, res=response) => {

    try {
        const { cant_course, price_package, percents_package} = req.body;

        const Packages = new packages({
            cant_course,
            price_package,
            percents_package
        });

        await Packages.save();

        res.json({Packages});        
    } catch (error) {
        res.status(400).send(error)
    }

}

const putPackages = async (req, res=response) => {
    try {
        const { id, cant_course, price_package, percents_package} = req.body;

        const Packages = await packages.findByPk(id)
        
        await Packages.update({
            cant_course,
            price_package,
            percents_package
        });

        res.json({Packages});        
    } catch (error) {
        res.status(400).send(error)
    }
}


module.exports = {
    getPackages
}