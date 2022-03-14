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

const busquedaCurso = async (req, res = response) => {

    let bus = req.query.busqueda;


    // const usuario = await Curso.findAll({
    //     where:{
    // title: {
    //     [Op.iRegexp]: bus
    //   }
    //     },


    // });

    const desde = Number(req.query.desde) || 0;
    if (bus) {
        const [cursos, total] = await Promise.all([

            Curso.findAll({
                offset: desde, limit: 5,
                order: [['id', 'ASC']],
                where: {
                    [Op.and]: [
                        { state: "revisión" },
                        {
                            title: {
                                [Op.iRegexp]: bus
                            }
                        }]
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

            Curso.count({
                where: {
                    [Op.and]: [
                        { state: "revisión" },
                        {
                            title: {
                                [Op.iRegexp]: bus
                            }
                        }]
                },
                include: {
                    model: User
                }
            })
        ])

        res.json({
            cursos, total
        })
    } else {
        const [cursos, total] = await Promise.all([

            Curso.findAll({
                offset: desde, limit: 5,
                order: [['id', 'ASC']],
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



}


const busquedaCursoFinal = async (req, res = response) => {

    let bus = req.query.busqueda;


    // const usuario = await Curso.findAll({
    //     where:{
    // title: {
    //     [Op.iRegexp]: bus
    //   }
    //     },

    // });

    const desde = Number(req.query.desde) || 0;


    if (bus) {
        const [cursos, total] = await Promise.all([

            Curso.findAll({
                offset: desde, limit: 5,
                order: [['id', 'ASC']],

                where: {
                    [Op.and]: [
                        { state: "publicado" },
                        {
                            title: {
                                [Op.iRegexp]: bus
                            }
                        }]
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

            Curso.count({
                where: {
                    [Op.and]: [
                        { state: "publicado" },
                        {
                            title: {
                                [Op.iRegexp]: bus
                            }
                        }]
                },
                include: {
                    model: User
                }
            })

        ])
        res.json({
            cursos, total
        })
    } else {
        const [cursos, total] = await Promise.all([

            Curso.findAll({
                offset: desde, limit: 5,
                order: [['id', 'ASC']],

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

            Curso.count({
                where:

                    { state: "publicado" },

                include: {
                    model: User
                }
            })

        ])
        res.json({
            cursos, total
        })
    }


}




module.exports = {
    busquedaT,
    busquedaCurso,
    busquedaCursoFinal
}