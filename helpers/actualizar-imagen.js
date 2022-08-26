const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    // Borrar la imágen anterior
    fs.unlinkSync(path);
  }
}

const actualizarImagen = async(tipo, id, nombreArchivo) => {

  switch (tipo) {
    case 'medicos':
      const medico = await Medico.findById(id);

      if (!medico) {
        // No es un médico por id
        return false;
      }

      borrarImagen(`./uploads/medicos/${ medico.img }`); // pathViejo

      medico.img = nombreArchivo;
      await medico.save();
      
      return true;
    case 'hospitales':
      const hospital = await Hospital.findById(id);

      if (!hospital) {
        // No es un médico por id
        return false;
      }

      borrarImagen(`./uploads/hospitales/${ hospital.img }`); // pathViejo

      hospital.img = nombreArchivo;
      await hospital.save();
      
      return true;
    case 'usuarios':
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        // No es un médico por id
        return false;
      }

      borrarImagen(`./uploads/usuarios/${ usuario.img }`); // pathViejo

      usuario.img = nombreArchivo;
      await usuario.save();
      
      return true;
  }

}

module.exports = {
  actualizarImagen
}