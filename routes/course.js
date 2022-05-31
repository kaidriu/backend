const {Router}=require('express');
const {  PostChapter,getCoursesByInstructorId, PostTopic, PostCourse, GetCourse, myrequtesCourse, GetCourseid, PutCourse, GetChapter, GetTopic, SendCourse, GeAllCourse, getAllCourseID, GetCourseRevision, deleteTopic, puttopic, PutChatper, deleteCourse, getMyPurchasedcourses, DeleteChapter, Getenroll_course, getThisEnrollCourses, myCourseswithTasks, myCourseswithQuizz, myCourseswithCountStudents } = require('../controllers/course');
const { PostQuizz, GetQuizz, CambioestadoQUizz, PostOptions, SeleccionarRespuesta, DeleteAnswer, DeleteQuizz, DeleteQuestion, PutTask, DeleteTask, PostTask, GetTask, PostArchive, GetArchive, Deletearchive, TimeQuizz, GetAllTask, GetHomeTask, PutHomeTask, GetAllQuizz, GetAllArchives, Putquestionquizz, PutQuizz } = require('../controllers/resourses');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


// SOLICITUDES CURSOS

router.post('/curso',[validarJWT,validarCampos],PostCourse);
router.put('/putcurso/:idc',[validarJWT,validarCampos],PutCourse);
router.put('/sendcurso',[validarJWT,validarCampos],SendCourse);
router.get('/curso/:title',[validarJWT,validarCampos],GetCourse);
router.get('/allcursos',GeAllCourse);
router.get('/getthisenrollcourses',[validarJWT,validarCampos],getThisEnrollCourses);
router.get('/mycurso/:id',[validarJWT,validarCampos],GetCourseid);
router.get('/myallcourse/:id',getAllCourseID);
router.get('/getcoursesbyinstructor/:id',getCoursesByInstructorId);

router.get('/getrevisioncurso',[validarJWT,validarCampos],GetCourseRevision);
router.get('/getmerequets',[validarJWT,validarCampos],myrequtesCourse);

router.get('/getmycourseswithcounttasks',[validarJWT,validarCampos],myCourseswithTasks);
router.get('/getmycourseswithcountquizz',[validarJWT,validarCampos],myCourseswithQuizz);
router.get('/getmycourseswithcountstudents',[validarJWT,validarCampos],myCourseswithCountStudents);



router.delete('/deletecourse/:idc',deleteCourse);


router.get('/mypurchasedcourses',[validarJWT,validarCampos],getMyPurchasedcourses)
    


router.get('/Getenroll_course/:idc',[validarJWT,validarCampos],Getenroll_course)





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
router.post('/postquizz',[validarJWT,validarCampos],TimeQuizz)
router.put('/putquizz',[validarJWT,validarCampos],PutQuizz)

router.post('/postquestion/:idt',[validarJWT,validarCampos],PostQuizz)

router.post('/options',[validarJWT,validarCampos],PostOptions)
router.put('/selectedoptions',[validarJWT,validarCampos],SeleccionarRespuesta)
router.delete('/deleteoption/:ido',[validarJWT,validarCampos],DeleteAnswer)
router.delete('/deletequestion/:idq',[validarJWT,validarCampos],DeleteQuestion)
router.put('/changequizzes',[validarJWT,validarCampos],CambioestadoQUizz)
router.get('/getquizzes/:idt',[validarJWT,validarCampos],GetQuizz)
router.delete('/deletequizz/:idt',[validarJWT,validarCampos],DeleteQuizz)
router.put('/putquestion',[validarJWT,validarCampos],Putquestionquizz)


//SOLICITUD TAREAS

router.post('/posttask',[validarJWT,validarCampos],PostTask)
router.get('/gettask/:idt',[validarJWT,validarCampos],GetTask)
router.put('/puttask',[validarJWT,validarCampos],PutTask)
router.delete('/deletetask/:idt',[validarJWT,validarCampos],DeleteTask)
router.get('/getalltask/:idC',[validarJWT,validarCampos],GetAllTask)
router.get('/getallquiz/:idC',[validarJWT,validarCampos],GetAllQuizz)
router.get('/getallarchives/:idC',[validarJWT,validarCampos],GetAllArchives)


router.get('/gethometask/:idC/:idT',[validarJWT,validarCampos],GetHomeTask)
router.put('/puthometask/:idH',[validarJWT,validarCampos],PutHomeTask)



// SOLICITUD ARCHIVO

router.post('/postarchivo',[validarJWT,validarCampos],PostArchive)
router.get('/getarchivo/:idt',[validarJWT,validarCampos],GetArchive)
router.delete('/deletearchivo/:ida',[validarJWT,validarCampos],Deletearchive)







module.exports=router;      