const express = require('express');
const cors = require('cors');

const db = require("../database/db");

const fileUpload = require('express-fileupload');

const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController , conectarUsuario } = require('../sockets/controller');


class Server{


    constructor(){

        this.app = express();
        this.port= process.env.PORT;


        this.server = createServer( this.app );
        this.io     = require('socket.io')(this.server,{
            cors: {
                origin: '*',
                allowedHeaders: ["x-token"],
                credentials: true
              }
        })

        this.paths={
            usuarios     : '/api/usuarios',
            profile      : '/api/profile',
            auth         : '/api/auth',
            publication  : '/api/publication',
            uploads      : '/api/uploads',
            mensajes     : '/api/mensajes',
            comment      : '/api/comment',
            friend       : '/api/friend',
            history      : '/api/history',
            sendEmail    : '/api/send',
            reaction     : '/api/reaction'
        }


        //middlewares
        this.middlewares();


        //bd
        this.bd();

        //routes
        this.routes();


        //socket

        this.socket();
     
    }

    socket(){
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    }
    

    
    static get instance() {
        return this._intance || (this._intance = new this());
    }


    middlewares(){

        //CORS
        // this.app.use(cors({ origin: true, credentials: true  }));
        this.app.use(cors());

        // Parseo y Lectura del body
        this.app.use(express.json());


        //directorio publico
        this.app.use(express.static('public'));


        // cargar archivos

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));


    }

 
    routes(){
        
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
        this.app.use(this.paths.publication,require('../routes/publication'));
        this.app.use(this.paths.uploads,require('../routes/uploads'));
        this.app.use(this.paths.mensajes,require('../routes/mensajes'));
        this.app.use(this.paths.comment,require('../routes/comments'));
        this.app.use(this.paths.friend,require('../routes/friends'));
        this.app.use(this.paths.history,require('../routes/history'));
        this.app.use(this.paths.profile,require('../routes/profile'));
        this.app.use(this.paths.sendEmail,require('../routes/sendMail'));
        this.app.use(this.paths.reaction,require('../routes/reaction'));
        

    }


    bd(){
        db.sequelize.sync();
        db.sequelize.sync({ force: false }).then(() => {
        console.log("Elimina y reinicia la db.");
        });
    }


    listen(){
        
        this.server.listen(this.port,()=>{
            console.log('puerto en lanzado en ', this.port);
        });

    }

}


module.exports=Server;