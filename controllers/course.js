const { response } = require('express');
require('dotenv').config();
const { MoodleClient } = require('node-moodle');


const db = require('../database/db')

const { Op, where } = require("sequelize");


const Request=db.requestI;
const RequestC=db.requestC;
const User=db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Course = db.course;
const Subcategory = db.subcategory;

const moodle = new MoodleClient({
    baseUrl: process.env.WWWROOT, //<-- Put your Moodle URL here
    token: process.env.TOKEN,//<-- Put your token here
});


const getCursos = async(req, res=response)=>{


    try {


        let datos  = [];


        let resP = await moodle.core.course.getCourses();
        

        // const requ = {
        //     courseid:2

        //     };


        // let resW = await moodle.core.course.getContents(requ);
        

    
        for(let x in resP){

            if(resP[x].categoryid=='0'){

            }else{

                let categoria = resP[x].categoryid;

                const req = {
                criteria: [
                  {            
                    key:"id",
                    value:categoria       
                  }
                ]
                };
                let resY = await moodle.core.course.getCategories(req);

                datos.push({ 
                    "id"    : resP[x].id,
                    "fullname"  : resP[x].fullname,
                    "category" : resY[0].name
                });

            }
        }


        res.json({datos});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
    }
}

    
const SolicitudCurso = async(req,res=response)=>{

    const  {title,description,objectives,image_course,link_presentation,mode,price,name_subcategory} =req.body;
    const {id} = req.usuario;

    // const usuario = await User.findByPk(id);

    const state = "pendiente";
    const userId = id;

    const subcategory = await Subcategory.findOne({
        where: {name_subcategory}  
    });


    const course = new Course({title,description,objectives ,image_course,link_presentation,mode,state,price,userId,subcategoryId:subcategory.id});

    await course.save();

    const requC = await Course.findOne({
        where: {title},
        include: [
            {
                model: User,
            }
        ],
      
    });

    res.json({
        course
    })

}


module.exports={
    getCursos,
    SolicitudCurso
}