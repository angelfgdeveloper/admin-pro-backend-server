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

  const id = req.params.id;
  const uid = req.uid;

  try {

    const hospitalDB = await Hospital.findById(id);
    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        msg: 'Hospital no encontrado por ID'
      });
    }

    const cambiosHospital = {
      ...req.body,
      usuario: uid
    }

    const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

    res.status(200).json({
      ok: true,
      hospital: hospitalActualizado
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const borrarHospital = async (req = request, res = response) => {

  const id = req.params.id;

  try {

    const hospitalDB = await Hospital.findById(id);
    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        msg: 'Hospital no encontrado por ID'
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: 'Hospital eliminado'
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