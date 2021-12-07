const {response}= require('express');
const bcrypts=require('bcryptjs');
const db = require('../database/db');

const User = db.user;
const Profile = db.profile;

const usuariosPost = async (req,res=response)=>{

    try {
        // userId=usuario.id;

        const {name,lastname,email,password} =req.body;
        
        const usuario = new User({name,lastname,email,password});

        //encriptar contraseña
        const salt = bcrypts.genSaltSync();
        usuario.password = await bcrypts.hash(password,salt);

        //guardar en bd
        await usuario.save();

        userId=usuario.id;

        image_perfil="https://res.cloudinary.com/dhgzot2dn/image/upload/v1631071826/blank-profile-picture-973460_960_720_mwbf51.png";
        

        const profile = new Profile({userId,image_perfil});
        await profile.save();


        await usuario.update({profileId:usuario.id});


        const usuariof = await User.findOne({
            where: {email},
            attributes: {exclude: ['password']}
        });

        res.json(usuariof)
        
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
        
    }


}


module.exports={
    usuariosPost
}