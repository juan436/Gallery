const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { category, type } = req.body;
        const dest = path.join(__dirname, '../public/images', category, type || '');
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // Obtener la extensión del archivo
        const fileExt = path.extname(file.originalname);
        // Obtener el nombre del archivo sin extensión
        const fileName = path.basename(file.originalname, fileExt).toLowerCase().replace(/\s+/g, '-');
        // Añadir timestamp como identificador único
        const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Crear el nombre final: nombre-timestamp.extensión
        const uniqueFileName = `${fileName}-${uniqueId}${fileExt}`;
        cb(null, uniqueFileName);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' });

    const category = req.body.category;
    const { path: imagePath } = req.file;

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (category === 'profile') {
        if (metadata.width !== 500 || metadata.height !== 500) {
            fs.unlinkSync(imagePath);
            return res.status(400).json({ error: 'La imagen de perfil debe ser 500x500px' });
        }
        if (req.file.size > 500 * 1024) {
            fs.unlinkSync(imagePath);
            return res.status(400).json({ error: 'La imagen de perfil debe pesar máximo 500KB' });
        }
    }

    if (category === 'projects') {
        if (req.file.size > 1024 * 1024) {
            fs.unlinkSync(imagePath);
            return res.status(400).json({ error: 'La imagen de proyectos debe pesar máximo 1MB' });
        }
    }

    const url = `/images/${req.body.category}/${req.body.type || ''}/${req.file.filename}`;
    res.json({ success: true, url });
});

router.get('/list', async (req, res) => {
  const { category, type } = req.query;
  const baseDir = path.join(__dirname, '../public/images');
  let result = [];

  // Si no hay categoría, mostrar imágenes de perfil y proyectos/fullstack
  if (!category) {
    // Obtener imágenes de perfil
    const profileDir = path.join(baseDir, 'profile');
    if (fs.existsSync(profileDir)) {
      const profileFiles = fs.readdirSync(profileDir, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .filter(dirent => {
          const ext = path.extname(dirent.name).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .map(dirent => ({
          name: dirent.name,
          url: `/images/profile/${dirent.name}`,
          category: 'profile',
          type: null
        }));
      
      result = result.concat(profileFiles);
    }

    // Obtener imágenes de proyectos/fullstack
    const projectsFullstackDir = path.join(baseDir, 'projects', 'fullstack');
    if (fs.existsSync(projectsFullstackDir)) {
      const fullstackFiles = fs.readdirSync(projectsFullstackDir)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .map(file => ({
          name: file,
          url: `/images/projects/fullstack/${file}`,
          category: 'projects',
          type: 'fullstack'
        }));
      
      result = result.concat(fullstackFiles);
    }
    
    return res.json(result);
  }
  
  // Si la categoría es "profile", mostrar solo imágenes de perfil
  if (category === 'profile') {
    const profileDir = path.join(baseDir, 'profile');
    if (!fs.existsSync(profileDir)) {
      return res.json([]);
    }
    
    const profileFiles = fs.readdirSync(profileDir, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .filter(dirent => {
        const ext = path.extname(dirent.name).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(dirent => ({
        name: dirent.name,
        url: `/images/profile/${dirent.name}`,
        category: 'profile',
        type: null
      }));
    
    return res.json(profileFiles);
  }
  
  // Si la categoría es "projects", mostrar solo imágenes de projects/fullstack
  if (category === 'projects') {
    const projectsFullstackDir = path.join(baseDir, 'projects', 'fullstack');
    if (!fs.existsSync(projectsFullstackDir)) {
      return res.json([]);
    }
    
    const fullstackFiles = fs.readdirSync(projectsFullstackDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(file => ({
        name: file,
        url: `/images/projects/fullstack/${file}`,
        category: 'projects',
        type: 'fullstack'
      }));
    
    return res.json(fullstackFiles);
  }
  
  // Si llegamos aquí, es una categoría desconocida
  return res.json([]);
});

router.delete('/delete', (req, res) => {
  const { category, type, filename } = req.body;

  if (!category || !filename) return res.status(400).json({ error: 'Faltan datos' });

  const imagePath = path.join(__dirname, '../public/images', category, type || '', filename);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    return res.json({ success: true });
  } else {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

module.exports = router;
