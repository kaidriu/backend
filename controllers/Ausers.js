const { response } = require('express');
const db = require('../database/db');
const { Op } = require("sequelize");


const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;


const getInstructors = async (req, res = response) => {

    const [instructores] = await Promise.all([
        Profile.findAll({
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
                        nametype: 'instructor'
                    },
                    attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                }
            ],
        })
    ])

    console.log(instructores);

    res.json({
        instructores
    })

}

const getUsers = async (req, res = response) => {

    const [usuarios] = await Promise.all([
        Profile.findAll({
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

    ])

    console.log({usuarios});

    res.json({
        usuarios
    })

}


module.exports = {
getUsers,
getInstructors
}