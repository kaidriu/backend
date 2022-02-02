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
const Chapter = db.chapter;
const Topic = db.topic;

const moodle = new MoodleClient({
    baseUrl: process.env.WWWROOT, //<-- Put your Moodle URL here
    token: process.env.TOKEN,//<-- Put your token here
});


const getCursosMoodle = async(req, res=response)=>{


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

    
const PostCourse = async(req,res=response)=>{

    const  {title,description,objectives,image_course,link_presentation,mode,price} =req.body;
    const {id} = req.usuario;

    // const usuario = await User.findByPk(id);

    const state = "proceso";
    const userId = id;

    // const subcategory = await Subcategory.findOne({
    //     where: {name_subcategory}  
    // });


    const course = new Course({title,description,objectives ,image_course,link_presentation,mode,state,price,userId});

    await course.save();


    const requC = await Course.findOne({
        where: {id: course.id},
        include: [
            {
                model: User,
            }
        ],
      
    });

    res.json({
        requC
    })

}


const PostChapter = async (req,res=response)=>{

    const {number_chapter,title_chapter,title} = req.body;
    
    
    const course = await Course.findOne({
        where: {title}
    });

    if(!course){
        res.json({
            msg:"No existe el curso"
        })
    }else{
        const chapter = new Chapter({number_chapter,title_chapter,courseId:course.id});
        await chapter.save();
        res.json({chapter});
    }
}


const PostTopic = async (req,res=response)=>{

    const {number_topic,title_topic,description_topic,link_video_topic,recurso,title_chapter,title} = req.body;


    const course = await Course.findOne({
        where: {title}
    });

    if(!course){
        res.json({
            msg:"No existe el curso"
        })
    }else{

        const chapter = await Chapter.findOne({
            where: {title_chapter}
        });
    
        if(!chapter){
            res.json({
                msg:"No existe la unidad"
            })
        }else{
            const topic = new Topic({number_topic,title_topic,description_topic,link_video_topic,recurso,chapterId:chapter.id});
            await topic.save();
            res.json({topic});
        }
    }

}

const GetCourse = async(req,res=response)=>{

    const {title} = req.params;

    const curso = await Course.findOne({
        where:{title}
    })

    const chapter = await Chapter.findAll({
        where:{courseId:curso.id},
            // include:[{model:Course}]

    })

    res.json({curso,chapter});
}




const myrequtesCourse = async(req, res = response)=>{

    const {id} = req.usuario;

    const curso = await Course.findAll({
        where:{[Op.and]:[{userId:id},{state : 'proceso'}]}
    })

    res.json({curso});
}

module.exports={
    getCursosMoodle,
    PostCourse,
    PostChapter,
    PostTopic,
    GetCourse,
    myrequtesCourse
}