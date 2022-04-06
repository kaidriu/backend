const { response } = require('express');

const db = require('../database/db');
const { Op } = require("sequelize");



const User = db.user;

const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Curso = db.course;
const Subcategory = db.subcategory;
const Category = db.category;


const cursosRevision = async (req, res = response) => {
        
    const [cursos] = await Promise.all([
            Curso.findAll({
                order: [['id', 'DESC']],
                where: { 
                    state: "revisión" 
                },
                include: [{
                    model: User
                }, {
                    model: Subcategory,
                    include: {
                        model: Category
                    }
                }

                ]

            }),
        ])

        res.json({
            cursos
        })
}

const cursosPublicados = async (req, res = response) => {
    const [cursos] = await Promise.all([
            Curso.findAll({
                order: [['id', 'DESC']],
                where: { 
                    [Op.or]: [
                        { state: "publicado" },
                        { state: "suspendido" }
                    ]  
                }
                ,
                include: [{
                    model: User
                }, {
                    model: Subcategory,
                    include: {
                        model: Category
                    }
                }
                ]
            }),
        ])
        res.json({
            cursos
        })
}

const sendRemark = async (req, res = response) => {

    const { idc, remarks } = req.body;

    const curso = await Curso.findOne({
        where: { id: idc }
    })

    curso.update({ remark: remarks });
    res.json("Cambios realizados!")
}

const changeStateCourse = async (req, res = response) => {

    const { idc, state } = req.body;

    const curso = await Curso.findOne({
        where: { id: idc }
    })

    curso.update({state});

    res.json("Cambio realizado!")

}



module.exports = {
    cursosRevision,
    cursosPublicados,
    sendRemark,
    changeStateCourse
}
