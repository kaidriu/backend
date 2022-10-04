const { response } = require("express");

const db = require("../database/db");
const { Op, QueryTypes} = require("sequelize");
const { sequelize } = require("../database/db");

const User = db.user;
const errOpNotCompleted = "Servidor: No se pudo completar la operación. Error: ";

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

//SOLICITUDES

const aceptarSolicitudCurso = async (req, res = response) => {

  const { idc } = req.params;
  const t = await sequelize.transaction();

  try {  
    
    let actions = []; 

    actions.push(
      Curso.findOne({
        where: { id: idc },
      }).then((curso)=>{
        curso.update({ state: 'publicado' },{ transaction: t})
      })
    );

    
    actions.push(
        sequelize.query(
          'UPDATE "topics" SET "topicIsEditable" = false FROM "chapters" WHERE "chapters"."courseId" = ? AND "topics"."chapterId" = "chapters"."id"',
          {
            replacements:[idc],
            type: QueryTypes.UPDATE,
            transaction: t
          }
        )
    )
    
  
    await Promise.all(actions);

    await t.commit();

    res.status(200).send({state});
    
  } catch (err) {
    await t.rollback();
    console.log(err.message);
    res.status(500).send({error: err.message})
  }

}

const denegarSolicitudCurso = async (req, res = response) => {

  const { idc } = req.params;

  const Course = await Curso.findOne({
    where: { id: idc },
  }).then((curso)=>{
    curso.update({ state: 'proceso' })
  });

  res.json({ Course }) 

}

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

//OBSERVACIONES

const sendRemark = async (req, res = response) => {
  const { idc, remarks } = req.body;
  
  const curso = await Curso.findByPk(idc);

  curso.update({ remark: remarks });
  res.json("Cambios guardados");
};

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

//CATEGORÍAS

const PostCategory = async (req, res = response) => {
  const { name_category } = req.body;
  const category = new Category({ name_category });

  await category.save();

  res.json({
      category
  })

}

const DeleteCategory = async (req, res = response) => {
  try {
      const { idc } = req.params;
      let subcategoriesIds = [];

      const subcategories = await Subcategory.findAll({
        attributes:['id'],
        where: { 
          categoryId: idc 
        }
      });

      subcategories.forEach(element => {
        subcategoriesIds.push(element.id);
      });

      const uses =  await Curso.count({
        where: {
          subcategoryId: {
            [Op.in]: subcategoriesIds
          },
        }
      });

      if(uses > 0){
        res.status(400).json({ msg: 'No es posible eliminar la categoría. La categoría o sus subcategorías están siendo usadas por uno o varios cursos'});
      }else{
        
        const category = await Category.findByPk(idc);
        
        await category.destroy();

        res.status(200).json({ category });
      }

  } catch (error) {
      res.status(500).json({
          msg: errOpNotCompleted + error
      })

  }
}

const PutCategory = async (req, res = response) => {

  const { name_category, new_name_category } = req.body;

  const category = await Category.findOne({
      where: { name_category }
  });

  await category.update({ name_category: new_name_category });

  res.json({
      category
  })
}

const PostSubCategory = async (req, res = response) => {

  const { name_category, name_subcategory } = req.body;

  const category = await Category.findOne({
      where: { name_category }
  });

  if (!category) {
      res.json({
          msg: "No existe esa categoria"
      })

  } else {
      const categoryId = category.id;

      const subcategory = new Subcategory({ name_subcategory, categoryId });

      await subcategory.save();

      res.json({
          subcategory
      })
  }
}

const DeleteSubCategory = async (req, res = response) => {
  try {
      const { ids } = req.params;

      const uses =  await Curso.count({
        where: {
          subcategoryId: ids,
        }
      });

      if(uses > 0){
        res.status(400).json({ msg: 'No es posible eliminar la subcategoría. La subcategoría está siendo usada por uno o varios cursos'});
      }else{
        
        const subcategory = await Subcategory.findByPk(ids);
        
        await subcategory.destroy();

        res.status(200).json({ subcategory });
      }

  } catch (error) {
      res.status(500).json({
          msg: errOpNotCompleted + error
      })

  }
}

const PutSubcategory = async (req, res = response) => {

  const { name_subcategory, new_name_subcategory } = req.body;

  const subcategory = await Subcategory.findOne({
      where: { name_subcategory }
  });

  await subcategory.update({ name_subcategory: new_name_subcategory });

  res.json({
      subcategory
  })
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
  PostCategory,
  PostSubCategory,
  DeleteCategory,
  DeleteSubCategory,
  PutCategory,
  PutSubcategory,
};
