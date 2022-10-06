const {Router}=require('express');
const { GetSubCategory, GetCategory, getCategoryAndSubcategory } = require('../controllers/category');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.get('/getcategory/:name_category',[validarJWT,validarCampos],GetSubCategory);
router.get('/getcategories',GetCategory);
router.get('/getcategoriesandsubcategories',getCategoryAndSubcategory);

    
module.exports=router;  