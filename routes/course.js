const {Router}=require('express');
const {  PostChapter, PostTopic, PostCourse, getCursosMoodle, GetCourse } = require('../controllers/course');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();



router.get('/getcurso',[validarJWT,validarCampos],getCursosMoodle);

router.post('/curso',[validarJWT,validarCampos],PostCourse);
router.post('/chapter',[validarJWT,validarCampos],PostChapter);
router.post('/topic',[validarJWT,validarCampos],PostTopic);
router.get('/curso/:title',[validarJWT,validarCampos],GetCourse);

module.exports=router;      