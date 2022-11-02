const { response } = require('express');
const db = require('../database/db');
const { Op, where } = require("sequelize");
const { adsense } = require('googleapis/build/src/apis/adsense');


const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Course = db.course;
const EnrollCourse = db.enroll_course;
const Module = db.module;
const UserTypes = db.UserType;
const RequestInstructor = db.requestI; 



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

    let { filter } = req.query;

    let limit;

    let where;

    if (filter) {

        console.log(filter);

        filter = `${filter}`

        limit = 10;
        
        where = {
            [Op.or]:{
                name: {
                    [Op.iRegexp]: filter
                },
                email: {
                    [Op.iRegexp]: filter
                },
            }
        }
    }

    const users = await Profile.findAll({
            order: [['id', 'ASC']],
            limit: limit,
            attributes: ['id', 'image_perfil', 'edad'],
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['name', 'email', 'createdAt'],
                    where: where
                },
                {
                    model: Ubication,
                    attributes: ['country'],
                },
            ],
            where: {
                userTypeId: {
                    [Op.not]: 2
                },
            }
        });

    res.json({
        users
    });

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

const postAdmin = async (req, res = response) => {

    const { id } = req.body;

    console.log(id);
    
    const user = await User.findOne({
        where: {id},
        include: {
            model: Profile,
            required: true, 
            attributes: [],
            include: {
                model: UserTypes,
                where: {
                    nametype: {
                        [Op.not]: 'Administrador'
                    }
                }
            }
        }
    });

    if(!user){
        throw new Error('Este usuario no existe o ya es administrador');
    }

    const userType = await UserTypes.findOne({where: {nametype: 'administrador' }});

    const profile = await Profile.findByPk(user.profileId);

    const firstModule = await Module.findByPk(0);

    await profile.update({userTypeId: userType.id});

    await user.addPermits(firstModule);

    res.json({user});
}

const putPermits = async (req, res = response) => {
    const {id, permits} = req.body;
    
    const modules = JSON.parse(permits);
    
    const user = await User.findByPk(id);

    const userType = await UserTypes.findOne({where: {nametype: 'administrador' }});

    const profile = await Profile.findByPk(user.profileId);

    await profile.update({userTypeId: userType.id});

    const adminModules = await Module.findAll({where: { id: {[Op.in]: modules} }});

    await user.setPermits(adminModules);

    res.json({user});
}

const deleteAdmin = async (req, res = response) => {

    const {id} = req.params;

    const user = await User.findByPk(id);

    const profile = await Profile.findByPk(user.profileId);

    await user.setPermits([]);

    //Verificar antiguo rol
    const requestI = await RequestInstructor.findOne({ where: { profileId:  profile.id, state: 'aceptado'} });

    let nametype = 'usuario'; 

    if (requestI)
        nametype = 'instructor';

    const userType = await UserTypes.findOne({where: { nametype }});
 
    await profile.update({userTypeId: userType.id});

    res.json({user})

}


const getAdmins = async (req, res = response) => {
    const admins = await Profile.findAll({
        order: [['id', 'ASC']],
        attributes: ['id', 'image_perfil'],
        include: [
            {
                model: User,
                required: true,
                attributes: ['name', 'email'],
                include: {
                    model: Module,
                    as: 'Permits',
                    attributes:['id', 'name']
                }
            },
            {
                model: UserTypes,
                required: true,
                attributes: [],
                where: {
                    nametype: 'administrador'
                }
            }
        ],
    });

    res.json({admins});
}


module.exports = {
getUsers,
getInstructors,
inspectCourse,
postAdmin,
putPermits,
getAdmins,
deleteAdmin
}