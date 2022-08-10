const { response } = require("express");

const db = require("../database/db");
const { Op } = require("sequelize");

const User = db.user;

const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Curso = db.course;
const Subcategory = db.subcategory;
const Category = db.category;
const packages = db.packageCourse;


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

const sendRemark = async (req, res = response) => {
  const { idc, remarks } = req.body;

  const curso = await Curso.findOne({
    where: { id: idc },
  });

  curso.update({ remark: remarks });
  res.json("Cambios guardados");
};

const changeStateCourse = async (req, res = response) => {
  const { idc, state } = req.body;

  const curso = await Curso.findOne({
    where: { id: idc },
  });

  curso.update({ state });

  res.json("Cambio realizado!");
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
      const { cant_course, price_package, percents_package} = req.body;
      
      if(cant_course > 1){
        const Packages = new packages({
          cant_course,
          price_package,
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
  postPackages
};
