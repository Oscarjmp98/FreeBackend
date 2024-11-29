const express = require('express');
const router = express.Router();
const signoController = require('./controllers/signoController.js');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router
    // .get('/', signoController.getAllSignos)
    // .get('/:categoriaU/:signoU', signoController.getOneSigno)

    .post('/codigo', signoController.registarCodigo)
    .post('/registro', signoController.registroCredenciales)
    .post('/login',signoController.validarCredenciales)
    .post('/registroadmin',signoController.registarAdmin)
    .get('/traer/:valor',signoController.ganadores)
    .get('/traerusuario/:iduser',signoController.renderizar)
    .post('/generar',signoController.generarCodigo)
    .post('/upload/:iduser', upload.single('video'), signoController.Subirvideo)
    .get('/videos/:iduser',signoController.videos)
    // .patch('/restablecer', signoController.editarContrasena)

module.exports = router;