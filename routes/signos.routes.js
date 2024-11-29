const express = require('express');
const router = express.Router();
const signoController = require('./controllers/signoController.js');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router
   
    .post('/registro', signoController.registroCredenciales)
    .post('/login',signoController.validarCredenciales)
    .post('/registroadmin',signoController.registarAdmin)
    .post('/upload/:iduser', upload.single('video'), signoController.Subirvideo)
    .get('/videos/:iduser',signoController.videos)
    

module.exports = router;