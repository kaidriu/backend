const {response}= require('express');
const bcrypts=require('bcryptjs');
const db = require('../database/db');

const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;

const usuariosPost = async (req,res=response)=>{

    try {
        // userId=usuario.id;

        const {name,email,password} =req.body;
        
        const usuario = new User({name,email,password});

        //encriptar contraseña
        const salt = bcrypts.genSaltSync();
        usuario.password = await bcrypts.hash(password,salt);

        //guardar en bd
        await usuario.save();

        userId=usuario.id;

        image_perfil="https://res.cloudinary.com/dhgzot2dn/image/upload/v1631071826/blank-profile-picture-973460_960_720_mwbf51.png";
        

        const profile = new Profile({userId,image_perfil,userTypeId:1});
        await profile.save();

        const ubication = new Ubication()
        await ubication.save();

        const details = new UserDetails();
        await details.save();

        await usuario.update({profileId:usuario.id});

        await profile.update({ubicationId:usuario.id,userDetailId:usuario.id});


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


const usuariosGet = async(req,res=response)=>{

    
    const {id} = req.params;

    const perfil = await Profile.findOne({
        where:{id},
        attributes: {exclude: ['createdAt','updatedAt','ubicationId','userTypeId','userDetailId'] },
        include: [
            {
                model: User,
                attributes: {exclude: ['password','createdAt','updatedAt','id'] },
            },
            {
                model: Ubication,
                attributes: {exclude: ['createdAt','updatedAt','id'] },
            },
            {
                model: UserDetails,
                attributes: {exclude: ['createdAt','updatedAt','id'] },
            },
            {
                model:Type,
                attributes: {exclude: ['createdAt','updatedAt','id'] },
            }
        ],
        
        
       });

     if(!perfil){
         res.status(404).json({
             msg:`No exite el usuario con el id : ${id}`
         })
     }
     res.json({
        perfil
     })

}


const usuariosPut = async(req,res=response)=>{
    
    const  {name,password,country,state,aboutMe,profession,phone,edad,gender,image_perfil} =req.body;

    const {id} = req.usuario;

    const perfil = await Profile.findByPk(id);
    
    await perfil.update({edad,gender,image_perfil,profession,aboutMe,phone})

    const usuario = await User.findByPk(id);

    if(password){
        const salt = bcrypts.genSaltSync();
        password = await bcrypts.hash(password,salt);
    }

    await usuario.update({name,password});


  


    res.json({

        perfil

    })
}


module.exports={
    usuariosPost,
    usuariosGet,
    usuariosPut
}