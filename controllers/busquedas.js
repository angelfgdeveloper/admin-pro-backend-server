const { request, response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getBusqueda = async (req = request, res = response) => {

  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i'); // Expresion regular insensible a las mayusculas

  try {

    // const usuarios = await Usuario.find({ nombre: regex });
    // const medicos = await Medico.find({ nombre: regex });
    // const hospitales = await Hospital.find({ nombre: regex });

    const [ usuarios, medicos, hospitales ] = await Promise.all([
      Usuario.find({ nombre: regex }),
      Medico.find({ nombre: regex }),
      Hospital.find({ nombre: regex })
    ]);
      
    res.status(200).json({
      ok: true,
      usuarios,
      medicos,
      hospitales
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const getDocumentosColeccion = async (req = request, res = response) => {

  const tabla    = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex    = new RegExp(busqueda, 'i'); // Expresion regular insensible a las mayusculas

  let data = [];

  try {

    switch (tabla) {
      case 'medicos':
        data = await Medico.find({ nombre: regex })
                           .populate('usuario', 'nombre img')
                           .populate('hospital', 'nombre img');
        
        break;
      case 'hospitales':
        data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img');
        break;
      case 'usuarios':
        data = await Usuario.find({ nombre: regex });
        break;
  
      default:
        return res.status(400).json({
          ok: false,
          msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
        });

      }
      
      res.status(200).json({
        ok: true,
        resultados: data
      });
      
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

module.exports = {
  getBusqueda,
  getDocumentosColeccion,
}