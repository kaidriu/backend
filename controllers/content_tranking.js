const { response } = require("express");

const db = require('../database/db');
const { Op } = require("sequelize");
const { uploadFile, generatePublicUrl, createFolderDriveStudents, deleteFile } = require("../helpers/drive");

const enroll_course = db.enroll_course;
const Tracking = db.content_tracking;
const profile = db.profile;
const User = db.user;
const Topic = db.topic;
const Course = db.course;
const Quiz = db.quiz;

const Chapter = db.chapter;
const Task = db.task;

const sequelize = require("sequelize");


const PostTracking = async (req, res = response) => {

    const { idT, idC } = req.body;
    const { id } = req.usuario;

    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })

    const validar = await Tracking.findOne({
        where: {
            [Op.and]: [{
                topicId: idT
            },
            {
                enrollCourseId: Enroll_course.id
            }
            ]
        }
    })

    if (validar) {
        // res.json({msg:'ya tiene'})

        await Enroll_course.update({
            last_topic: idT
        });
        res.json(validar);
    } else {
        const Tracking = new Tracking({
            topicId: idT,
            enrollCourseId: Enroll_course.id,
            state_content_tacking: false
        })
        await Tracking.save();
        await Enroll_course.update({
            last_topic: idT
        });
        res.json(Tracking);
    }




    // console.log(Enroll_course.id);




}

const GetEnroll = async (req, res = response) => {

    const { idC } = req.params;
    const { id } = req.usuario;

    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })


    res.json(Enroll_course);
}


const AggTask = async (req, res = response) => {


    const { id } = req.usuario;

    const { idC, idT, fecha } = req.body;
    const { archivo } = req.files;


    const { tempFilePath } = archivo;

    let file_name = tempFilePath;

    const Profile = await profile.findOne({
        where: {
            id
        },
        include: {
            model: User
        }
    });


    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })

    const validar = await Tracking.findOne({
        where: {
            [Op.and]: [{
                topicId: idT
            },
            {
                enrollCourseId: Enroll_course.id
            }
            ]
        }
    })

    if (validar) {


        if (Profile.user_id_drive == null) {

            createFolderDriveStudents(Profile.user.email).then(async (resp) => {

                await Profile.update({
                    user_id_drive: resp
                });

                uploadFile(file_name, archivo.name, archivo.mimetype, resp).then((resp2) => {

                    generatePublicUrl(resp2).then(async (xxx) => {

                        // const Tracking = await tracking.findOne({
                        //     where: {
                        //         id: idT
                        //     }
                        // });
                        await validar.update({  
                            id_task_student: resp2,
                            date_finish_task: fecha,
                            link_task: xxx.webViewLink,
                            task_name_student: archivo.name,
                            link_task_download:xxx.webContentLink,
                        })
                        res.json(validar)
                    })
                })
            })


        } else {

            if (validar.id_task_student == null) {
                uploadFile(file_name, archivo.name, archivo.mimetype, Profile.user_id_drive).then((resp) => {
                    generatePublicUrl(resp).then(async (xxx) => {
                        // const Tracking = await tracking.findOne({
                        //     where: {
                        //         id: idT
                        //     }
                        // });
                        await validar.update({
                            id_task_student: resp,
                            date_finish_task: fecha,
                            link_task: xxx.webViewLink,
                            task_name_student: archivo.name,
                            link_task_download:xxx.webContentLink,
                        })

                        res.json(validar)
                    })
                })
            } else {
                deleteFile(validar.id_task_student).then(async (resp) => {
                    await validar.update({ id_task_student: null, task_name_student: null, date_finish_task: null, link_task: null ,link_task_download: null });
                    uploadFile(file_name, archivo.name, archivo.mimetype, Profile.user_id_drive).then((resp) => {
                        generatePublicUrl(resp).then(async (xxx) => {
                            // const Tracking = await tracking.findOne({
                            //     where: {
                            //         id: idT
                            //     }
                            // });
                            await validar.update({

                                id_task_student: resp,
                                date_finish_task: fecha,
                                link_task: xxx.webViewLink,
                                task_name_student: archivo.name,
                                link_task_download:xxx.webContentLink,
                            })

                            res.json(validar)
                        })
                    })
                })
            }






        }

    } else {
        res.json({ msg: 'Debe ver el video' })
    }



}


const GetTaskStudent = async (req, res = response) => {

    const { id } = req.usuario;

    const { idC, idT } = req.params;

    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })

    const validar = await Tracking.findOne({
        where: {
            [Op.and]: [{
                topicId: idT
            },
            {
                enrollCourseId: Enroll_course.id
            }
            ]
        }
    })


    res.json(validar);
}


const DeleteTaskStudent = async (req, res = response) => {

    const { id } = req.usuario;

    const { idC, idT } = req.params;

    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })

    const validar = await Tracking.findOne({
        where: {
            [Op.and]: [{
                topicId: idT
            },
            {
                enrollCourseId: Enroll_course.id
            }
            ]
        }
    })

    deleteFile(validar.id_task_student).then(async (resp) => {
        await validar.update({ id_task_student: null, task_name_student: null, date_finish_task: null, link_task: null,link_task_download: null });
        res.json(validar);
    })


}


const GetTrackingEnroll = async (req, res = response) => {

    const { idC } = req.params;
    const { id } = req.usuario;

    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })

    const validar = await Tracking.findAll({
        // order: [['topicId', 'ASC']],
        attributes: { exclude: [ 'id_task_student','createdAt', 'updatedAt','id', 'score_ct', 'last_min_video', 'last_entre', 'enrollCourseId','link_task', 'qualification_task', 'date_finish_task', 'comment_task'] },
        where: {
            enrollCourseId: Enroll_course.id
        }
    })

    res.json(validar);
}

const PutState = async (req,res=response)=>{

    const {id}=req.body;

    const conten = await Tracking.findOne({
        where:{id}
    });

    await conten.update({state_content_tacking:true});

    res.json(conten)


}


const getalltask = async (req,res=response)=>{

    const { idC } = req.params;
    const { id } = req.usuario;


    const Enroll_course = await enroll_course.findOne({
        where: {
            [Op.and]: [{
                userId: id
            },
            {
                courseId: idC
            }
            ]
        }
    })

    const validar = await Tracking.findAll({
        // order: [['topicId', 'ASC']],
        attributes: { exclude: [ 'id_task_student','createdAt', 'updatedAt','id', 'score_ct', 'last_min_video', 'last_entre', 'enrollCourseId', 'date_finish_task'] },
        where: {
            enrollCourseId: Enroll_course.id
        }

    })

    res.json(validar)
    
}



const SaveTest = async (req,res=response)=>{

    const {idt}=req.params;

    const {data, date}=req.body;

    console.log(data);


    const conten = await Tracking.findOne({
        where:{id:idt}
    });

    await conten.update({test_student:data, date_quiz_student:date});

    res.json(conten)

}

const qualificationTest = async (req,res=response)=>{

    const {idt}=req.params;

    const {data,qualification_test}=req.body;

    console.log(idt);
    console.log(qualification_test);


    const conten = await Tracking.findOne({
        where:{id:idt}
    });

    await conten.update({test_student:data,qualification_test});

    res.json(conten)    

}

const getTest = async (req,res=response)=>{

    const {idu, idt,idC}=req.params;

    const Enroll_course = await enroll_course.findOne({
        attributes: ['id'],
        where: {
            [Op.and]: [{
                userId: idu
            },
            {
                courseId: idC
            }
            ]
        },
        include:[
            {
                model:Tracking,
                attributes: ['id', 'test_student'],
                where:{
                        topicId: idt
                    },
            },
            {
                model:User,
                attributes: [ 'name','email'],
                include:{
                    model:profile,
                    attributes:['image_perfil']

                }
            }
        ]       

    })

    // const Traking = await tracking.findOne({
    //     attributes: ['id', 'test_student'],
    //     where: {
    //         [Op.and]: [{
    //             topicId: idt
    //         },
    //         {
    //             enrollCourseId: Enroll_course.id
    //         }
    //         ]
    //     }
    // })
    res.json(Enroll_course)
}

const getStudentsWithCalifications = async (req, res = response) => {

    const { idC } = req.params;

    const enrolleds = await enroll_course.findAll({
        attributes: [
            'id','courseId', 'userId',
            [sequelize.literal('(select SUM("content_trackings"."qualification_task") from "content_trackings" where "content_trackings"."enrollCourseId" = "enroll_course"."id")'), 'totalTasks'],
            [sequelize.literal('(select SUM("content_trackings"."qualification_test") from "content_trackings" where "content_trackings"."enrollCourseId" = "enroll_course"."id")'), 'totalTests'],
        ],

        where:{
            courseId: idC
        },
        include:{
            model:User,
            attributes: [ 'name','email'],
                include:{
                    model:profile,
                    attributes:['image_perfil']
                }
        },
        group: [sequelize.col('enroll_course.id'), sequelize.col('enroll_course.userId'), sequelize.col('enroll_course.courseId'), sequelize.col('user.id'),sequelize.col('user->profile.id')]
    })

    const curso = await Course.findOne({
        attributes:['title'],
        where: {
            id: idC
        }
    })

    res.json({enrolleds, curso});
}

const getContentTrackingStudent = async (req, res = response) => {
    
    const { idE } = req.params;
    const { idC } = req.params;

    const contentTracking = await Chapter.findAll({
        attributes: [
            'id', 'number_chapter', 'title_chapter'
        ],
        where:{
            [Op.and]:[
                {
                courseId: idC,
                },
                {
                    [Op.or]:[
                        sequelize.where(sequelize.col('topics->quiz.id'), Op.not, null),
                        sequelize.where(sequelize.col('topics->task.id'), Op.not, null),
                    ]
                },
            ]
        },
        include:{
            model: Topic,
            attributes: ['id', 'number_topic', 'title_topic'],
            include:[
                {
                    model: Task,
                    attributes: ['id','name_task', 'note_weight_task'],
                },
                {
                    model: Quiz,
                    attributes: ['id', 'tittle_quizz', 'note_weight_quiz'],
               
                },
                {
                    model: Tracking,
                    attributes: [
                        'id', 'qualification_test', 'qualification_task', 
                        'date_finish_task', 
                        'date_quiz_student'
                    ],
                    where:{
                        enrollCourseId: idE,
                    }
                },

            ]
        },
        order: ['number_chapter', sequelize.col('topics.number_topic')]        
    })

    res.json(contentTracking);
}

module.exports = {
    PostTracking,
    GetEnroll,
    AggTask,
    GetTaskStudent,
    DeleteTaskStudent,
    GetTrackingEnroll,
    PutState,
    getalltask,
    SaveTest,
    getTest,
    qualificationTest,
    getStudentsWithCalifications,
    getContentTrackingStudent
}