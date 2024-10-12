const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.local_url);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Database is connected');
})
db.on('disconnected',()=>{
    console.log('Database is disconnected');
})
db.on('error',()=>{
    console.log('we face error');
})

module.exports = db;