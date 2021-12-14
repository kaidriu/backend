const express = require('express');
const cors = require('cors');

const db = require("../database/db");


const { createServer } = require('http');




class Server{


    constructor(){

        this.app = express();
        this.port= process.env.PORT;

        this.server = createServer( this.app );

        this.paths={
            auth         : '/api/auth',
            usuario      : '/api/usuarios',
            sendemail    : '/api/send'
        }


        //middlewares
        this.middlewares();


        //bd
        this.bd();

        //routes
        this.routes();


        //socket

     
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



    }

 
    routes(){
        
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.usuario,require('../routes/usuarios'));
        this.app.use(this.paths.sendemail,require('../routes/sendMail'));

    }


    bd(){
        db.sequelize.sync();
        db.sequelize.sync({ force: true }).then(() => {
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