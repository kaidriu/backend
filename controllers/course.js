const { response } = require('express');
require('dotenv').config();
const { MoodleClient } = require('node-moodle');


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


        res.json(datos);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: `Hable con el administrador`
        })
    }
}

    

module.exports={
    getCursos
}