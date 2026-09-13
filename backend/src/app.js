
const express = require('express');
const app = express();


// Middleware
app.use(express.json());

// Importar y registrar rutas

const playerRoutes = require('./routes/playerRoutes');
app.use('/api',playerRoutes);


// Configuración de puerto y arranque del servidor 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

