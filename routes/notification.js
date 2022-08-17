const {Router}=require('express');
const router = Router();
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const { usersNotification, adminNotification } = require('../controllers/notification');


router.get('/users', usersNotification);
router.get('/admin', adminNotification);

router.post('/users', usersNotification);
router.post('/admin', adminNotification);



 

module.exports=router;  