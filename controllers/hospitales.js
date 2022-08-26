const { request, response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res = response) => {

  try {

    const hospitales = await Hospital.find().populate('usuario', 'nombre img');
      
    res.status(200).json({
      ok: true,
      hospitales
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const crearHospital = async (req = request, res = response) => {

  const uid = req.uid;
  const hospital = new Hospital({
    usuario: uid,
    ...req.body
  });

  try {

    const hospitalDB = await hospital.save();
      
    res.status(201).json({
      ok: true,
      hospital: hospitalDB
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador'
    });
  }

}

const actualizarHospital = async (req = request, res = response) => {

  try {
      
    res.status(200).json({
      ok: true,
      msg: 'Update Hospital'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const borrarHospital = async (req = request, res = response) => {

  try {
      
    res.status(200).json({
      ok: true,
      msg: 'Delete Hospital'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
}