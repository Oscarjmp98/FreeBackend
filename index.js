const express = require('express');
const fileUpload = require('express-fileupload');
const connectDB = require('./db/mongo');

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')
const {urlencoded, json} = require('express');
const router = require('./routes/signos.routes.js');
const cors = require('cors');
const multer = require('multer');


const dotenv = require('dotenv');

const port = process.env.PORT;
connectDB();
// connectAWS();
const app = express();
dotenv.config();
app.use(express.json())



 

app.use(urlencoded({extended: true}))


app.use(cors())
app.use('/v1/signos', router);



app.listen(port, ()=>{
    console.log('listening at port 4000');
})