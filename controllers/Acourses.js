const { response } = require("express");

const db = require("../database/db");
const { Op, QueryTypes} = require("sequelize");
const { sequelize } = require("../database/db");

const User = db.user;

const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Curso = db.course;
const Topic = db.topic;
const Chapter = db.chapter;
const Subcategory = db.subcategory;
const Category = db.category;
const packages = db.packageCourse;
const Enroll_course = db.enroll_course;



const cursosRevision = async (req, res = response) => {
  const cursos = await Curso.findAll({
    order: [["id", "DESC"]],
    where: {
      state: "revisión",
    },
    include: [
      {
        model: User,
      },
      {
        model: Subcategory,
        include: {
          model: Category,
        },
      },
    ],
  });

  res.json({
    cursos,
  });
};

const cursosPublicados = async (req, res = response) => {
  const cursos = await Curso.findAll({
    order: [["id", "DESC"]],
    where: {
      [Op.not]: [{ state: ["revisión","proceso"]}],
    },
    include: [
      {
        model: User,
      },
      {
        model: Subcategory,
        include: {
          model: Category,
        },
      },
    ],
  });

  res.json({cursos});

};

const aceptarSolicitudCurso = async (req, res = response) => {

  const { idc } = req.body;
  const t = await sequelize.transaction();

  try {  
    
    let actions = []; 

    actions.push(
      Curso.findOne({
        where: { id: idc },
      }).then((curso)=>{
        curso.update({ state },{ transaction: t})
      })
    );

    
    actions.push(
        sequelize.query(
          'UPDATE "topics" SET "topicIsEditable" = false FROM "chapters" WHERE "chapters"."courseId" = ? AND "topics"."chapterId" = "chapters"."id"',
          {
            replacements:[idc],
            type: QueryTypes.SELECT,
            transaction: t
          }
        )
    )
    
  
    await Promise.all(actions);

    await t.commit();

    res.status(200).send({state});
    
  } catch (err) {
    await t.rollback();
    res.status(500).send({error: err.message})
  }

}

const denegarSolicitudCurso = async (req, res = response) => {

  const { idc } = req.params;

  const Curso = await Course.findOne({
      where: { id: idc },
      include: {
        model: Chapter,
        attributes: ["id"],
        include: {
          model: Topic,
          attributes: ["id"],
          where:{
            topicIsEditable: false
          }
        },
      },
  });

  /* if (Curso.chapter == '') {
    
  } */

  console.log(Curso);

  //await Curso.update({ state: 'proceso' })

  res.json({ Curso }) 

}

const sendRemark = async (req, res = response) => {
  const { idc, remarks } = req.body;
  
  const curso = await Curso.findByPk(idc);

  curso.update({ remark: remarks });
  res.json("Cambios guardados");
};

const changeStateCourse = async (req, res = response) => {
  
  const { idc, state } = req.body;
  const t = await sequelize.transaction();

  try {  
    
    let actions = []; 

    actions.push(
      Curso.findOne({
        where: { id: idc },
      }).then((curso)=>{
        curso.update({ state },{ transaction: t})
      })
    );

    if(state=='publicado'){
      actions.push(
        sequelize.query(
          'UPDATE "topics" SET "topicIsEditable" = false FROM "chapters" WHERE "chapters"."courseId" = ? AND "topics"."chapterId" = "chapters"."id"',
          {
            replacements:[idc],
            type: QueryTypes.SELECT,
            transaction: t
          }
        )
      )
    }
  
    await Promise.all(actions);

    await t.commit();

    res.status(200).send({state});
    
  } catch (err) {
    await t.rollback();
    res.status(500).send({error: err.message})
  }
 
};

const getCoursesFromInstructor = async (req, res = response) => {
	const { idt } = req.params;

	const curso = await Curso.findAll({
		attributes: ["id", "title", "image_course", "price", "state", "createdAt", "updatedAt"],
		where: { 
			userId: idt
		},
	})
	
	res.json({curso});
}

//PAQUETES DE CURSOS
const getPackages = async (req, res=response) => {
  
  const Packages = await packages.findAll({
      attributes:{
        exclude:["createdAt", "updatedAt"]
      },
      include:[
          {
              model: Curso,
              as: 'packageToCourse',
              attributes: [
                  "title",
                  "createdAt",
                  "id",
                  "image_course",
              ]
          }
      ]
  });

  res.json({Packages});
}

const postPackages = async (req, res=response) => {

  try {
      const { cant_course, title_package, price_package, percents_package=0} = req.body;
      
      if(cant_course >= 2){
        const Packages = new packages({
          cant_course,
          price_package,
          title_package,
          percents_package
        });

        await Packages.save();
        res.json({Packages});
      }else{
        res.status(400).send("La cantidad de cursos por paquete no puede ser menor a 2");
      }
  } catch (error) {
      res.status(400).send(error)
  }
  
}

const putPackages = async (req, res=response) => {
  try {
      const { id, cant_course, price_package, percents_package} = req.body;

      const Packages = await packages.findByPk(id)
      
      await Packages.update({
          cant_course,
          price_package,
          percents_package
      });

      res.json({Packages});        
  } catch (error) {
      res.status(400).send(error)
  }
}


module.exports = {
  cursosRevision,
  cursosPublicados,
  sendRemark,
  changeStateCourse,
  getCoursesFromInstructor,
  getPackages,
  postPackages,
  aceptarSolicitudCurso, 
  denegarSolicitudCurso,
};
