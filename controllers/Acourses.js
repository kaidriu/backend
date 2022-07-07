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
		attributes: ["id", "title", "image_course", "state", "createdAt", "updatedAt"],
		where: { 
			userId: idt
		},
	})
	
	res.json({curso});
}



module.exports = {
  cursosRevision,
  cursosPublicados,
  sendRemark,
  changeStateCourse,
  getCoursesFromInstructor
};
