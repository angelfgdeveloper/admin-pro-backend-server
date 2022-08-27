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

  const id = req.params.id;
  const uid = req.uid;

  try {

    const medicoDB = await Medico.findById(id);
    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        msg: 'Médico no encontrado por ID'
      });
    }

    const cambiosMedico = {
      ...req.body,
      usuario: uid
    }

    const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

    res.status(200).json({
      ok: true,
      medico: medicoActualizado
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const borrarMedico = async (req = request, res = response) => {

  const id = req.params.id;

  try {

    const medicoDB = await Medico.findById(id);
    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        msg: 'Médico no encontrado por ID'
      });
    }

    await Medico.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: 'Médico eliminado'
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