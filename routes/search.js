const {Router}=require('express');
const { busquedaT } = require('../controllers/search');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.get('/:busqueda',[validarJWT,validarCampos],busquedaT)

module.exports=router;  