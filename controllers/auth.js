const { response } = require("express");
const bcrypts = require('bcryptjs');
const db = require('../database/db');
const { Op } = require("sequelize");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const User = db.user;
const Profile = db.profile;
const UserTypes = db.UserType;
const UserDetails = db.userDetails;
const Ubication = db.Ubication;

const jwt = require('jsonwebtoken');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        //verificar si existe el email

        const usuario = await User.findOne({
            where: { email },
            include:{
                model:Profile,
                attributes: { exclude: ['createdAt', 'updatedAt', 'ubication-Id', 'userDetailId'] },
            }
        });

        if (!usuario) {
            return res.status(400).json({
                msg: `No existe un usuario con ese email : ${email}`
            })
        }

        //si existe el usuario
        //verificar la contraseña

        const validarPassword = bcrypts.compareSync(password, usuario.password);

        if (!validarPassword) {
            return res.status(400).json({
                msg: `El passsword esta mal : ${password}`
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
    
}

const loginAdmin = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        //verificar usuario administrador por el email
        const usuario = await User.findOne({
            where: { email },
            include: {
                required: true,
                model: UserTypes,
                as: "roles",
                attributes: [],
                through: {
                    attributes: [],
                },
                where: {
                    nametype: "administrador",
                },
            }
        });

        if (!usuario) {
            return res.status(400).json({
                msg: `No existe el usuario administrador: ${email}`
            });
        }

        const validarPassword = bcrypts.compareSync(password, usuario.password);

        if (!validarPassword) {
            return res.status(400).json({
                msg: `El password esta mal : ${password}`
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const   renewToken = async (req, res = response) => {

    const id = req.usuario.id;

    // Generar el TOKEN - JWT
    const token = await generarJWT(id);

    const perfil = await Profile.findOne({

        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userDetailId'] },
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
        ],
    });

    res.json({
        ok: true,
        token,
        perfil
    });

}


const GoogleSingIn = async (req, res = response) => {


    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);
        console.log(email);

        const usuarioDB = await User.findOne({ where: { email } });
        let usuario;

        if (!usuarioDB) {

            console.log('nuevo');

            usuario = new User({
                name,
                email, password: 'xxx',
                google: true
            })

            await usuario.save();

            userId = usuario.id;

            image_perfil = picture;


            const details = new UserDetails();
            await details.save();


            const profile = new Profile({ image_perfil, userTypeId: 1 });
            await profile.save();

            const ubication = new Ubication()
            await ubication.save();



            await usuario.update({ profileId: usuario.id });

            await profile.update({ ubicationId: usuario.id, userDetailId: usuario.id });


        } else {
            console.log('viejo');
            usuario = usuarioDB;
            usuario.password = 'xxx';
        }


        const token = await generarJWT(usuario.id);

        res.json(
            {
                ok: true,
                token
            }
        )

    } catch (error) {
        res.status(401).json(
            {
                ok: false,
                msg: 'token no es correcto 2 ' + error
            }
        )
    }




}


const PasswordRecovery = async (req, res = response) => {

    try {
        // userId=usuario.id;

        const { email, password } = req.body;

        const Usuario = await User.findOne({
            where: {
                email
            }
        });


        //encriptar contraseña
        const salt = bcrypts.genSaltSync();
        encriptada = await bcrypts.hash(password, salt);



        // console.log(encriptada);

        await Usuario.update({ password: encriptada });


        res.json(Usuario)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })

    }
}

const ValidarUsuarioConectado = async (req, res = response) => {

    try {

        const token = req.header('x-token');

        if (!token) {
            res.json({ msg: false })
        }else{
            const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

            const usuario = await User.findByPk(uid);
    
    
    
            req.usuario = usuario;
    
            res.json({ msg: true })
        }



    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


}

module.exports = {
    login,
    renewToken,
    GoogleSingIn,
    loginAdmin,
    PasswordRecovery,
    ValidarUsuarioConectado
}