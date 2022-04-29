const { response } = require("express");

const db = require('../database/db');
const { Op } = require("sequelize");
const { uploadFile, generatePublicUrl, createFolderDriveStudents, deleteFile } = require("../helpers/drive");

const enroll_course = db.enroll_course;
const tracking = db.content_tracking;
const profile = db.profile;
const User = db.user;
const Topic = db.topic;
const Course = db.course;

const Chapter = db.chapter;
const Task = db.task;

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

    const validar = await tracking.findOne({
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
        const Tracking = new tracking({
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

    const validar = await tracking.findOne({
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
                            link_task: xxx.webContentLink,
                            task_name_student: archivo.name
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
                            link_task: xxx.webContentLink,
                            task_name_student: archivo.name
                        })

                        res.json(validar)
                    })
                })
            } else {
                deleteFile(validar.id_task_student).then(async (resp) => {
                    await validar.update({ id_task_student: null, task_name_student: null, date_finish_task: null, link_task: null });
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
                                link_task: xxx.webContentLink,
                                task_name_student: archivo.name
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

    const validar = await tracking.findOne({
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

    const validar = await tracking.findOne({
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
        await validar.update({ id_task_student: null, task_name_student: null, date_finish_task: null, link_task: null });
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

    const validar = await tracking.findAll({
        // order: [['topicId', 'ASC']],
        attributes: { exclude: [ 'id_task_student','createdAt', 'updatedAt','id', 'score_ct', 'last_min_video', 'last_entre', 'enrollCourseId','link_task', 'qualification_task', 'date_finish_task', 'comment_task'] },
        where: {
            enrollCourseId: Enroll_course.id
        }
    })

    res.json(validar);
}

const PutState = async (req,res=response)=>{

    const {state_content_tacking,id}=req.body;


    const conten = await tracking.findOne({
        where:{id}
    });

    await conten.update({state_content_tacking});

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

    const validar = await tracking.findAll({
        // order: [['topicId', 'ASC']],
        attributes: { exclude: [ 'id_task_student','createdAt', 'updatedAt','id', 'score_ct', 'last_min_video', 'last_entre', 'enrollCourseId', 'qualification_task', 'date_finish_task', 'comment_task'] },
        where: {
            enrollCourseId: Enroll_course.id
        }

    })




    res.json(validar)
}




module.exports = {
    PostTracking,
    GetEnroll,
    AggTask,
    GetTaskStudent,
    DeleteTaskStudent,
    GetTrackingEnroll,
    PutState,
    getalltask
}