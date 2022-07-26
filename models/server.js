const express = require('express');
const cors = require('cors');

const db = require("../database/db");


const fileUpload = require('express-fileupload');

const { createServer } = require('http');
const { socketController } = require('../sockets/controller');


class Server {


    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.server = createServer(this.app);


        this.io     = require('socket.io')(this.server,{
            cors: {
                origin: '*',
                allowedHeaders: ["my-custom-header"],
                credentials: true
              }
        })

        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuarios',
            sendemail: '/api/send',
            type: '/api/type',
            Request: '/api/request',
            curso: '/api/curso',
            admin: '/api/admin',
            category: '/api/category',
            payments: '/api/payments',
            questions: '/api/questions',
            messages: '/api/messages',
            tracking: '/api/tracking',
            enrollCourse: '/api/enrollcourse',
            instPaymentHistory: '/api/inspaymenthistory'
        }


        //middlewares
        this.middlewares();


        //bd
        this.bd();

        //routes
        this.routes();


    this.socket();
    }

    socket(){
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
    }

    static get instance() {
        return this._intance || (this._intance = new this());
    }


    middlewares() {

        //CORS
        this.app.use(cors());
        // this.app.use(cors());

        // Parseo y Lectura del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));


    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuario, require('../routes/usuarios'));
        this.app.use(this.paths.sendemail, require('../routes/sendMail'));
        this.app.use(this.paths.type, require('../routes/types'));
        this.app.use(this.paths.Request, require('../routes/request'));
        this.app.use(this.paths.curso, require('../routes/course'));
        this.app.use(this.paths.admin, require('../routes/admin'));
        this.app.use(this.paths.category, require('../routes/category'));
        this.app.use(this.paths.payments, require('../routes/payments'));
        this.app.use(this.paths.questions, require('../routes/questions'));
        this.app.use(this.paths.messages, require('../routes/messages'));
        this.app.use(this.paths.tracking, require('../routes/content_traking'));
        this.app.use(this.paths.enrollCourse, require('../routes/enroll_courses'));
        this.app.use(this.paths.instPaymentHistory, require('../routes/inst_history_payment'));
    }


    bd() {
        // db.sequelize.sync();
        //  db.sequelize.sync({ alter: true }).then(() => {
        //  });
    }


    listen() {
        this.server.listen(this.port, () => {
            console.log('puerto en lanzado en ', this.port);
        });
    }

}


module.exports = Server;