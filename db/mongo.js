// db/mongo.js
const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // Sin opciones obsoletas
    console.log('Conexión exitosa a MongoDB');
   
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    process.exit(1); // Termina el proceso si hay un error
  }
};

module.exports = connectDB;



// const mongoose = require('mongoose');
// require('dotenv').config();

// const uri = process.env.MONGO_URL;

// mongoose.connect(uri)
//     .then(() => {
//         console.log('Conectado a MongoDB');
//         mongoose.connection.close(); // Cerrar conexión después de probar
//     })
//     .catch(err => {
//         console.error('Error de conexión a MongoDB:', err);
//     });
