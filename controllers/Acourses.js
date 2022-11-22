const { response } = require("express");

const db = require("../database/db");
const { Op, QueryTypes} = require("sequelize");
const { sequelize } = require("../database/db");
const { uploadPackageImage, generatePublicUrl, deleteFile, getIdFromUrl } = require('../helpers/drive');
const course = require("../models/course");

const User = db.user;
const errOpNotCompleted = "Servidor: No se pudo completar la operación. ";

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
const packagesOrdersDetails = db.detail_package_order;


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
  
  const {category, subcategory, packageId} = req.query;

  let filterCategory = category ? { id: category } : {};

  let filterSubcategory = subcategory ? { id: subcategory } : {};

  let filterCourses = { 
    state: { [Op.not]: ["revisión","proceso"]},
  }

  if (packageId) {
    const coursePackage = await Curso.findAll({
      attributes: [
        "id",
      ],
      include: {
        model: packages,
        as: 'PackageToCourse',
        attributes: [],
        where: {
          id: packageId
        },
        required: true
      }
    });

    const idCoursePackage = coursePackage.map( course => course.id);

    filterCourses.id = { [Op.notIn] : idCoursePackage }

  }

  const cursos = await Curso.findAll({
    order: [["id", "DESC"]],
    where: filterCourses,
    include: [
      {
        model: User,
      },
      {
        model: Subcategory,
        where: filterSubcategory,
        include: {
          model: Category,
          where: filterCategory
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

  const t = await sequelize.transaction();

  try {  
    const { idc } = req.params;

    let actions = []; 

    const state = 'publicado';

    actions.push(
      Curso.findOne({
        where: { id: idc },
      },{ transaction: t}).then((curso)=>{
        curso.update({ state })
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
    );
  
    await Promise.all(actions);

    await t.commit();

    res.status(200).json({state});
    
  } catch (err) {

    console.log(err.message);

    await t.rollback();
    
    res.status(500).json({error: err.message})
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
        exclude:["updatedAt"]
      },
      order: [["createdAt", "DESC"]],
    });

  res.json({Packages});
}

const getCoursesPackages = async (req, res=response) => {
  
  const { idP } = req.params;
  
  const cursos = await Curso.findAll({
    attributes: [
      "title",
      "createdAt",
      "id",
      "image_course",
      "price"
    ],
    include: {
      model: packages,
      as: 'PackageToCourse',
      attributes: [],
      where: {
        id: idP
      },
      required: true
    }
  });
  
  res.json({cursos});
}

const postPackages = async (req, res=response) => {
  try {
      const { cant_course, title_package, price_package, state='pendiente', percents_package=0} = req.body;
      
      if(cant_course >= 2){
        let Packages = new packages({
          cant_course,
          price_package,
          title_package,
          percents_package,
          state
        });

        if (req.files) {
          const { archivo } = req.files;
          const { tempFilePath } = archivo;

          await uploadPackageImage(tempFilePath, archivo.name, archivo.mimetype).then(async (resp) => {
            await generatePublicUrl(resp).then(async (fileURLs) => {
              Packages.image_url = fileURLs.webContentLink;
            })
          });          
        }
        
        await Packages.save();
        res.status(200).json({Packages});
      }else{
        res.status(400).send("La cantidad de cursos por paquete no puede ser menor a 2");
      }
  } catch (error) {
    res.status(500).json({
      msg: errOpNotCompleted + error
    });
  }
  
}

const putPackages = async (req, res=response) => {
  try {
      const { id, cant_course, title_package, state, price_package, coursesIds, percents_package=0} = req.body;


      const Packages = await packages.findByPk(id);

      if (coursesIds) {

        let IdsCourses = JSON.parse(coursesIds)

        const courses = await Curso.findAll({ where: { id: { [Op.in]: IdsCourses } } });
        
        await Packages.setCourseToPackage(courses);
      }

      if (req.files) {

        const { archivo } = req.files;
        const { tempFilePath } = archivo;

        if(Packages.image_url){
          await deleteFile( getIdFromUrl(Packages.image_url) );
        }

        await uploadPackageImage(tempFilePath, archivo.name, archivo.mimetype).then(async (resp) => {
          await generatePublicUrl(resp).then(async (fileURLs) => {
            await Packages.update({image_url: fileURLs.webContentLink});
          })
        });          
      }

      await Packages.update({
          cant_course,
          title_package,
          price_package,
          percents_package,
          state
      });

      res.json({Packages});        
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: errOpNotCompleted, error
    });
  }
}

const deletePackage = async (req, res=response) => {
  try {

      const { idP } = req.params;

      const orders = await packagesOrdersDetails.count({
        where: {
          packageCourseId: idP
        }
      });

      if (orders > 0) {
        throw new Error('Este paquete ya tiene ventas registradas');
      }

      const Packages = await packages.findByPk(idP);

      if(Packages.image_url){
        await deleteFile( getIdFromUrl(Packages.image_url) );
      }

      await Packages.destroy();

      res.json({Packages});

  } catch (error) {
    res.status(400).json({
      msg: errOpNotCompleted, error
    });
  }
}



//CATEGORÍAS

const getCategory = async (req, res = response) => {
  try {
    const { id } = req.query;

    let where;
    
    if(id){
      where = { id }
    }

    const category = await Category.findAll({
      where: where
    });

    res.json({category});
     
  } catch (error) {
    res.status(400).json({
      msg: errOpNotCompleted, error
    });
  }
}

const getSubCategory = async (req, res = response) => {
  try {
    const { id } = req.query;
    let where;
    
    if(id){
      where = { categoryId: id }
    }

    const subcategory = await Subcategory.findAll({
      where: where
    });

    res.json({subcategory});
    
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: errOpNotCompleted, error
    });
  }
}


const PostCategory = async (req, res = response) => {

  try {
    const { name_category } = req.body;

    const category = new Category({ name_category });

    await category.save();

    res.json({
      category
  });


  } catch (error) {

    res.status(500).json({
      msg: errOpNotCompleted, 
      error
    });
  
  }
  

  
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
          msg: errOpNotCompleted,
          error
      })

  }
}

const PutCategory = async (req, res = response) => {

  try {
    
    const { id_category, new_name_category } = req.body;

    const category = await Category.findByPk(id_category);
  
    await category.update({ name_category: new_name_category });
  
    res.json({
        category
    })     
  } catch (error) {
    res.status(500).json({
      msg: errOpNotCompleted,
      error
    });
  }
}

const putCoursesPackages = async (req, res = response) => {

  try {
    
    const { id_category, new_name_category } = req.body;

    const category = await Category.findByPk(id_category);
  
    await category.update({ name_category: new_name_category });
  
    res.json({
        category
    })     
  } catch (error) {
    res.status(500).json({
      msg: errOpNotCompleted,
      error
    });
  }
}

const PostSubCategory = async (req, res = response) => {

  try {

    const { id_category, name_subcategory } = req.body;

    const category = await Category.findByPk(id_category);

    if (!category) {
      res.status(400).json({
        msg: "No existe esa categoria"
      });
    } else {

      const subcategory = new Subcategory({ name_subcategory, categoryId: id_category });

      await subcategory.save();

      res.status(200).json({
        subcategory
      });
    }
    
  } catch (error) {
    res.status(500).json({
      msg: errOpNotCompleted,
      error
    });
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
          msg: errOpNotCompleted,
          error
      })

  }
}

const PutSubcategory = async (req, res = response) => {

  const { id_subcategory, new_name_subcategory } = req.body;

  const subcategory = await Subcategory.findByPk(id_subcategory);

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
  deletePackage,
  aceptarSolicitudCurso, 
  denegarSolicitudCurso,
  getCategory,
  getSubCategory,
  PostCategory,
  PostSubCategory,
  DeleteCategory,
  DeleteSubCategory,
  PutCategory,
  PutSubcategory,
  putPackages,
  getCoursesPackages,
  putCoursesPackages
};
