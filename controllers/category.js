const { response } = require('express');

const db = require('../database/db')

const { Op } = require("sequelize");

const Category = db.category;
const Subcategory = db.subcategory;


const PostCategory = async(req,res=response)=>{
        const  {name_category} =req.body;
        const category = new Category({name_category});

        await category.save();

        res.json({
            category
        })

}


const DeleteCategory = async(req,res=response)=>{

        const  {name_category} =req.params;
    
        const category = await Category.findOne({
                where: {name_category}  
            });

        await category.destroy();

        res.json({
            name_category
        })
}    


const PutCategory = async(req,res=response)=>{

    const  {name_category,new_name_category} =req.body;

    const category = await Category.findOne({
            where: {name_category}  
        });

    await category.update({name_category:new_name_category});

    res.json({
        category
    })
}    

const PutSubcategory = async(req,res=response)=>{

    const  {name_subcategory,new_name_subcategory} =req.body;

    const subcategory = await Subcategory.findOne({
            where: {name_subcategory}  
        });

    await subcategory.update({name_subcategory:new_name_subcategory});

    res.json({
        subcategory
    })
}    


const GetSubCategory = async(req,res=response)=>{

    const  {name_category} =req.params;

    const category = await Category.findOne({
        where: {name_category}  
    });

    const subcategory = await Subcategory.findAll({
        where: {categoryId : category.id}  ,
        attributes: {exclude: ['categoryId','createdAt','updatedAt'] },
    });

    res.json({
        subcategory
    })
}


const GetCategory = async(req,res=response)=>{

    const category = await Category.findAll(
       { attributes: {exclude: ['createdAt','updatedAt'] }}
    );

    res.json(
        category
    )
}

const PostSubCategory = async(req,res=response)=>{

    const  {name_category,name_subcategory} =req.body;
    
    const category = await Category.findOne({
            where: {name_category}  
        });

    if(!category){
        res.json({
            msg:"No existe esa categoria"
        })

    }else{
        const categoryId = category.id;

        const subcategory = new Subcategory({name_subcategory,categoryId});
    
        await subcategory.save();
    
        res.json({
            subcategory
        })
    }
}


const DeleteSubCategory = async(req,res=response)=>{

    const  {name_subcategory} =req.params;

    const subcategory = await Subcategory.findOne({
            where: {name_subcategory}  
        });

    await subcategory.destroy();

    res.json({
        subcategory
    })
} 



module.exports={
    PostCategory,
    PostSubCategory,
    DeleteCategory,
    DeleteSubCategory,
    GetSubCategory,
    GetCategory,
    PutCategory,
    PutSubcategory
}