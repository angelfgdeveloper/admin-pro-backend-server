const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {

    const usuarioDB = await Usuario.findOne({ email });

    // Verificar email
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'El correo electrónico no válido'
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: 'La contraseña no es válida'
      });
    }

    // Generar Token - JWT
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
      ok: true,
      token
    });
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

module.exports = {
  login,
}