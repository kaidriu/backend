const { Socket } = require('socket.io');
const { grabarMensaje } = require('../controllers/messages');
const { comprobarJWT, comprobarJWTSocket } = require('../helpers/generarJWT');
// const { validarJWT } = require('../middlewares/validar-JWT');
// const { ChatMensajes } = require('../models');

// const chatMensajes = new ChatMensajes();



// const db = require('../database/db');
// const { comprobarJWT } = require('../helpers');
// const { validarJWT } = require('../middlewares/validar-JWT');



// const  ChatMensajes = require('../models/chat-mensajes');

// const chatMensajes= new ChatMensajes() ;


const socketController = async (socket = new Socket(), io) => {


    console.log('usuario conectado');


    socket.on('disconnect', () => {

        console.log('desconectado');
    })

    // console.log(socket.handshake.headers);
    // console.log(socket.handshake.headers['my-custom-header']);
    // console.log(socket.handshake.query);
    console.log(socket.handshake.query['my-custom-header']);

    const [validar,uid] = comprobarJWTSocket(socket.handshake.query['my-custom-header'])


    if ( !validar ) { return socket.disconnect(); }

    console.log(uid);
    
    socket.join(uid);

    socket.on('mensaje', async (payload) => {
        console.log( payload);
        const {message,toId} = payload;
        // await grabarMensaje(message,uid,toId );
        io.emit('mensaje-nuevo', payload);
        // io.to( 1 ).emit('mensaje-nuevo', 'sexooooooo' );
    });


    // const usuario = await comprobarJWT(socket.handshake.query['token']);
    //     console.log('este');
    // console.log(usuario);

    //     if ( !usuario ) {    
    //         console.log('desconectado');
    //         return socket.disconnect();
    //     }

    // // console.log(socket.handshake);

    //     chatMensajes.conectarUsuario(usuario);

    //     io.emit('usuarios-activos',chatMensajes.usuariosArr);

    // //     socket.join(usuario.id);


    // socket.on('disconnect', () => {

    //     console.log('desconectado');
    //     chatMensajes.desconectarUsuario(usuario.id);
    //     io.emit('usuarios-activos',chatMensajes.usuariosArr);
    //     // chatMensajes.desconectarUsuario( usuario.id );
    //     // io.emit('usuarios-activos', chatMensajes.usuariosArr );
    // })

    // socket.on('mensaje',(payload)=>{
    //     console.log(payload);
    //     // if(uid){

    //     const{uid,cuerpo,de} = payload;

    //         socket.to(uid).emit('mensaje-privado',{cuerpo,de})
    //     //     console.log( `Mensaje enviado de ${usuario.name} al usuario con el id: ${uid} diciendo : ${mensaje}`);

    //     //     console.log(io.to(uid).emit('mensaje-privado',{de:usuario.name , mensaje}));

    //     // }else{
    //         // chatMensajes.enviarMensaje(usuario.id,usuario.name,mensaje);
    //         io.emit('mensaje-nuevo', payload);
    //     // }    
    // })





}



module.exports = {
    socketController

}