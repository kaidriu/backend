const {Router}=require('express');
const { PostTracking, GetEnroll, AggTask, GetTaskStudent, DeleteTaskStudent, GetTrackingEnroll, PutState, getalltask, SaveTest, getTest, qualificationTest, getStudentsWithCalifications, getContentTrackingStudent} = require('../controllers/content_tranking');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/postcontent',[validarJWT,validarCampos],PostTracking);
router.get('/getenroll/:idC',[validarJWT,validarCampos],GetEnroll);
router.post('/aggtaskstuden',[validarJWT,validarCampos],AggTask);
router.get('/gettaskstuden/:idC/:idT',[validarJWT,validarCampos],GetTaskStudent);
router.delete('/deletetaskstuden/:idC/:idT',[validarJWT,validarCampos],DeleteTaskStudent);


router.get('/getTrackingCheck/:idC',[validarJWT,validarCampos],GetTrackingEnroll);

router.get('/getTrackingStudentsOfCourse/:idC',[validarJWT,validarCampos],getStudentsWithCalifications);


router.get('/getContentTracking/:idE/:idC',[validarJWT,validarCampos], getContentTrackingStudent);


router.get('/getalltask/:idC',[validarJWT,validarCampos],getalltask);


router.put('/putstate',[validarJWT,validarCampos],PutState)


router.put('/saveTest/:idt',[validarJWT,validarCampos],SaveTest)
router.put('/qualificationtest/:idt',[validarJWT,validarCampos],qualificationTest)

router.get('/gettask/:idu/:idt/:idC',[validarJWT,validarCampos],getTest)


        
module.exports=router;  