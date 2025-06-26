const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/upload');
require('dotenv').config();
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para la API de subida de imágenes
app.use('/upload', uploadRoutes);

// Ruta para la configuración pública
app.get('/public-config', (req, res) => {
  res.json({
    IMAGE_SERVER_URL: process.env.IMAGE_SERVER_URL
  });
});

// Puerto del servidor
const PORT = process.env.PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
