const path = require('path');
const fs = require('fs');

const { request, response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req = request, res = response) => {

  const tipo = req.params.tipo;
  const id   = req.params.id;
  const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

  try {

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        ok: false,
        msg: 'No es un médico, usuario u hospital (tipo)'
      });
    }
  
    // Válidar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok: false,
        msg: 'No hay ningún archivo'
      });
    }

    // Procesar la imágen..
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); // wolvering.1.2.jpg
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // obtenemos el ultimo elemento

    // Válidar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
      return res.status(400).json({
        ok: false,
        msg: 'No es una extensión permitida'
      });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`

    // Crear el path para guardar la imágen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imágen
    file.mv(path, (err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          msg: 'Error al mover la imágen'
        });
      }

      // Actualizar DB
      actualizarImagen(tipo, id, nombreArchivo);
  
      res.status(200).json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo
      });
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const retornaImagen = async (req = request, res = response) => {

  const tipo = req.params.tipo;
  const foto   = req.params.foto;

  try {
    
    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    // Imágen por default
    if (fs.existsSync(pathImg)) {
      res.sendFile(pathImg);
    } else {
      const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
      res.sendFile(pathImg);
    }

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

module.exports = {
  fileUpload,
  retornaImagen,
}