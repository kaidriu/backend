const {Router}=require('express');
const { PostQuestion, PutQuestion, DeleteQuestion, GetQuestion } = require('../controllers/course');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.get('/get/:idc', GetQuestion);
router.post('/:idc',[validarJWT,validarCampos],PostQuestion);
router.put('/put/:idq',[validarJWT,validarCampos],PutQuestion);
router.delete('/delete/:idq',[validarJWT,validarCampos],DeleteQuestion);

module.exports=router;  