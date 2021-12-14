const {Router}=require('express');
const { recoverPassword } = require('../controllers/sendmails');

const router = Router();



router.post('/recuperar/:email',recoverPassword);


module.exports=router;