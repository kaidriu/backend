const { response } = require('express');
const db = require('../database/db');
const { Op } = require("sequelize");
const profile = require('../models/profile');


const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Course = db.course;
const EnrollCourse = db.enroll_course;


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

    res.json({
        usuarios
    })

}

const inspectCourse = async (req, res = response) => {
    const {id} = req.usuario;
    const {idC} = req.body;
    let f = new Date(); //Obtienes la fecha
    let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

    let tempEnroll = await EnrollCourse.findOne({
        where: {
            courseId: idC,
            userId: id
        }
    });

    if(!tempEnroll){
        tempEnroll = new EnrollCourse({ enroll_date: fecha, status_enroll: 'admin', courseId: idC, userId: id });
        await tempEnroll.save();
    }

    res.json({tempEnroll});
}


module.exports = {
getUsers,
getInstructors,
inspectCourse
}