const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');
const routeruser = require('./routes/login');
const routervote = require('./routes/vote');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/user',routeruser);
app.use('/candidate',routervote);
const port = process.env.port;
app.listen(port,()=>{
    console.log('Server is live now');
})