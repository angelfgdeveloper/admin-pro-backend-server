const { request, response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req = request, res = response) => {

  try {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');

    res.status(200).json({
      ok: true,
      medicos
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const crearMedico = async (req = request, res = response) => {

  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body
  });

  try {

    const medicoDB = await medico.save();
      
    res.status(201).json({
      ok: true,
      medico: medicoDB
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const actualizarMedico = async (req = request, res = response) => {

  try {
      
    res.status(200).json({
      ok: true,
      msg: 'Update Medico'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const borrarMedico = async (req = request, res = response) => {

  try {
      
    res.status(200).json({
      ok: true,
      msg: 'Delete Medico'
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
}