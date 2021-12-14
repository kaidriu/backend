const { response } = require("express");
const bcrypts = require('bcryptjs');
const db = require('../database/db');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const User = db.user;
const Profile = db.profile;


const login=async (req,res=response)=>{

    const{email,password}=req.body;

    try {

        //verificar si existe el email

        const usuario = await User.findOne({
            where: {email}  
        });
        
        if(!usuario){
            return res.status(400).json({
                msg:`No existe un usuario con ese email : ${email}`
            })
        }

        //si existe el usuario

        //verificar la contraseña

        const validarPassword = bcrypts.compareSync(password,usuario.password);

        if(!validarPassword){
            return res.status(400).json({
                msg:`El passsword esta mal : ${password}`
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
            msg:'Hable con el administrador'
        })
    }   

}

const renewToken = async(req, res = response) => {

    const id = req.usuario.id;

    // Generar el TOKEN - JWT
    const token = await generarJWT( id );




    // console.log(email);

    // let usuario = await User.findOne({
    //     where: {email},
    //     attributes: {exclude: ['password','google']},
    //     include: [{
    //         model: Profile,
    //         where:{id}
    //     }]
    // })

    // let perfil = await Profile.findByPk(usuario.id);

    const usuario = await User.findOne({
        attributes: {exclude: ['password'] },
        where:{id},
        include: [{
            model: Profile,
            attributes: {exclude: ['userId']}
        }]
       });


    res.json({
        ok: true,
        token,
        // usuario,
        usuario
    });

}


const GoogleSingIn = async( req,res=response) =>{


    const googleToken = req.body.token;

    try {

        const {name, email, picture} = await googleVerify(googleToken);
       console.log(email);
        const  usuarioDB = await  User.findOne({where:{email}});
        // let usuario;
        console.log(usuarioDB);
        console.log(name, email);

        if(!usuarioDB){
            console.log('nuevo');

            const usuario = new User({
                name,
                email,password :'xxx',
                google : true
            })

            await usuario.save();

            userId=usuario.id;

            image_perfil=picture;

            const profile = new Profile({userId,image_perfil});
            await profile.save();
            
            await usuario.update({profileId:usuario.id});
        }else {
            console.log('viejo');
            usuario = usuarioDB;
            usuario.password = 'xxx';
        }

        const token = await generarJWT(usuario.id);

        res.json(
            {
                ok:true,
                token

            }
        )   
        
    } catch (error) {
        res.status(401).json(
            {
                ok:false,
                msg:'token no es correcto'
            }
        )
    }




}



module.exports={
    login,
    renewToken,
    GoogleSingIn
}