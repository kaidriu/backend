const {Router}=require('express');
const {  PostChapter, PostTopic, PostCourse, GetCourse, myrequtesCourse, GetCourseid, PutCourse, GetChapter, GetTopic, SendCourse, GeAllCourse, getAllCourseID, GetCourseRevision, deleteTopic, puttopic, PutChatper, deleteCourse, getMyPurchasedcourses, DeleteChapter } = require('../controllers/course');
const { PostQuizz, GetQuizz, CambioestadoQUizz, PostOptions, SeleccionarRespuesta, DeleteAnswer, DeleteQuizz, DeleteQuestion, PutTask, DeleteTask, PostTask, GetTask, PostArchive, GetArchive, Deletearchive, TimeQuizz } = require('../controllers/resourses');
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




//SOLICITUD PRUEBAS
router.post('/quizzes/:idt',[validarJWT,validarCampos],PostQuizz)
router.post('/options',[validarJWT,validarCampos],PostOptions)
router.put('/selectedoptions',[validarJWT,validarCampos],SeleccionarRespuesta)
router.delete('/deleteoption/:ido',[validarJWT,validarCampos],DeleteAnswer)
router.delete('/deletequestion/:idq',[validarJWT,validarCampos],DeleteQuestion)
router.put('/changequizzes',[validarJWT,validarCampos],CambioestadoQUizz)
router.get('/getquizzes/:idt',[validarJWT,validarCampos],GetQuizz)
router.delete('/deletequizz/:idt',[validarJWT,validarCampos],DeleteQuizz)
router.put('/puttimequizz',[validarJWT,validarCampos],TimeQuizz)



//SOLICITUD TAREAS

router.post('/posttask',[validarJWT,validarCampos],PostTask)
router.get('/gettask/:idt',[validarJWT,validarCampos],GetTask)
router.put('/puttask',[validarJWT,validarCampos],PutTask)
router.delete('/deletetask/:idt',[validarJWT,validarCampos],DeleteTask)



// SOLICITUD ARCHIVO

router.post('/postarchivo',[validarJWT,validarCampos],PostArchive)
router.get('/getarchivo/:idt',[validarJWT,validarCampos],GetArchive)
router.delete('/deletearchivo/:ida',[validarJWT,validarCampos],Deletearchive)







module.exports=router;      