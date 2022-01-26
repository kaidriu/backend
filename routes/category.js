const {Router}=require('express');
const { PostCategory, PostSubCategory, DeleteCategory, GetSubCategory, GetCategory, PutCategory, PutSubcategory, DeleteSubCategory } = require('../controllers/category');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/category',[validarJWT,validarCampos],PostCategory);
router.post('/subcategory',[validarJWT,validarCampos],PostSubCategory);
router.delete('/deletecategory/:name_category',[validarJWT,validarCampos],DeleteCategory);
router.delete('/deletesubcategory/:name_subcategory',[validarJWT,validarCampos],DeleteSubCategory);
router.get('/getcategory/:name_category',[validarJWT,validarCampos],GetSubCategory);
router.get('/getcategories',[validarJWT,validarCampos],GetCategory);
router.put('/putcategories',[validarJWT,validarCampos],PutCategory);
router.put('/putsubcategories',[validarJWT,validarCampos],PutSubcategory);


module.exports=router;  