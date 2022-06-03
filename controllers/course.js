const { response } = require('express');
require('dotenv').config();

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
const jwt = require('jsonwebtoken');

const db = require('../database/db')

const { Op } = require("sequelize");

const { deleteFolder, createFolder, createVideo, modifyFolder, deleteVideo, putVideo } = require('../helpers/vimeo');


const sequelize = require("sequelize");

const { createFolderDrive, updateTitleFile } = require('../helpers/drive');
const { chapter } = require('../database/db');
const task = require('../models/task');

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
const Task = db.task;

const enroll_course = db.enroll_course;

const quizzes = db.quiz;
const questions = db.question;
const options = db.option;



const PostCourse = async (req, res = response) => {

  const { title, description, objectives, link_presentation, mode, price } = req.body;
  const { id } = req.usuario;

  // const usuario = await User.findByPk(id);
  const image_course = "https://res.cloudinary.com/dvwve4ocp/image/upload/v1647996109/logo_final2_skubul.png";
  const state = "proceso";
  const userId = id;
  const remark = [];

  // const subcategory = await Subcategory.findOne({
  //     where: {name_subcategory}  
  // });



  createFolder(title).then(async (resp) => {
    // console.log(resp);
    uri_folder = resp;

    createFolderDrive(title).then(async (resp) => {
      

      const course = new Course({ title, description, objectives, remark, image_course, link_presentation, mode, state, userId, uri_folder, id_drive: resp });

      await course.save();

      const requC = await Course.findOne({
        where: { id: course.id },
        include: [
          {
            model: User,
          }
        ],

      });

      res.json({
        requC
      })
    })
    // curso.update({ title, description, objectives, image_course, link_presentation, mode, state, price, userId, subcategoryId, languaje, learning, uri_folder, description_large });
    // return res.json({
    //     curso  
    // })
  })
}

const PutCourse = async (req, res = response) => {

  let { title, description, objectives, link_presentation, mode, precio, subcategoryId, learning, languaje, description_large,
    enrollmentDataInitial,
    enrollmentTimeInitial,
    enrollmentDataFinal,
    enrollmentTimeFinal,
    courseDataInitial,
    courseTimeInitial,
    courseDataFinal,
    courseTimeFinal,
    linkCourse,
    discountCode, percentageDiscount,labels
  } = req.body;



  console.log(req.body);

  if (mode == "autoaprendizaje") {


    enrollmentDataInitial = null;
    enrollmentTimeInitial = null;
    enrollmentDataFinal = null;
    enrollmentTimeFinal = null;
    courseDataInitial = null;
    courseTimeInitial = null;
    courseDataFinal = null;
    courseTimeFinal = null;
    linkCourse = null;
  }

  if (learning) {
    learning = learning.split(",");
  }

  if (objectives) {
    objectives = objectives.split(",");
  }
  if (labels) {
    labels = labels.split(",");
  }

  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  console.log(labels)

  let price = parseFloat(precio);
  percentageDiscount = parseFloat(percentageDiscount);

  const { id } = req.usuario;

  const state = "proceso";
  const userId = id;

  const { idc } = req.params;
  let image_course = '';


  const curso = await Course.findOne({
    where: { id: idc }
  })

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
    image_course = curso.image_course;

  } else {
    //borrar antigua foto
    const nombreArr = curso.image_course.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);

    // image = await subirArchivo(req.files,undefined,'publicacion');
    const { tempFilePath } = req.files.image;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { width: 825, height: 500, crop: "scale" });

    // secure_url= `https://res.cloudinary.com/dvwve4ocp/image/upload/${c_scale,h_490,w_825}/v1645053971/okekuswfckbacohbq2is.jpg´

    image_course = secure_url;
  }

  let uri_folder = curso.uri_folder;

  if (curso.title != title) {

    modifyFolder(uri_folder, title).then(() => {

      updateTitleFile(curso.id_drive, title).then(() => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log(resp);
        uri_folder = curso.uri_folder;
        curso.update({
          description_large, title, description, objectives, image_course, link_presentation, mode, state, price, userId, subcategoryId, languaje, learning, uri_folder, enrollmentDataInitial,
          enrollmentTimeInitial,
          enrollmentDataFinal,
          enrollmentTimeFinal,
          courseDataInitial,
          courseTimeInitial,
          courseDataFinal,
          courseTimeFinal,
          linkCourse, discountCode, percentageDiscount,labels
        });
        return res.json({
          curso
        })
      })


    })
  }
  else {
    curso.update({
      description_large, title, description, objectives, image_course, link_presentation, mode, state, price, userId, subcategoryId, languaje, learning, uri_folder, enrollmentDataInitial,
      enrollmentTimeInitial,
      enrollmentDataFinal,
      enrollmentTimeFinal,
      courseDataInitial,
      courseTimeInitial,
      courseDataFinal,
      courseTimeFinal,
      linkCourse, discountCode, percentageDiscount,labels
    });
    return res.json({
      curso
    })
    // }

  }
}


const SendCourse = async (req, res = response) => {
  console.log('hola');

  const { idc } = req.body;
  const state = "revisión";



  const curso = await Course.findOne({
    where: { id: idc }
  })


  curso.update({ state });
  res.json({
    curso
  })

}

const GetCourseRevision = async (req, res = response) => {


  const desde = Number(req.query.desde) || 0;

  const [curso, totales] = await Promise.all([

    Course.findAll({
      offset: desde, limit: 5,
      order: [['id', 'ASC']],
      where: { state: "revisión" },
      include: [{
        model: User
      }, {
        model: Subcategory,
        include: {
          model: Category
        }
      }

      ]

    }),
    Course.count({
      where: { state: "revisión" },
      include: {
        model: User
      }
    })
  ])

  res.json({
    curso, totales
  })
}


const PostChapter = async (req, res = response) => {

  const { num_chapter, title_chapter, idc } = req.body;

  let number_chapter = parseInt(num_chapter);


  const course = await Course.findOne({
    where: { id: idc }
  });

  if (!course) {
    res.json({
      msg: "No existe el curso"
    })
  } else {
    const chapter = new Chapter({ number_chapter, title_chapter, courseId: course.id });
    await chapter.save();
    res.json({ chapter });
  }
}

const GetChapter = async (req, res = response) => {

  const { id } = req.params;

  const curso = await Course.findOne({
    where: { id }
  })

  const chapter = await Chapter.findAll({

    where: { courseId: curso.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [['number_chapter', 'ASC']],

    // include:[{model:Course}]
  })

  res.json(chapter);
}

const PutChatper = async (req, res = response) => {

  const { title_chapter } = req.body;
  const { idch } = req.params;

  const chapter = await Chapter.findOne({
    where: { id: idch }
  })

  await chapter.update({ title_chapter });

  res.json(chapter);

}

const DeleteChapter = async (req, res = response) => {

  const { idch } = req.params;

  const chapter = await Chapter.findOne({
    where: { id: idch },
    include: {
      model: Topic
    }
  });

  const { topics } = chapter;


  console.log('--------------------------------');

  topics.map(async (resp) => {
    if (resp.uri_video != null) {
      await deleteVideo(resp.uri_video);
    }

    console.log(resp.uri_video);
  })
  await chapter.destroy();
  res.json({ chapter })


}


const PostTopic = async (req, res = response) => {

  let { number_topic, title_topic, description_topic, recurso, idc, num_chapter, demo, duration_video } = req.body;

  let idcap = parseInt(num_chapter);
  // const {archivo}=req.files;

  console.log(duration_video);


  console.log('------------------------------------------------------');
  duration_video = parseFloat(duration_video);
  console.log(duration_video);
  const course = await Course.findOne({
    where: { id: idc }
  });

  if (!course) {
    res.json({
      msg: "No existe el curso"
    })
  }

  if (req.files != null) {

    const { archivo } = req.files;

    const { tempFilePath } = archivo;


    let file_name = tempFilePath;

    const chapter = await Chapter.findOne({
      where: { id: idcap }
    });

    if (!chapter) {
      res.json({
        msg: "No existe la unidad"
      })
    }

    createVideo(file_name, title_topic, description_topic, course.uri_folder).then(async (resp) => {
      const { uri } = resp;

      const topicc = new Topic({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, uri_video: uri, duration_video });
      // const topicc = new Topic({ title_topic })

      await topicc.save();

      // res.json({ topic });

      const topic = await Topic.findOne({
        where:
        {
          [Op.and]: [
            { title_topic: topicc.title_topic },
            { chapterId: topicc.chapterId }
          ]
        }
      })

      res.json({ topic })


    })



  } else {

    const chapter = await Chapter.findOne({
      where: { id: idcap }
    });

    if (!chapter) {
      res.json({
        msg: "No existe la unidad"
      })
    }

    const topicc = new Topic({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, duration_video });
    // const topicc = new Topic({ title_topic })

    await topicc.save();

    // res.json({ topic });

    const topic = await Topic.findOne({
      where:
      {
        [Op.and]: [
          { title_topic: topicc.title_topic },
          { chapterId: topicc.chapterId }
        ]
      }
    })

    res.json({ topic })
  }





}

const GetTopic = async (req, res = response) => {

  const { id } = req.params;


  const curso = await Course.findOne({
    where: { id }
  })


  const chapter = await Chapter.findAll({

    where: { courseId: curso.id },
    attributes: { exclude: ['createdAt', 'updatedAt', 'number_chapter', 'title_chapter', 'courseId', 'id'] },
    order: [['number_chapter', 'ASC']],
    include: [{
      model: Topic,
      order: [['number_topic', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      required: true

    }]
  })

  res.json(chapter);
}


const GetCourse = async (req, res = response) => {

  const { title } = req.params;

  const curso = await Course.findOne({
    where: { title }
  })

  const chapter = await Chapter.findAll({
    where: { courseId: curso.id },
    // include:[{model:Course}]

  })

  res.json({ curso, chapter });
}

const getThisEnrollCourses = async (req, res = response) => {

  const { idenrollcourses } = req.query;
  const ids = idenrollcourses.split(",");

  let courses = await enroll_course.findAll({
    attributes: ['id', 'courseId'],
    where: {
      id: {
        [Op.in]: ids
      }
    },
    include: [
      {
        model: Course,
        attributes: ['title'],
      },
    ]
  })

  res.json({ courses });
}


const GeAllCourse = async (req, res = response) => {

  let token = req.query.token;


  if (token) {

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const Enroll_course = await enroll_course.findAll({
      where: { userId: uid },
      attributes: { exclude: ['updatedAt', 'createdAt', 'id', 'enroll_date', 'status_enroll', 'enroll_finish_date', "userId", 'avg_score'] },
    });

    let ids = [];
    Enroll_course.map((resp) => {
      // console.log(resp.courseId);
      ids.push(resp.courseId);

    })

    console.log(ids);

    if (Object.keys(Enroll_course).length == 0) {

      console.log('-----------------enroll---------');
      console.log('todos');
      const curso = await Course.findAll({
        where: { state: "publicado" },
        attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId'] },
        include: [
          {
            model: User,
            attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
            include: {
              model: Profile,
              attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
            }
          },
          {
            model: Subcategory,
            attributes: { exclude: ['updatedAt', 'createdAt', 'categoryId', 'name_subcategory'] },
            include: {
              model: Category,
              attributes: { exclude: ['id', 'updatedAt', 'createdAt'] },
            }
          }
        ]
      })
      res.json({ curso });
    } else {
      console.log('-----------------enroll---------');
      console.log('uno');
      const curso = await Course.findAll({
        where: { state: "publicado", [Op.not]: [{ id: ids }] },
        attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId'] },
        include: [
          {
            model: User,
            attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
            include: {
              model: Profile,
              attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
            }
          },
          {
            model: Subcategory,
            attributes: { exclude: ['updatedAt', 'createdAt', 'categoryId', 'name_subcategory'] },
            include: {
              model: Category,
              attributes: { exclude: ['id', 'updatedAt', 'createdAt'] },
            }
          }


        ]
      })

      res.json({ curso });
    }




  } else {

    const curso = await Course.findAll({
      where: { state: "publicado" },
      attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId'] },
      include: [
        {
          model: User,
          attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
          include: {
            model: Profile,
            attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
          }
        },
        {
          model: Subcategory,
          attributes: { exclude: ['updatedAt', 'createdAt', 'categoryId', 'name_subcategory'] },
          include: {
            model: Category,
            attributes: { exclude: ['id', 'updatedAt', 'createdAt'] },
          }
        }
      ]
    })
    res.json({ curso });
  }




  // const chapter = await Chapter.findAll({
  //     where: { courseId: curso.id },
  //     // include:[{model:Course}]

  // })


}


const getMyPurchasedcourses = async (req, res = response) => {


  const { id } = req.usuario;


  const curso = await Course.findAll({
    where: { state: "publicado" },
    attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId'] },
    include: [
      {
        model: User,
        attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
        include: {
          model: Profile,
          attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
        }
      },
      {
        model: Subcategory,
        attributes: { exclude: ['updatedAt', 'createdAt', 'categoryId', 'name_subcategory'] },
        include: {
          model: Category,
          attributes: { exclude: ['id', 'updatedAt', 'createdAt'] },
        }
      },
      {
        model: enroll_course,
        where: { userId: id },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: true
      }
    ]
  })
  res.json({ curso });
}

const GetCourseid = async (req, res = response) => {

  const { id } = req.params;

  const curso = await Course.findOne({
    where: { id },
    include: [
      {
        model: Subcategory,
        attributes: { exclude: ['createdAt', 'updatedAt', 'categoryId', 'id'] },
        include: [
          {
            model: Category,
            attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
          }
        ]

      }
    ]
  })

  // const chapter = await Chapter.findAll({
  //     where:{courseId:curso.id},
  //         // include:[{model:Course}]

  // })



  res.json({ curso });


}


const myrequtesCourse = async (req, res = response) => {

  const { id } = req.usuario;

  let x = [];
  let y = [];

  const curso = await Course.findAll({
    attributes: ['id', 'title', 'updatedAt', 'state', 'remark'],
    include: [{
      model: Subcategory,
      attributes: ['categoryId'],
    }],
    where: { userId: id }
  })



  curso.map((resp) => {
    if (resp.subcategory != null) {
      x.push(resp.subcategory.categoryId)
    }

  });

  const categor = await Category.findAll({
    where: {
      id: {
        [Op.in]: x
      }
    },
    attributes:
      [sequelize.fn('DISTINCT', sequelize.col('id')), 'id']
    ,
  })

  categor.map((resp) => {
    y.push(resp.id)
  })

  const categories = await Category.findAll({
    where: {
      id: {
        [Op.in]: y
      }
    },
  })

  res.json({ curso, categories });
}


const myCourseswithCountStudents = async (req, res = response) => {

    const { id } = req.usuario;
     

        const curso = await Course.findAll({
            attributes: [
                'title', 'createdAt', 'id', 'image_course',
                [sequelize.literal('(SELECT COUNT(*) from enroll_courses where "courseId"="course"."id")'), 'students']
            ],
            where: { userId: id }
        })


    res.json({ curso });


}


const myCourseswithTasks = async (req, res = response) => {

  const { id } = req.usuario;


  const curso = await Course.findAll({
    attributes: [
      'title', 'createdAt', 'id', 'image_course',
      [sequelize.literal('(SELECT COUNT(*) from tasks where "topicId" in (Select id from topics where "chapterId" in (Select id from chapters where "courseId"= "course"."id")))'), 'tasks']
    ],
    where: { userId: id }
  })


  res.json({ curso });


}

const myCourseswithQuizz = async (req, res = response) => {

  const { id } = req.usuario;


  const curso = await Course.findAll({
    attributes: [
      'title', 'createdAt', 'id', 'image_course',
      [sequelize.literal('(SELECT COUNT(*) from quizzes where "topicId" in (Select id from topics where "chapterId" in (Select id from chapters where "courseId"= "course"."id")))'), 'quizzes']
    ],
    where: { userId: id }
  })


  res.json({ curso });


}

const getCoursesByInstructorId = async (req, res = response) => {

  const { id } = req.usuario;

  const curso = await Course.findAll({
    where: {
      [Op.and]: [
        { userId: id },
        {
          [Op.or]: [
            {
              state: {
                [Op.ne]: "proceso"
              }
            },
            {
              state: {
                [Op.ne]: "revisión"
              }
            }
          ]
        }
      ]
    }
  })
  res.json({ curso });
}


const getAllCourseID = async (req, res = response) => {

  const { id } = req.params;


  const curso = await Course.findOne({
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: User,
        attributes: {
          include: [[
            sequelize.literal(`(SELECT COUNT(*) FROM  courses WHERE courses."userId"="user".id AND courses."state"='publicado')`), 'cursos_totales'
          ]]
          ,
          exclude: ["createdAt", "updatedAt", "google", "is_active"]

        },
        include: [{
          model: Profile,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },


        ]
      },
      {
        model: Subcategory,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Category,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        }
      }
    ]
    // attributes: {
    //     include: [[
    //         sequelize.literal(`(SELECT COUNT(*) FROM  courses WHERE courses."userId"="user".id AND courses."state"='publicado')`), 'cursos_totales'
    //     ]]
    //     ,
    //     exclude: ["createdAt", "updatedAt", "google", "is_active"]

    // },
  })

  // const chapter = await Chapter.findAll({
  //     where: { courseId: curso.id },
  //     attributes: {
  //         include: [[
  //             sequelize.literal(`(SELECT COUNT(*) FROM  topics where chapter."id" = "topics"."chapterId")`), 'temas_totales'
  //         ]]
  //         ,
  //         exclude: ["createdAt", "updatedAt"]

  //     }

  // })



  res.json({ curso })
}

const deleteCourse = async (req, res = response) => {

  const { idc } = req.params;
  const deletevideitos = true;
  const curso = await Course.findOne({
    where: { id: idc }
  })

  deleteFolder(curso.uri_folder, deletevideitos).then(async (resp) => {
    await curso.destroy();
    res.json({ curso })
  })

}


const deleteTopic = async (req, res = response) => {


  const { idt } = req.params;

  // const { tempFilePath } = req.files.archivo;

  // let idcap = parseInt(num_chapter);

  // let file_name = tempFilePath;



  const topic = await Topic.findOne({
    where: { id: idt }
  });

  if (topic.uri_video != null) {
    deleteVideo(topic.uri_video).then((resp) => {


      topic.destroy();
      res.json({ msg: "Tema Borrado con exito" })
    })
  } else {
    topic.destroy();
    res.json({ msg: "Tema Borrado con exito" })
  }


  // createVideo(file_name, title_topic, description_topic, course.uri_folder).then((resp) => {
  //     const { link_video_topic, uri } = resp;
  //     const topic = new Topic({ number_topic, title_topic, description_topic, link_video_topic, option, recurso, chapterId: chapter.id, uri_video: uri });
  //     topic.save();
  //     res.json({ topic });
  // })





}


const puttopic = async (req, res = response) => {

  let { number_topic, title_topic, description_topic, recurso, idc, num_chapter, demo, duration_video } = req.body;

  let idcap = parseInt(num_chapter);
  // const {archivo}=req.files;
  duration_video = parseFloat(duration_video);
  const { idz } = req.params;

  if (req.files != null) {

    const { tempFilePath } = req.files.archivo;


    let file_name = tempFilePath;



    const course = await Course.findOne({
      where: { id: idc }
    });

    if (!course) {
      res.json({
        msg: "No existe el curso"
      })
    }


    const topic = await Topic.findOne({
      where: { id: idz }
    });

    if (topic.uri_video != null) {

      deleteVideo(topic.uri_video).then(async (resp) => {


        await topic.destroy();

        console.log(idcap);

        const chapter = await Chapter.findOne({
          where: { id: idcap }
        });

        if (!chapter) {
          res.json({
            msg: "No existe la unidad"
          })
        }

        createVideo(file_name, title_topic, description_topic, course.uri_folder).then(async (resp) => {
          const { uri } = resp;

          const topicc = new Topic({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, uri_video: uri, duration_video });
          // const topicc = new Topic({ title_topic })

          await topicc.save();

          // res.json({ topic });

          const topic = await Topic.findOne({
            where:
            {
              [Op.and]: [
                { title_topic: topicc.title_topic },
                { chapterId: topicc.chapterId }
              ]
            }
          })

          res.json({ topic })
        });


      })
    } else {

      createVideo(file_name, title_topic, description_topic, course.uri_folder).then(async (resp) => {
        const { uri } = resp;



        const chapter = await Chapter.findOne({
          where: { id: idcap }
        });

        const topicc = await Topic.findOne({
          where: { id: idz }
        });

        await topicc.update({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, uri_video: uri, duration_video });
        // const topicc = new Topic({ title_topic })

        // await topicc.save();

        // res.json({ topic });

        const topic = await Topic.findOne({
          where:
          {
            [Op.and]: [
              { title_topic: topicc.title_topic },
              { chapterId: topicc.chapterId }
            ]
          }
        })

        res.json({ topic })
      });


    }


  } else {


    // const course = await Course.findOne({
    //     where: { id: idc }
    // });

    const topic = await Topic.findOne({
      where: { id: idz }
    });

    console.log(topic);

    if (topic.uri_video != null) {



      const chapter = await Chapter.findOne({
        where: { id: idcap }
      });

      if (!chapter) {
        res.json({
          msg: "No existe la unidad"
        })
      }

      const topicc = await Topic.findOne({
        where: { id: idz }
      });


      await topicc.update({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, duration_video });

      // const { uri } = resp;

      // const topicc = new Topic({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, uri_video: uri });
      // const topicc = new Topic({ title_topic })

      // await topicc.save();

      // res.json({ topic });

      const topic = await Topic.findOne({
        where:
        {
          [Op.and]: [
            { title_topic: topicc.title_topic },
            { chapterId: topicc.chapterId }
          ]
        }
      })

      res.json({ topic })




    } else {

      const chapter = await Chapter.findOne({
        where: { id: idcap }
      });

      if (!chapter) {
        res.json({
          msg: "No existe la unidad"
        })
      }

      const topicc = await Topic.findOne({
        where: { id: idz }
      });


      await topicc.update({ number_topic, title_topic, description_topic, demo, recurso, chapterId: chapter.id, duration_video });

      const topic = await Topic.findOne({
        where:
        {
          [Op.and]: [
            { title_topic: topicc.title_topic },
            { chapterId: topicc.chapterId }
          ]
        }
      })

      res.json({ topic })

    }


  }





}


const PostQuestion = async (req, res = response) => {

  const { idc } = req.params;
  const { question_course, answer_course } = req.body;

  const question = new Question_Course({ question_course, answer_course, courseId: idc });
  await question.save();

  res.json({ question });
}

const PutQuestion = async (req, res = response) => {

  const { question_course, answer_course } = req.body;

  const { idq } = req.params;

  console.log('object');
  const question = await Question_Course.findOne({
    where: { id: idq }
  });

  await question.update({ question_course, answer_course });

  res.json(question);

}

const DeleteQuestion = async (req, res = response) => {

  const { idq } = req.params;


  const question = await Question_Course.findOne({
    where: { id: idq }
  });

  await question.destroy();

  res.json(question);

}

const GetQuestion = async (req, res = response) => {

  const { idc } = req.params;

  const question = await Question_Course.findAll({
    where: { courseId: idc }
  });

  res.json(question);

}


const Getenroll_course = async (req, res = response) => {

  const { idc } = req.params;
  const { id } = req.usuario;

  const Enroll_course = await enroll_course.findOne({
    where: { [Op.and]: [{ courseId: idc }, { userId: id }] }
  });

  res.json(Enroll_course);

}

const checkWeightActivity= async(req, res = response) => {
    const { idc } = req.params;
    const weight = req.query.weight;
    const old_weight = req.query.old_weight;

    const curso = await Course.findOne({
        where: { id: idc },
        attributes : ['id'],
        include:{
            model: Chapter,
            attributes : ['id'],
            include:{
                model: Topic,
                attributes: ['id'],
                include: [{
                    model: Task,
                    attributes: ['id','note_weight_task']
                },
                {
                    model: quizzes,
                    attributes: ['id','note_weight_quiz']
                }
            ]
            }
        }
    });

    let sum_weight = 0;

    curso.chapters.map((chapter)=>{
        chapter.topics.map((topic)=>{
            if(topic.task){
                if(topic.task.note_weight_task)
                    sum_weight+=topic.task.note_weight_task;
            }
            if(topic.quiz){
                if(topic.quiz.note_weight_quiz)
                    sum_weight+=topic.quiz.note_weight_quiz;
            }
        });
    });

    if(old_weight){
        
        sum_weight -=old_weight;
    }

    if(weight<=(10-sum_weight) && weight>=0)
        res.json({valid:true});
    else
        res.json({valid:false, max_weight:(10-sum_weight)});
}

module.exports = {
    PostCourse,
    PostChapter,
    PostTopic,
    GetCourse,
    myrequtesCourse,
    GetCourseid,
    PutCourse,
    GetChapter,
    GetTopic,
    SendCourse,
    GeAllCourse,
    getAllCourseID,
    GetCourseRevision,
    deleteTopic,
    puttopic,
    PutChatper,
    deleteCourse,
    getMyPurchasedcourses,
    getCoursesByInstructorId,
    Getenroll_course,
    DeleteChapter,
    PostQuestion,
    PutQuestion,
    DeleteQuestion,
    GetQuestion,
    getThisEnrollCourses,
    myCourseswithTasks,
    myCourseswithQuizz,
    myCourseswithCountStudents,
    checkWeightActivity
}