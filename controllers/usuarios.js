const {response}= require('express');
const bcrypts=require('bcryptjs');
const db = require('../database/db');
const request = require("request");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.client_id, process.env.client_secret, process.env.access_token);

const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;

const Type = db.UserType;
const {Router}=require('express');
const router = Router();




const video = async(req,res=response)=>{
    
    try {
        const{tempFilePath}=req.files.archivo;

        let file_name = tempFilePath;
        console.log('object1');
        //  const video = await vimeo(file_name);

        vimeo(file_name).then( (resp)=>{
            console.log(resp);
            console.log('2222');
        } )

        // const video = await vimeo(file_name);

        //  if(!video){
        //     console.log(video);
        //     console.log('1');
        //  }else{
 
        // }
        //  res.json({hols});
        

    } catch (error) {   
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
        
    }



}




const vimeo = function vimeo(file_name){
    return new Promise((resolve)=>{
        setTimeout(() => {
            let video;
            client.upload(  
                file_name,
                {
                    'name': 'Untitledd',
                    'description': 'The description goes here.'
                },
                function (uri) {
        
                    client.request(uri + '?fields=link', function (error, body, _statusCode, _headers) {
                        if (error) {
                            console.log('There was an error making the request.');
                            console.log('Server reported: ' + error);
                            return;
                        }
        
                        console.log('Your video link is: ' + body.link);
                        video= body.link;
                        // resolve(video);
                    });
                    console.log('Your video URI is: ' + uri);
        
                    client.request({
                        method: 'POST',
                        path: '/me/projects',
                        query: {
                            'name': 'finish'
                          }
                      }, function (error, body, status_code, headers,location) {
                        console.log(headers.location);
                        client.request({
                            method: 'PUT',
                            path: headers.location+uri,
                          }, function (error, body, status_code, headers) {
                            console.log(body);
                            console.log(uri + ' will now require a password to be viewed on Vimeo.')
                            resolve(`esto es el uri ${uri} y el link es ${video}` );
                          })
                      })
        
                     
                        
                },
                function (bytes_uploaded, bytes_total) {
                    var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2);
                    console.log(bytes_uploaded, bytes_total, percentage + '%');
                },
                function (error) {
                    console.log('Failed because: ' + error);
                }
                
            );
        }, 1000);
    })
   ;
    
}


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

    const {id} = req.usuario;
    // const {id} = req.params;

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

const usuariosGetId = async(req,res=response)=>{

    // const {id} = req.usuario;
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

const usuariosAllGet = async(req,res=response)=>{

    
    const desde = Number(req.query.desde) || 0;

    // const {id} = req.usuario;
    // const {id} = req.params;
    const [usuarios, total] = await  Promise.all([

        Profile.findAll({
            offset: desde, limit: 5,
                order: [['id', 'ASC']],
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
                    where:{
                        nametype:'usuario'
                    },
                    attributes: {exclude: ['createdAt','updatedAt','id'] },
                }
            ],
            
            
           }),
           
           Profile.count({
               include:[
                {
                    model:Type,
                    where:{
                        nametype:'usuario'
                    },
                }
               ]
           })

    ])

     res.json({
        usuarios,total
     })

} 

const instructorAllGet = async(req,res=response)=>{
    
    const desde = Number(req.query.desde) || 0;

    // const {id} = req.usuario;
    // const {id} = req.params;
    const [instructores, total] = await  Promise.all([

        Profile.findAll({
            offset: desde, limit: 5,
                order: [['id', 'ASC']],
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
                    where:{
                        nametype:'instructor'
                    },
                    attributes: {exclude: ['createdAt','updatedAt','id'] },
                }
            ],
            
            
           }),
           
           Profile.count({
               include:[
                {
                    model:Type,
                    where:{
                        nametype:'instructor'
                    },
                }
               ]
           })

    ])

     res.json({
        instructores,total
     })

} 

const administradorAllGet = async(req,res=response)=>{
    
    const desde = Number(req.query.desde) || 0;

    // const {id} = req.usuario;
    // const {id} = req.params;
    const [administrador, total] = await  Promise.all([

        Profile.findAll({
            offset: desde, limit: 5,
                order: [['id', 'ASC']],
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
                    where:{
                        nametype:'administrador'
                    },
                    attributes: {exclude: ['createdAt','updatedAt','id'] },
                }
            ],
            
            
           }),
           
           Profile.count({
               include:[
                {
                    model:Type,
                    where:{
                        nametype:'administrador'
                    },
                }
               ]
           })

    ])

     res.json({
        administrador,total
     })

} 

const usuariosPut = async(req,res=response)=>{
    
    try {

        let image_perfil = '';

        const {id} = req.usuario;

        const perfil = await Profile.findByPk(id);
             
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            image_perfil = perfil.image_perfil;


        }else{
            //borrar antigua foto
            const nombreArr=perfil.image_perfil.split('/');
            const nombre = nombreArr[nombreArr.length -1];
            const [public_id]=nombre.split('.');
            cloudinary.uploader.destroy(public_id);
            


            // image = await subirArchivo(req.files,undefined,'publicacion');
            const{tempFilePath}=req.files.archivo;
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
            image_perfil= secure_url;
            console.log(secure_url);
        }
        const  {name,country,state,aboutMe,profession,phone,edad,gender} =req.body;

     
    
        // const perfil = await Profile.findByPk(id);
        
        await perfil.update({edad,gender,image_perfil,profession,aboutMe,phone})
    
        const usuario = await User.findByPk(id);
    
        // if(password){
        //     const salt = bcrypts.genSaltSync();
        //     password = await bcrypts.hash(password,salt);
        // }
    
        await usuario.update({name});
    
        const ubication = await Ubication.findByPk(id);
    
        await ubication.update({country,state})
    
        res.json({
            perfil
        })
            
       
        
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
        
    }



}

const usuariosPutTypes = async(req,res=response)=>{
    
    try {

        const  {userTypeId} =req.body;
        const {id} = req.usuario;
        const  {idp} =req.params;
        const perfil = await Profile.findOne({
            where:{id},
            attributes: {exclude: ['createdAt','updatedAt','ubicationId','userTypeId','userDetailId'] },
            include: [
                {
                    model:Type,
                    attributes: {exclude: ['createdAt','updatedAt','id'] },
                }
            ],
                 
           });
             
    
        if(perfil.userType.nametype=='administrador'){

            const updateperfil = await Profile.findOne({
                where:{id:idp},
                attributes: {exclude: ['createdAt','updatedAt','ubicationId','userTypeId','userDetailId'] },
                include: [
                    {
                        model:Type,
                        attributes: {exclude: ['createdAt','updatedAt','id'] },
                    }
                ],   
               });
              
            

            await updateperfil.update({userTypeId})
            
    
       res.json({
        updateperfil
       })
          
       }else{
           return res.status(400).json({
               msg:`Usuario Denegado`
           })
       }
       
        
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
        
    }



}



const usuariosPutInstructor = async(req,res=response)=>{
    
    try {



        const {id} = req.usuario;
        const  {aboutMe,linkCurriculum,linkYT,linkfb,linkTW,linkIG} =req.body;  


        const ver = await Profile.findOne({
            include: [
                {
                    model:Type,
                    where:{
                        nametype:"instructor"
                    },
                    attributes: {exclude: ['createdAt','updatedAt','id'] },
                }
            ]
        })
    
        if(!ver){
    
            res.status(400).json({
                msg:"El usuario no es instructor"
            })
    
        }else{
            const instructor = await UserDetails.findOne({
                where:{id}
            });
    
            
            await instructor.update({aboutMe,linkCurriculum,linkYT,linkfb,linkTW,linkIG})
        
        
            res.json({
                instructor
            })
                
           

        }


   

       
        
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
        
    }



}


const usuariosPassword = async (req,res=response)=>{
    const  {password,passwordnew} =req.body;
    const {id} = req.usuario;

    const usuario = await User.findByPk(id);

    const validarPassword = bcrypts.compareSync(password,usuario.password);

    if(!validarPassword){
        return res.status(400).json({
            msg:`El passsword esta mal : ${password}`
        })
    }

    const salt = bcrypts.genSaltSync();
   const passwordnews = await bcrypts.hash(passwordnew,salt);
    
    await usuario.update({password:passwordnews});

    res.json({
        msg:`Password Actualizado : ${passwordnews}`
    })

}


module.exports={
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosPassword,
    usuariosAllGet,
    instructorAllGet,
    administradorAllGet,
    usuariosGetId,
    usuariosPutInstructor,
    usuariosPutTypes,
    video
}   