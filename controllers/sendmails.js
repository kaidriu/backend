const { response } = require("express")

const nodemailer = require('nodemailer')



const recoverPassword = async(req,res=response)=>{


    const {email} = req.params;

    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: 587,
        tls: {
            ciphers:'SSLv3'
         },
        auth: {
            user: 'supermixpc@outlook.com',
            pass: 'Solsito2528*'
        }
    });

    let mailOptions ={
        from:"supermixpc@outlook.com",
        to:email,
        subject:"Cambio de contraseña",
        text:"https://www.facebook.com"
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            res.status(500).send(error.message);
        }else{
            res.json({msg:"Mensjae Enviado a : " + email})
        }
    })



}

module.exports={
    recoverPassword
}