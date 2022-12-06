const { response } = require("express");
const bcrypts = require("bcryptjs");
const db = require("../database/db");
const request = require("request");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

let Vimeo = require("vimeo").Vimeo;
let client = new Vimeo(
  process.env.client_id,
  process.env.client_secret,
  process.env.access_token
);

const { Op } = require("sequelize");

const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Course = db.course;
const Request = db.requestI;
const UserTypes = db.UserType;
const enroll_course = db.enroll_course;

const { Router } = require("express");
const router = Router();

const sequelize = require("sequelize");
const profile = require("../models/profile");
const user = require("../models/user");
const { Sequelize, message } = require("../database/db");

const video = async (req, res = response) => {
  try {
    const { tempFilePath } = req.files.archivo;

    let file_name = tempFilePath;
    console.log("object1");
    //  const video = await vimeo(file_name);

    vimeo(file_name).then((resp) => {
      console.log(resp);
      console.log("2222");
    });

    // const video = await vimeo(file_name);

    //  if(!video){
    //     console.log(video);
    //     console.log('1');
    //  }else{

    // }
    //  res.json({hols});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

const vimeo = function vimeo(file_name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let video;
      client.upload(
        file_name,
        {
          name: "Untitledd",
          description: "The description goes here.",
        },
        function (uri) {
          client.request(
            uri + "?fields=link",
            function (error, body, _statusCode, _headers) {
              if (error) {
                console.log("There was an error making the request.");
                console.log("Server reported: " + error);
                return;
              }

              console.log("Your video link is: " + body.link);
              video = body.link;
              // resolve(video);
            }
          );
          console.log("Your video URI is: " + uri);

          client.request(
            {
              method: "POST",
              path: "/me/projects",
              query: {
                name: "finish",
              },
            },
            function (error, body, status_code, headers, location) {
              console.log(headers.location);
              client.request(
                {
                  method: "PUT",
                  path: headers.location + uri,
                },
                function (error, body, status_code, headers) {
                  console.log(body);
                  console.log(
                    uri + " will now require a password to be viewed on Vimeo."
                  );
                  resolve(`esto es el uri ${uri} y el link es ${video}`);
                }
              );
            }
          );
        },
        function (bytes_uploaded, bytes_total) {
          var percentage = ((bytes_uploaded / bytes_total) * 100).toFixed(2);
          console.log(bytes_uploaded, bytes_total, percentage + "%");
        },
        function (error) {
          console.log("Failed because: " + error);
        }
      );
    }, 1000);
  });
};

const usuariosPost = async (req, res = response) => {
  try {
    // userId=usuario.id;

    const { name, email, password } = req.body;

    const usuario = new User({ name, email, password });

    //encriptar contraseña
    const salt = bcrypts.genSaltSync();
    usuario.password = await bcrypts.hash(password, salt);

    //guardar en bd
    await usuario.save();

    userId = usuario.id;

    image_perfil =
      "https://res.cloudinary.com/dhgzot2dn/image/upload/v1631071826/blank-profile-picture-973460_960_720_mwbf51.png";

    const profile = new Profile({ userId, image_perfil, userTypeId: 1 });
    await profile.save();

    const ubication = new Ubication();
    await ubication.save();

    const details = new UserDetails();
    await details.save();

    await usuario.update({ profileId: usuario.id });

    await profile.update({ ubicationId: usuario.id, userDetailId: usuario.id });

    const usuariof = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });

    res.json(usuariof);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

const usuariosGet = async (req, res = response) => {
  const { id } = req.usuario;

  const perfil = await User.findOne({
    attributes: { exclude: ["password", "createdAt", "updatedAt", "id"] },
    where: { id },
    include: [
      {
        required: true,
        model: UserTypes,
        as: "roles",
        attributes: ['nametype'],
        through: {
          attributes: [],
        },
        where: {
          nametype: "instructor",
        },
      },
      {
        model: Profile,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "ubicationId",
            "userTypeId",
            "userDetailId",
          ],
        },
        include:[
          {
            model: Ubication,
            attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          },
          {
            model: UserDetails,
            attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          },
        ]     
      }, 
    ],
  });

  if (!perfil) {
    res.status(404).json({
      msg: `No exite el usuario con el id : ${id}`,
    });

    return false;
  }

  res.json({
    perfil,
  });
};

const usuariosGetId = async (req, res = response) => {
  // const {id} = req.usuario;
  const { id } = req.params;

  const perfil = await Profile.findOne({
    where: { id },
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
        model: UserTypes,
        attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      },
    ],
  });

  if (!perfil) {
    res.status(404).json({
      msg: `No exite el usuario con el id : ${id}`,
    });
  }
  res.json({
    perfil,
  });
};

const usuariosAllGet = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  // const {id} = req.usuario;
  // const {id} = req.params;
  const [usuarios, total] = await Promise.all([
    Profile.findAll({
      offset: desde,
      limit: 5,
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
          model: UserTypes,
          where: {
            nametype: "usuario",
          },
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
      ],
    }),

    Profile.count({
      include: [
        {
          model: UserTypes,
          where: {
            nametype: "usuario",
          },
        },
      ],
    }),
  ]);

  res.json({
    usuarios,
    total,
  });
};

const instructorAllGet = async (req, res = response) => {

    const [instructores] = await Promise.all([

    User.findAll({
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
              nametype: "instructor",
            },
          },
          {
            model: Profile,
            attributes: ['id', 'image_perfil', 'phone', 'profession', 'aboutMe'],
            include: {
                model: Ubication,
                attributes: ['country', 'state'],
            }
          }
        ],
      }),
  ]);

  res.json({
    instructores,
  });
};

const GetAllInstructor = async (req, res = response) => {

  const instructores =  await User.findAll({
    attributes: 
      [
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM  courses WHERE courses."userId"="user".id AND courses."state"='publicado')`
          ),
          "cursos_totales",
        ],
      ],
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
          nametype: "instructor",
        },
      },
      {
        model: Profile,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "ubicationId",
            "userTypeId",
            "userDetailId",
          ],
        },
        include:[
          {
            model: Ubication,
            attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          },
          {
            model: UserDetails,
          },
        ]     
      },
      {
        model: Request,
        attributes: ["category"],
      },
    ],
  });

  res.json({ instructores });

};

const GetOneInstructor = async (req, res = response) => {
  const { idp } = req.params;

  const [instructores] = await Promise.all([
    Profile.findOne({
      where: { id: idp },
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
          attributes: {
            include: [
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM  courses WHERE courses."userId"="user".id AND courses."state"='publicado')`
                ),
                "cursos_totales",
              ],
            ],
            exclude: [
              "createdAt",
              "updatedAt",
              "google",
              "is_active",
              "password",
              "createdAt",
              "updatedAt",
              "id",
            ],
          },
          // include:[
          //     {
          //         model:Course,
          //         where:{state:'publicado'}
          //     }
          // ]
        },
        {
          model: UserTypes,
          where: {
            nametype: "instructor",
          },
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
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
          model: Request,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "aboutMe",
              "category",
              "fecha",
              "state",
            ],
          },
        },
      ],
    }),
  ]);
  res.json(instructores);
};

const getcoursysId = async (req, res = response) => {
  const { idp } = req.params;

  const course = await Course.findAll({
    where: {
      [Op.and]: [{ userId: idp }, { state: "publicado" }],
    },
    include: {
      model: User,
    },
  });

  res.json({ course });
};

const administradorAllGet = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  // const {id} = req.usuario;
  // const {id} = req.params;
  const [administrador, total] = await Promise.all([
    Profile.findAll({
      offset: desde,
      limit: 5,
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
          model: UserTypes,
          where: {
            nametype: "administrador",
          },
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
      ],
    }),

    Profile.count({
      include: [
        {
          model: UserTypes,
          where: {
            nametype: "administrador",
          },
        },
      ],
    }),
  ]);

  res.json({
    administrador,
    total,
  });
};

const getMyStudents = async (req, res = response) => {
  const { id } = req.usuario;
  let idc = req.query.idc;
  let students = null;

  if (!idc) {
    students = await enroll_course.findAll({
      attributes: [
        "userId",
        [
          Sequelize.fn("array_agg", Sequelize.col("enroll_course.id")),
          "enroll_courses",
        ],
        [
          Sequelize.fn("min", Sequelize.col("enroll_course.createdAt")),
          "student_since",
        ],
      ],
      where: {
        courseId: {
          [Sequelize.Op.in]: [
            Sequelize.literal(`Select "id" from courses where "userId"=${id}`),
          ],
        },
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "id",
              "password",
              "is_active",
              "google",
              "createdAt",
              "updatedAt",
              "profileId",
            ],
          },
          include: {
            model: Profile,
            attributes: {
              exclude: [
                "id",
                "updatedAt",
                "createdAt",
                "userTypeId",
                "ubicationId",
                "userDetailId",
                "education",
                "phone",
                "aboutMe",
                "profession",
                "gender",
                "edad",
                "user_id_drive",
              ],
            },
          },
        },
      ],
      group: [
        Sequelize.col("enroll_course.userId"),
        Sequelize.col("user->profile.id"),
        Sequelize.col("user.id"),
      ],
    });
  } else {
    idcourse = String(idc);
    console.log(idcourse);
    students = await enroll_course.findAll({
      attributes: [
        "userId",
        [
          Sequelize.fn("array_agg", Sequelize.col("enroll_course.id")),
          "enroll_courses",
        ],
        [
          Sequelize.fn("min", Sequelize.col("enroll_course.createdAt")),
          "student_since",
        ],
      ],
      where: {
        courseId: idcourse,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "id",
              "password",
              "is_active",
              "google",
              "createdAt",
              "updatedAt",
              "profileId",
            ],
          },
          include: {
            model: Profile,
            attributes: {
              exclude: [
                "id",
                "updatedAt",
                "createdAt",
                "userTypeId",
                "ubicationId",
                "userDetailId",
                "education",
                "phone",
                "aboutMe",
                "profession",
                "gender",
                "edad",
                "user_id_drive",
              ],
            },
          },
        },
      ],
      group: [
        Sequelize.col("enroll_course.userId"),
        Sequelize.col("user->profile.id"),
        Sequelize.col("user.id"),
      ],
    });
  }

  res.json({ students });
};

const usuariosPut = async (req, res = response) => {
  try {
    let image_perfil = "";

    const { id } = req.usuario;

    const perfil = await Profile.findByPk(id);

    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.archivo
    ) {
      image_perfil = perfil.image_perfil;
    } else {
      //borrar antigua foto
      const nombreArr = perfil.image_perfil.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);

      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        width: 500,
        height: 500,
        crop: "scale",
      });
      image_perfil = secure_url;
      console.log(secure_url);
    }
    const { name, country, state, aboutMe, profession, phone, edad, gender } =
      req.body;

    await perfil.update({
      edad,
      gender,
      image_perfil,
      profession,
      aboutMe,
      phone,
    });

    const usuario = await User.findByPk(id);

    await usuario.update({ name });

    const ubication = await Ubication.findByPk(id);

    await ubication.update({ country, state });

    res.json({
      perfil,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

const usuariosPutTypes = async (req, res = response) => {
  try {
    const { userTypeId } = req.body;
    const { id } = req.usuario;
    const { idp } = req.params;
    const perfil = await Profile.findOne({
      where: { id },
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
          model: UserTypes,
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
      ],
    });

    if (perfil.userType.nametype == "administrador") {
      const updateperfil = await Profile.findOne({
        where: { id: idp },
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
            model: UserTypes,
            attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          },
        ],
      });

      await updateperfil.update({ userTypeId });

      res.json({
        updateperfil,
      });
    } else {
      return res.status(400).json({
        msg: `Usuario Denegado`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: `Hable con el administrador`,
    });
  }
};

const usuariosPutInstructor = async (req, res = response) => {
  // Fix: Se tiene que agregar promise all y transacciones
  try {
    const { id } = req.usuario;

    console.log(id);

    const perfil = await Profile.findOne({
      where: {
        id,
      },
      include: [
        {
          model: UserTypes,
          where: {
            nametype: "instructor",
          },
          attributes: [],
        },
      ],
    });

    if (!perfil) {
      throw new Error("El usuario no es instructor");
    }

    const {
      linkYT,
      linkfb,
      linkTw,
      linkIG,
      name,
      profession,
      phone,
      category,
      presentationVideo,
    } = req.body;

    let { labels } = req.body;

    if (labels) {
      labels = labels.split(",");
    } else {
      labels = null;
    }
    let image_perfil = "";

    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.archivo
    ) {
      image_perfil = perfil.image_perfil;
    } else {
      //borrar antigua foto
      const nombreArr = perfil.image_perfil.split("/");
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split(".");
      cloudinary.uploader.destroy(public_id);

      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        width: 500,
        height: 500,
        crop: "scale",
      });
      image_perfil = secure_url;
      console.log(secure_url);
    }

    await perfil.update({ image_perfil, profession, phone });

    const instructor = await UserDetails.findByPk(id);

    await instructor.update({
      linkYT,
      linkfb,
      linkTW: linkTw,
      linkIG,
      user_labels: labels,
    });

    const usuario = await User.findByPk(id);

    await usuario.update({ name });

    const requestInstructor = await Request.findOne({
      where: {
        profileId: id,
      },
    });

    await requestInstructor.update({ linkYT: presentationVideo, category });

    res.json({
      instructor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const usuariosPassword = async (req, res = response) => {
  const { password, passwordnew } = req.body;
  const { id } = req.usuario;

  const usuario = await User.findByPk(id);

  const validarPassword = bcrypts.compareSync(password, usuario.password);

  if (!validarPassword) {
    return res.json(true);
  }

  const salt = bcrypts.genSaltSync();
  const passwordnews = await bcrypts.hash(passwordnew, salt);

  await usuario.update({ password: passwordnews });

  res.json({
    msg: `Password Actualizado`,
  });
};

const usuariosGetInstructor = async (req, res = response) => {
  try {
    const { id } = req.usuario;
    const perfil = await Profile.findOne({
      where: {
        id,
      },
      attributes: ["image_perfil", "profession", "phone"],
      include: [
        {
          model: UserTypes,
          where: {
            nametype: "instructor",
          },
          attributes: [],
        },
        {
          model: UserDetails,
          attributes: ["linkYT", "linkfb", "linkTW", "linkIG", "user_labels"],
        },
        {
          model: User,
          attributes: ["name", "email"],
        },
        {
          model: Request,
          attributes: ["linkYT", "category"],
        },
      ],
    });

    if (!perfil) {
      throw new Error("El usuario no es instructor");
    }

    res.json({
      perfil,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  usuariosPost,
  usuariosGet,
  usuariosPut,
  usuariosPassword,
  usuariosAllGet,
  instructorAllGet,
  administradorAllGet,
  usuariosGetId,
  usuariosPutInstructor,
  usuariosPutTypes,
  video,
  GetAllInstructor,
  GetOneInstructor,
  getcoursysId,
  getMyStudents,
  usuariosGetInstructor,
};
