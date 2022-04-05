const { response } = require('express');
const db = require('../database/db');
const { Op } = require("sequelize");


const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;

const busquedaT = async (req, res = response) => {

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