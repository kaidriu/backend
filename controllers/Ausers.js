const { response } = require("express");
const db = require("../database/db");
const { Op, where } = require("sequelize");
const { adsense } = require("googleapis/build/src/apis/adsense");

const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Course = db.course;
const EnrollCourse = db.enroll_course;
const Module = db.module;
const UserTypes = db.UserType;
const RequestInstructor = db.requestI;

const getInstructors = async (req, res = response) => {
  const [instructores] = await Promise.all([
    Profile.findAll({
      order: [["id", "ASC"]],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "ubicationId",
          "userTypeId",
          "userDetailId",
        ],
      },
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt", "id"] },
        },
        {
          model: Ubication,
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
        {
          model: UserDetails,
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
        {
          model: Type,
          where: {
            nametype: "instructor",
          },
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
      ],
    }),
  ]);

  res.json({
    instructores,
  });
};

const getUsers = async (req, res = response) => {
  let { filter } = req.query;

  let limit;

  let where;

  if (filter) {
    console.log(filter);

    filter = `${filter}`;

    limit = 10;

    where = {
      [Op.or]: {
        name: {
          [Op.iRegexp]: filter,
        },
        email: {
          [Op.iRegexp]: filter,
        },
      },
    };
  }

  /* const users = await Profile.findAll({
            order: [['id', 'ASC']],
            limit: limit,
            attributes: ['id', 'image_perfil', 'edad'],
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['name', 'email', 'createdAt'],
                    where: where
                },
                {
                    model: Ubication,
                    attributes: ['country'],
                },
            ],
            where: {
                userTypeId: {
                    [Op.not]: 2
                },
            }
        }); */

  const users = await User.findAll({
    order: [["id", "ASC"]],
    limit: limit,
    attributes: ["id", "name", "email", "createdAt"],
    where: where,
    include: [
      {
        required: true,
        model: UserTypes,
        as: "roles",
        attributes: [],
        through: {
          attributes: [],
        },
        where: {
          nametype: "usuario",
        },
      },
      {
        model: Profile,
        attributes: ['id', 'image_perfil', 'edad'],
        include: {
            model: Ubication,
            attributes: ['country'],
        }
      }
    ],
  });

  res.json({
    users,
  });
};

const inspectCourse = async (req, res = response) => {
  const { id } = req.usuario;
  const { idC } = req.body;
  let f = new Date(); //Obtienes la fecha
  let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

  let tempEnroll = await EnrollCourse.findOne({
    where: {
      courseId: idC,
      userId: id,
    },
  });

  if (!tempEnroll) {
    tempEnroll = new EnrollCourse({
      enroll_date: fecha,
      status_enroll: "admin",
      courseId: idC,
      userId: id,
    });
    await tempEnroll.save();
  }

  res.json({ tempEnroll });
};

const postAdmin = async (req, res = response) => {
  const { id } = req.body;

  const user = await User.findOne({
    where: { id },
    attributes:['id'],
    include: {
      required: true,
      model: UserTypes,
      as: "roles",
      attributes: [],
      where:{
        nametype: 'administrador'
      },
      through: {
        attributes: [],
      }
    }
  });

  if (user) {
    res.status(400).send("Este usuario no existe o ya es administrador");
    return false;
  }

  const userAdmin = await User.findByPk(id);

  const userType = await UserTypes.findOne({
    where: { nametype: "administrador" },
  });

  await userAdmin.addRoles(userType);

  const firstModule = await Module.findByPk(0);

  await userAdmin.setModules(firstModule);

  res.json({ userAdmin });
};

const getMyPermits = async (req, res = response) => {
  const { id } = req.usuario;

  const { module } = req.query;

  const permits = await User.findOne({
    attributes: ["id", "name", "email"],
    where: { id },
    include: {
      model: Module,
      as: "modules",
      attributes: ["id", "name"],
    },
  });

  if (module) {
    let result = permits.dataValues.modules.find(
      (permit) => permit.dataValues.id == module
    );

    if (result) {
      res.json(true);
    } else {
      res.json(false);
    }
  } else {
    res.json({ permits });
  }
};

const putPermits = async (req, res = response) => {
  const { id, permits } = req.body;

  const modules = JSON.parse(permits);

  const user = await User.findByPk(id);

  const adminModules = await Module.findAll({
    where: { id: { [Op.in]: modules } },
  });

  await user.setModules(adminModules);

  res.json({ user });
};

const deleteAdmin = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  await user.setModules([]);

  const userType = await UserTypes.findOne({ where: { nametype: 'administrador' } });

  await user.removeRoles(userType);

  res.json({ user });
};

const getAdmins = async (req, res = response) => {

  const admins =  await User.findAll({
    order: [["id", "ASC"]],
    attributes: ["id", "name", "email"],
    include: [
      {
        required: true,
        model: UserTypes,
        as: "roles",
        attributes: [],
        through: {
          attributes: [],
        },
        where: {
          nametype: "administrador",
        },
      },
      {
        model: Profile,
        attributes: ['id', 'image_perfil'],
      },
      {
        model: Module,
        as: "modules",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        }
      }
    ],
  });

  res.json({ admins });
};

module.exports = {
  getUsers,
  getInstructors,
  inspectCourse,
  postAdmin,
  putPermits,
  getAdmins,
  deleteAdmin,
  getMyPermits,
};
