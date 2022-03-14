const {Router}=require('express');
const {  PostChapter, PostTopic, PostCourse, GetCourse, myrequtesCourse, GetCourseid, PutCourse, GetChapter, GetTopic, SendCourse, GeAllCourse, getAllCourseID, GetCourseRevision, deleteTopic, puttopic, PutChatper, deleteCourse, getMyPurchasedcourses, PostTask, DeleteChapter } = require('../controllers/course');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


// SOLICITUDES CURSOS

router.post('/curso',[validarJWT,validarCampos],PostCourse);
router.put('/putcurso/:idc',[validarJWT,validarCampos],PutCourse);
router.put('/sendcurso',[validarJWT,validarCampos],SendCourse);
router.get('/curso/:title',[validarJWT,validarCampos],GetCourse);
router.get('/allcursos',GeAllCourse);
router.get('/mycurso/:id',[validarJWT,validarCampos],GetCourseid);
router.get('/myallcourse/:id',getAllCourseID);

router.get('/getrevisioncurso',[validarJWT,validarCampos],GetCourseRevision);
router.get('/getmerequets',[validarJWT,validarCampos],myrequtesCourse);


router.delete('/deletecourse/:idc',deleteCourse);


router.get('/mypurchasedcourses',[validarJWT,validarCampos],getMyPurchasedcourses)

// SOLICITUDES CAPITULOS

router.post('/chapter',[validarJWT,validarCampos],PostChapter);
router.get  ('/getchapter/:id',GetChapter);
router.put('/putchapter/:idch',PutChatper)
router.delete('/deleteChapter/:idch',DeleteChapter);


// SOLICITUDES TEMAS

router.post('/topic',[validarJWT,validarCampos],PostTopic);
router.get  ('/gettopic/:id',GetTopic);
router.delete('/deletetopic/:idt',deleteTopic);
router.put('/puttopic/:idz',puttopic);




// SOLICITUDES TAREAS

router.post('/task',[validarJWT,validarCampos],PostTask)

















module.exports=router;      