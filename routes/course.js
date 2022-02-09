const {Router}=require('express');
const {  PostChapter, PostTopic, PostCourse, getCursosMoodle, GetCourse, myrequtesCourse, GetCourseid, PutCourse } = require('../controllers/course');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();



router.get('/getcurso',[validarJWT,validarCampos],getCursosMoodle);

router.post('/curso',[validarJWT,validarCampos],PostCourse);
router.put('/putcurso/:idc',[validarJWT,validarCampos],PutCourse);


router.post('/chapter',[validarJWT,validarCampos],PostChapter);
router.post('/topic',[validarJWT,validarCampos],PostTopic);

router.get('/curso/:title',[validarJWT,validarCampos],GetCourse);

router.get('/mycurso/:id',[validarJWT,validarCampos],GetCourseid);

router.get('/getmerequets',[validarJWT,validarCampos],myrequtesCourse);




module.exports=router;      