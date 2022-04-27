const { response } = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const enroll_course = db.enroll_course;
const Course = db.course;
const User = db.user;
const Profile = db.profile;
const Tracking = db.content_tracking;
const Topic = db.topic;
const Chapter = db.chapter;
const Task = db.task;

const getEnrollCourse = async (req, res = response) => {

    const { id } = req.params;

    console.log(id);

    const en_cor = await enroll_course.findOne({
        attributes: ['id','courseId', 'userId', 'enroll_date'],
        where: { 
            id: id
        },
        include:[
            {
                model: Course,
                attributes: ['id', 'title'],
            },
            {
                model: User,
                attributes: ['id', 'profileId', 'name', 'email'],
                include: {
                    model: Profile,
                    attributes: ['image_perfil'],
                }
            },
        ]
    })

    /*const con_tra = await tracking.findAll({
        attributes: ['id', 'topicId','score_ct', 'qualification_task'],
        where: {
            enrollCourseId: id
        },
        include: {
            model: Topic,
            attributes: ['id', 'chapterId', 'number_topic', 'title_topic'],
            include:{
                model: Chapter
            }
        }
    })*/

    const chapters = await Chapter.findAll({
        attributes: ['id', 'number_chapter','title_chapter'],
        where : {
            courseId: en_cor.courseId
        },
        include: {
            model: Topic,
            attributes: ['id', 'number_topic', 'title_topic'],
            order: ['number_topic'],
            include: {
                model: Task,
                attributes: ['id', 'name_task','topicId'],              
                include: {
                    model: Topic,
                    attributes: ['id'],
                    include: {
                        model: Tracking,
                        where: {
                            enrollCourseId: en_cor.id
                        },
                        attributes: ['id','score_ct', 'qualification_task'],
                    },
                },
            }
        },
        order: ['number_chapter', sequelize.col('topics.number_topic')]
    }) 

    console.log(en_cor.courseId);

    res.json({en_cor, chapters});
}

module.exports = {
    getEnrollCourse
}