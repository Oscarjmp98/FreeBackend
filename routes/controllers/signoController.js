
const fs = require('fs/promises');
const path = require('path');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const AWS = require('@aws-sdk/client-s3');  // Correcto para AWS SDK v3
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');  // Importación correcta de AWS SDK v3
const Video = require('../../db/Multimedia');
const s3Client = require('../../db/awsS3');  // Asegúrate de tener la conexión de AWS configurada correctamente
const User = require('../../db/user');

// Configuración de Multer
const upload = multer({ storage: multer.memoryStorage() });

const Subirvideo = async (req, res) => {
    try {
      const file = req.file; // Accede al archivo subido
      const { newName } = req.body; // Obtén el nuevo nombre desde el cliente
      const {iduser} = req.params;


  
      if (!file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' });
      }
  
      // Generar un nombre único para el archivo o usar el proporcionado por el cliente
      const fileName = newName ? `${newName}.mp4` : file.originalname;
      const uniqueKey = `videos/${Date.now()}-${fileName}`;
  
      // Parámetros para la subida del archivo a S3
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Nombre del bucket
        Key: uniqueKey, // Nombre único del archivo en S3
        Body: file.buffer, // El contenido del archivo
        ContentType: file.mimetype, // Tipo MIME del archivo
      };
  
      // Subir el archivo a S3 usando PutObjectCommand
      const command = new PutObjectCommand(params);
      const uploadResult = await s3Client.send(command);
  
      // Guardar la URL del video en MongoDB
      const videonew = new Video({
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`,
        filename: fileName, // Guardar el nombre renombrado
        usuario: iduser,
        fechaSubida: new Date(),
      });
      await videonew.save();
  
    
      console.log(videonew)

      res.json([videonew])

    } catch (error) {
      console.error('Error al subir el video:', error);
      res.status(500).json({ error: 'Error al subir el video' });
    }
  };
  



  const videos = async(req, res)=>{

    

    const {iduser} = req.params;

    console.log(iduser)

    try {
        const ultimoVideo = await Video.find({usuario: iduser})
            .sort({ fechaSubida: -1 });

        if (ultimoVideo) {
            console.log("Último video encontrado:", ultimoVideo);
        } else {
            console.log("No se encontraron videos para este usuario.");
        }
        res.json(ultimoVideo);
    } catch (error) {
        console.error("Error al obtener el último video:", error);
    }

  }
  
const validarCredenciales = async (req, res)=>{
   //const {categoria,signoEditar} = req.params;

   const {username,password} = req.body;
   try{
       const user = await User.findOne({email: username})
       if (!user){
           res.json('usuario o contaseña invalida')
        }else{
                const isMatch =await bcrypt.compare(password, user.password)
                if (isMatch){
                    const id = user.id
                    if(user.rol === 'user'){
                        res.json({
                        usuario:"user",
                     id: id
                    })
                    }else{
            
                    res.json({
                    usuario:"admin",
                    })
                    }
                }
            }

    } catch (error) {
    console.error('Error al leer las credenciales:', error);
    return res.status(500).json({ message: "Error en el servidor" });
    }

}

const registroCredenciales = async (req, res)=>{
    
    const {...addcredenciales} = req.body;
    
    console.log(addcredenciales)
    
    const {email} = addcredenciales
    const {password} = addcredenciales
    const {nombre} = addcredenciales
    const {cedula} = addcredenciales
    const {telefono} = addcredenciales
    const {ciudad} = addcredenciales
    const {fecha} = addcredenciales
    const {rol} = addcredenciales
    
   
    
    try{
        const isUser = await User.findOne({email: email})
        if(isUser){
            return res.json('Usuario ya Existe')
        }

        const salt = await  bcrypt.genSalt()
        const hashed = await bcrypt.hash(password, salt)
        const user = await User.create({rol:rol, email:email, password: hashed,salt, nombre:nombre,cedula:cedula,telefono:telefono,ciudad:ciudad,fechaNacimiento:fecha,})
    }catch(err){

        console.log(err)
        res.status(500).send(err.message)

    }
    
    res.json('Registro Exitosa')

}

const  registarAdmin = async (req, res)=>{
    
    const {...addcredenciales} = req.body;
    
    
    
    const {email} = addcredenciales
    const {password} = addcredenciales
    const {rol} = addcredenciales
    
   
    
    try{
        const isUser = await User.findOne({email: email})
        if(isUser){
            return res.json('Usuario ya Existe')
        }
        
        const salt = await  bcrypt.genSalt()
        const hashed = await bcrypt.hash(password, salt)
        const user = await User.create({rol:rol, email:email, password: hashed,salt})
    }catch(err){
        
        console.log(err)
        res.status(500).send(err.message)
        
    }
    
     res.json('Registro exitoso')
    

}


const generarCodigo = async () => {
    const DateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const estado = "libre";
    const premio = "sigue intentando";

    console.log("si entre")
    

    try {
        // Generar códigos del 000 al 999
        for (let i = 0; i <= 999; i++) {
            let numeroFormateado = i.toString().padStart(3, '0');
            const codigoExistente = await modeCodigo.findOne({ codigoNumero: numeroFormateado });
            if (codigoExistente) {
                return;
            }
            await modeCodigo.create({ codigoNumero: numeroFormateado, premio: premio, estado: estado, fecha: DateTime });
        }

        // Seleccionar 30 números aleatorios
        let numerosSeleccionados = [];
        while (numerosSeleccionados.length < 900) {
            let numero = Math.floor(Math.random() * 1000);
            let numeroFormateado = numero.toString().padStart(3, '0');
            if (!numerosSeleccionados.includes(numeroFormateado)) {
                numerosSeleccionados.push(numeroFormateado);
            }
        }

        // Asignar premios
        const premios = [
            ...Array(300).fill('$1.000.000'),
            ...Array(300).fill('$500.000'),
            ...Array(300).fill('$100.000')
        ];

        for (let i = 0; i < numerosSeleccionados.length; i++) {
            await modeCodigo.findOneAndUpdate(
                { codigoNumero: numerosSeleccionados[i] },
                { $set: { premio: premios[i] } },
                { new: true }
            );
        }

        
    } catch (err) {
        console.error('Error en generarCodigo:', err);
        
    }
}





const registarCodigo = async (req, res) => {
    const DateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const { codigo } = req.body;

    const { numero } = codigo;
    const { usuario } = codigo;

    console.log(numero);

    try {
        // Verificar si el código ya fue utilizado
        const Codigol = await modeCodigo.findOne({ codigoNumero: numero });
        
        if (!Codigol) {
            return res.json('El código no existe');
        }

        if (Codigol.estado === "utilizado") {
            return res.json('El número ya ha sido usado');
        }

        // Actualizar el estado del código a "utilizado"
        await modeCodigo.findOneAndUpdate(
            { codigoNumero: numero },
            { $set: { estado: 'utilizado' } },
            { new: true }
        );

        // Verificar si el código ya está registrado para el usuario
        const CodigoR = await regisCodigo.findOne({ codigoNumero: numero });

        if (CodigoR) {
            return res.json('El número ya está registrado');
        }

        await regisCodigo.create({ codigoNumero: numero, usuario: usuario, fecha: DateTime });

       
        res.json("REGISTRO EXITOSO");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

const ganadores = async (req, res) => {

    const {valor} = req.params
    

    try {
        // Verificar si el código ya fue utilizado
    
        // Obtener todos los registros del usuario
        const registros = await modeCodigo.find({ estado:valor }).sort({ fecha: -1 });

        // Asociar los códigos con sus respectivos premios
        const resultados = await Promise.all(
            registros.map(async (registro) => {
                if (registro.premio != "sigue intentando"){

                    const usadoCodigo = await regisCodigo.findOne({ codigoNumero: registro.codigoNumero });
                    const usuario = await  User.findOne({ _id: usadoCodigo.usuario });
                    return {
                        fecha: usadoCodigo.fecha,
                        nombre: usuario.nombre,
                        cedula: usuario.cedula,
                        telefono: usuario.telefono,
                        codigo: usadoCodigo.codigoNumero,
                        premio: registro ? registro.premio : null,
                    };

                }
            })
        );

        const resultadosFiltrados = resultados.filter(resultado => resultado !== undefined);

       
        res.json(resultadosFiltrados)

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

const renderizar = async (req, res) => {

    const {iduser} = req.params
 
    
    try {
        
        // Obtener todos los registros del usuario
        const registros = await regisCodigo.find({ usuario:iduser }).sort({ fecha: -1 });

        // Asociar los códigos con sus respectivos premios
        const resultados = await Promise.all(
            registros.map(async (registro) => {
                const usadoCodigo = await modeCodigo.findOne({ codigoNumero: registro.codigoNumero });
                return {
                    fecha: registro.fecha,
                    codigo: registro.codigoNumero,
                    premio: usadoCodigo ? usadoCodigo.premio : null,
                };
            })
        );

        

        // Enviar la lista de registros con los detalles de premio
        res.json(resultados);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};



module.exports = {
    
    validarCredenciales,
    registroCredenciales,
    registarCodigo,
    registarAdmin,
    ganadores,
    renderizar,
    generarCodigo,
    Subirvideo,
    upload,
    videos,

}