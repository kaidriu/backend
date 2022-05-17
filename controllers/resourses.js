const { response } = require('express');
const db = require('../database/db')
const { Op, BOOLEAN } = require("sequelize");
const chapter = require('../models/chapter');
const sequelize = require("sequelize");
const { uploadFile, generatePublicUrl, deleteFile } = require('../helpers/drive');
const Request = db.requestI;
const RequestC = db.requestC;
const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Course = db.course;
const Category = db.category;
const Subcategory = db.subcategory;
const Chapter = db.chapter;
const Topic = db.topic;
const Question_Course = db.question_course;

const enroll_course = db.enroll_course;

const quizzes = db.quiz;
const questions = db.question;
const options = db.option;

const task = db.task;

const content_tracking = db.content_tracking;
const archive = db.archive;

const PostQuizz = async (req, res = response) => {

    const { idt } = req.params;

    console.log(req.body);


    const { time, question, answerStuden ,weighing} = req.body;


    const Quizzes = await quizzes.findOne({ where: { topicId: idt } })


    if (Quizzes) {


        const Questions = new questions({ question: question, type_answer: answerStuden, quizId: Quizzes.id ,weighing})
        await Questions.save();
        //     if (resp.answerStuden == false) {
        //         resp.options.map(async (resp2) => {
        //             const Options = new options({ options: resp2.option, answer: resp2.answer, questionId: Questions.id })
        //             await Options.save();
        //         })
        //     }

        res.json({
            Questions, Quizzes
        })

    } 
    // else {
    //     if (time == '') {
    //         const Quizzes = new quizzes({ topicId: idt })
    //         await Quizzes.save();


    //         const Questions = new questions({ question: question, type_answer: answerStuden, quizId: Quizzes.id })
    //         await Questions.save();
    //         //     if (resp.answerStuden == false) {
    //         //         resp.options.map(async (resp2) => {
    //         //             const Options = new options({ options: resp2.option, answer: resp2.answer, questionId: Questions.id })
    //         //             await Options.save();
    //         //         })
    //         //     }

    //         res.json({
    //             Questions, Quizzes
    //         })

    //     } else {
    //         const Quizzes = new quizzes({ time, topicId: idt })
    //         await Quizzes.save();


    //         const Questions = new questions({ question: question, type_answer: answerStuden, quizId: Quizzes.id })
    //         await Questions.save();
    //         //     if (resp.answerStuden == false) {
    //         //         resp.options.map(async (resp2) => {
    //         //             const Options = new options({ options: resp2.option, answer: resp2.answer, questionId: Questions.id })
    //         //             await Options.save();
    //         //         })
    //         //     }

    //         res.json({
    //             Questions, Quizzes
    //         })
    //     }

    // }

}

const CambioestadoQUizz = async (req, res = response) => {

    const { id, answerStuden } = req.body;

    const Questions = await questions.findOne({ where: { id } });


    //Verificar
    if(answerStuden=='true'){
        const Options = await options.findAll({where:{questionId:id}});
        
        Options.map(async (resp)=>{
            const x = await options.findOne({where:{id:resp.id}});
            await x.destroy();
        })
      
    }

    await Questions.update({ type_answer: answerStuden })

    res.json({ Questions })

}


const TimeQuizz = async (req, res = response) => {

    const { time, timeActivate, idt, tittle_quizz } = req.body;

    const Quizzes = new quizzes({ time, timeActivate, topicId: idt, tittle_quizz })


    await Quizzes.save();
    // const Quizzes = await quizzes.findOne({ where: { id } })

    // await Quizzes.update({ time, timeActivate })

    res.json({ Quizzes })

}

const PutQuizz = async (req, res = response) => {

    const {  idq, time, timeActivate, tittle_quizz } = req.body;


    const Quizzes = await quizzes.findOne({where:{id:idq}});

    await Quizzes.update({ time, timeActivate, tittle_quizz });

    res.json({ Quizzes })

}


const Putquestionquizz = async (req, res = response) => {

    const { id, question } = req.body;
    const Question = await questions.findOne({ where: { id } })
    await Question.update({ question })
    res.json(Question)

}

const PostOptions = async (req, res = response) => {

    const { idq, option, answer } = req.body;

    const Options = new options({ options: option, answer, questionId: idq });
    await Options.save();


    res.json({ Options })

}


const SeleccionarRespuesta = async (req, res = response) => {

    const { idq, ido } = req.body;

    const Options = await options.findAll({ where: { questionId: idq } })

    Options.map(async (resp) => {

        if (ido == resp.id) {
            let cambiar = await options.findOne({ where: { id: resp.id } })
            await cambiar.update({ answer: true })
        } else {
            let cambiar = await options.findOne({ where: { id: resp.id } })
            await cambiar.update({ answer: false })
        }

    })

    res.json({ Options })

}


const DeleteAnswer = async (req, res = response) => {

    const { ido } = req.params;


    let Options = await options.findOne({ where: { id: ido } })
    await Options.destroy();


    res.json({ Options })

}

const DeleteQuestion = async (req, res = response) => {

    const { idq } = req.params;


    let Questions = await questions.findOne({ where: { id: idq } })
    await Questions.destroy();


    res.json({ Questions })

}


const GetQuizz = async (req, res = response) => {


    const { idt } = req.params;

    const Quizzes = await quizzes.findOne({
        where: { topicId: idt },
        order: [['id', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },

    })

    if (Quizzes) {
        const Questions = await questions.findAll({
            where: { quizId: Quizzes.id },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            // attributes: { exclude: ['createdAt', 'updatedAt', 'number_chapter', 'title_chapter', 'courseId', 'id'] },
            order: [['id', 'ASC']],
            include: [{
                model: options,
                order: [['id', 'DESC']],
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                // required: true
            }]

        })
        res.json({
            Questions,
            Quizzes
        })
    } else {
        res.json({
            // Questions,
            Quizzes
        })
    }



}


const DeleteQuizz = async (req, res = response) => {


    const { idt } = req.params;

    const Quizzes = await quizzes.findOne({
        where: { topicId: idt },


    })

    await Quizzes.destroy();

    res.json(Quizzes);


}



const GetTask = async (req, res = response) => {

    const { idt } = req.params;

    const Task = await task.findOne({ where: { topicId: idt } })

    res.json({ Task })
}

const GetAllTask = async (req, res = response) => {

    const { idC } = req.params;

    const curso = await Course.findOne({
        where: { id: idC }
    })

    const chapter = await Chapter.findAll({

        where: { courseId: curso.id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'number_chapter', 'title_chapter', 'courseId', 'id'] },
        order: [['number_chapter', 'ASC']],
        include: [{
            model: Topic,
            order: [['number_topic', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            // required: true
            include: {
                model: task,
                required: true
            }

        }]
    })

    res.json(chapter)
}


const   GetAllQuizz = async (req, res = response) => {

    const { idC } = req.params;

    const curso = await Course.findOne({
        where: { id: idC }
    })

    const chapter = await Chapter.findAll({

        where: { courseId: curso.id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'number_chapter', 'title_chapter', 'courseId'] },
        order: [['number_chapter', 'ASC']],
        include: [{
            model: Topic,
            order: [['number_topic', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt', 'number_topic', 'description_topic', 'recurso', 'demo', 'uri_video', 'duration_video', 'chapterId'] },
            // required: true
            include: {
                model: quizzes,
                attributes: { exclude: ['createdAt', 'updatedAt', 'time', 'timeActivate'] },
                required: true
            }

        }]
    })

    res.json(chapter)
}

const GetAllArchives = async (req, res = response) => {

    const { idC } = req.params;

    const curso = await Course.findOne({
        where: { id: idC }
    })

    let ids_archives = [];

    const chapter = await Chapter.findAll({

        where: { courseId: curso.id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'number_chapter', 'title_chapter', 'courseId', 'id'] },
        order: [['number_chapter', 'ASC']],
        include: [{
            model: Topic,
            order: [['number_topic', 'ASC']],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            // required: true
            include: {
                model: archive,
                required: true
            }

        }]
    })


    chapter.map((resp) => {
        // if(resp.Topic!=null){
        resp.topics.map((resp2) => {
            // console.log(resp2.id);
            ids_archives.push(resp2.id);
        })

        // }

    })

    const archives = await archive.findAll({
        where: {
            topicId: {
                [Op.in]: ids_archives
            }
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'id_drive_archive'] },
    })


    res.json(archives)
}


const GetHomeTask = async (req, res = response) => {

    const { idC, idT } = req.params;

    const enroll = await enroll_course.findAll({
        where: { courseId: idC },
        attributes: { exclude: ["enroll_date", "status_enroll", "enroll_finish_date", "updatedAt", "courseId", "userId", "avg_score", "last_topic"] },
        include: [
            {
                model: User,
                attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'is_active', 'google', 'profileId'] },
                include: {
                    model: Profile,
                    attributes: { exclude: ['user_id_drive', 'id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                }
            },
            {
                model: content_tracking,
                attributes: {
                    exclude: ["state_content_tacking", "score_ct", "last_min_video", "last_entre", "createdAt", "updatedAt", "topicId", "enrollCourseId"
                        , "task_name_student", "id_task_student"]
                },
                include: {
                    model: Topic,
                    attributes: { exclude: ["number_topic", "title_topic", "description_topic", "recurso", "createdAt", "updatedAt", "chapterId", "uri_video", "demo", "duration_video"] },
                    where: { id: idT }
                }
            }
        ]
    })

    // const chapter = await Chapter.findAll({

    //     where: { courseId: curso.id },
    //     attributes: { exclude: ['createdAt', 'updatedAt', 'number_chapter', 'title_chapter', 'courseId', 'id'] },
    //     order: [['number_chapter', 'ASC']],
    //     include: [{
    //         model: Topic,
    //         order: [['number_topic', 'ASC']],
    //         attributes: { exclude: ['createdAt', 'updatedAt'] },
    //         // required: true
    //         include:{
    //             model:task,
    //             required: true
    //         }

    //     }]
    // })

    res.json(enroll)
}


const PutHomeTask = async (req, res = response) => {

    const { idH } = req.params;
    const { qualification_task, comment_task } = req.body;

    const content = await content_tracking.findOne({
        where: { id: idH }
    })

    content.update({ qualification_task, comment_task });

    res.json(content);
}


const PostTask = async (req, res = response) => {

    const { name_task, description_task, days_task, topicId } = req.body;

    const Task = new task({ name_task, description_task, days_task, topicId });

    await Task.save();

    res.json({ Task })
}

const PutTask = async (req, res = response) => {

    const { id, name_task, description_task, days_task } = req.body;

    console.log(id);

    const Task = await task.findOne({ where: { id } })

    Task.update({ name_task, description_task, days_task });

    res.json({ Task })
}

const DeleteTask = async (req, res = response) => {

    const { idt } = req.params;


    const Task = await task.findOne({ where: { id: idt } })

    Task.destroy();


    res.json({ Task })

}

const PostArchive = async (req, res = response) => {

    const { idc, idt } = req.body;

    const { archivo } = req.files;
    console.log(archivo);
    // console.log(idc);
    // console.log(idt);

    const { tempFilePath } = archivo;
    const curso = await Course.findOne({ where: { id: idc } });
    let file_name = tempFilePath;
    // console.log(tempFilePath);

    uploadFile(file_name, archivo.name, archivo.mimetype, curso.id_drive).then((resp) => {
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log(resp);

        generatePublicUrl(resp).then(async (xxx) => {
            // console.log('linkkkkkkkkkkkkkk');
            // console.log(xxx.webContentLink);

            const Archive = new archive({ name_archive: archivo.name, id_drive_archive: resp, link_archive_Drive: xxx.webContentLink, topicId: idt });

            await Archive.save();
            res.json({ Archive })
        })
    })

}

const GetArchive = async (req, res = response) => {

    const { idt } = req.params;

    const Archive = await archive.findAll({ where: { topicId: idt } })

    res.json({ Archive })

}

const Deletearchive = async (req, res = response) => {

    const { ida } = req.params;

    const Archive = await archive.findOne({ where: { id: ida } })



    deleteFile(Archive.id_drive_archive).then(async (resp) => {
        await Archive.destroy();
        res.json({ Archive })
    })




}

const GetDateCourse = async (req, res = response) => {

    const { ida } = req.params;

    const Archive = await archive.findOne({ where: { id: ida } })



    deleteFile(Archive.id_drive_archive).then(async (resp) => {
        await Archive.destroy();
        res.json({ Archive })
    })




}


module.exports = {
    PostQuizz,
    GetQuizz,
    CambioestadoQUizz,
    PostOptions,
    SeleccionarRespuesta,
    DeleteAnswer,
    DeleteQuestion,
    PostTask,
    PutTask,
    DeleteTask,
    GetTask,
    PostArchive,
    GetArchive,
    Deletearchive,
    DeleteQuizz,
    TimeQuizz,
    GetAllTask,
    GetHomeTask,
    PutHomeTask,
    GetAllQuizz,
    GetAllArchives,
    Putquestionquizz,
    PutQuizz
}