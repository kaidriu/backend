const {Router} = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const { typesPost, getRoles, postCountry } = require('../controllers/types');


const router = Router();


router.post('/',typesPost);
router.get('/types',[validarJWT,validarCampos],getRoles);

router.post('/country',postCountry);

module.exports=router;  