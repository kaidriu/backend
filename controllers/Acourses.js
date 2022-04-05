const { response } = require('express');

const db = require('../database/db');
const { Op } = require("sequelize");



const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Curso = db.course;
const Subcategory = db.subcategory;
const Category = db.category;

const busquedaT = async (req, res = response) => {


    let bus = req.query.busqueda;

    // bus = bus.map((item) => {
    //     return {$iLike: item};
    // });
    // const regex = new RegExp(bus);


    const usuario = await User.findAll({
        where: {
            name: {
                [Op.iRegexp]: bus
            }
        },


    });

    const desde = Number(req.query.desde) || 0;


    if (bus) {
        const [usuarios, total] = await Promise.all([

            Profile.findAll({
                offset: desde, limit: 5,
                order: [['id', 'ASC']],
                attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
                include: [
                    {
                        model: User,
                        where: {
                            name: {
                                [Op.iRegexp]: bus
                            }
                        },
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: Ubication,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: UserDetails,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: Type,
                        where: {
                            nametype: 'usuario'
                        },
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    }
                ],


            }),

            Profile.count({
                include: [
                    {
                        model: Type,
                        where: {
                            nametype: 'usuario'
                        },
                    },
                    {
                        model: User,
                        where: {
                            name: {
                                [Op.iRegexp]: bus
                            }
                        },
                    }
                ],

            })

        ])

        res.json({
            usuarios, total
        })
    } else {
        const [usuarios, total] = await Promise.all([

            Profile.findAll({
                offset: desde, limit: 5,
                order: [['id', 'ASC']],
                attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: Ubication,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: UserDetails,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: Type,
                        where: {
                            nametype: 'usuario'
                        },
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    }
                ],

            }),

            Profile.count({
                include: [
                    {
                        model: Type,
                        where: {
                            nametype: 'usuario'
                        },
                    },
                    {
                        model: User,
                    }
                ],

            })

        ])

        res.json({
            usuarios, total
        })
    }

}

const cursosRevision = async (req, res = response) => {
        
    const [cursos, total] = await Promise.all([
            Curso.findAll({
                order: [['id', 'DESC']],
                where: { state: "revisión" },
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

            Curso.count({
                where: { state: "revisión" },
                include: {
                    model: User
                }
            })
        ])

        res.json({
            cursos, total
        })
}

const cursosPublicados = async (req, res = response) => {
    const [cursos] = await Promise.all([
            Curso.findAll({
                order: [['id', 'DESC']],
                where:
                    { state: "publicado" }
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
    console.log('hola');

    const { idc, remarks } = req.body;

    let remark;

    if (remarks) {
        remark = remarks.split(",");
    }

    const curso = await Course.findOne({
        where: { id: idc }
    })

    curso.update({ remark });

    res.json({
        curso
    })

}



module.exports = {
    busquedaT,
    cursosRevision,
    cursosPublicados,
    sendRemark
}
