const { response } = require('express');
const db = require('../database/db')
const { Op } = require("sequelize");
 
const notification = db.notification;
const notificationType = db.notification_type;

let userNotify = [];
let adminNotify = [];


const usersNotification = async (req, res = response) => {
    console.log('client connected');
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      };
    res.writeHead(200, headers);



    res.on('close', ()=>{
        console.log('Client closed connection');
        res.end();
    })
}

const adminNotification = async (req, res = response) => {
    
}

const postUsersNotification = async (req, res = response) => {

}

const postAdminNotification = async (req, res = response) => {

}

module.exports = {
    usersNotification,
    adminNotification
}