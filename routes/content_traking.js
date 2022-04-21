const {Router}=require('express');
const { PostTracking, GetEnroll, AggTask, GetTaskStudent, DeleteTaskStudent, GetTrackingEnroll } = require('../controllers/content_tranking');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/postcontent',[validarJWT,validarCampos],PostTracking);
router.get('/getenroll/:idC',[validarJWT,validarCampos],GetEnroll);
router.post('/aggtaskstuden',[validarJWT,validarCampos],AggTask);
router.get('/gettaskstuden/:idC/:idT',[validarJWT,validarCampos],GetTaskStudent);
router.delete('/deletetaskstuden/:idC/:idT',[validarJWT,validarCampos],DeleteTaskStudent);


router.get('/getTrackingCheck/:idC',[validarJWT,validarCampos],GetTrackingEnroll);


    
module.exports=router;  