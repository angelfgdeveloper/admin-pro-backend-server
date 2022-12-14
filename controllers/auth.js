const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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
      token,
      menu: getMenuFrontEnd(usuarioDB.role)
    });
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

const googleSignIn = async (req = request, res = response) => {

  try {

    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@',
        img: picture,
        google: true
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
      // usuario.password = '@@';
    }

    await usuario.save();

    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      email, 
      name, 
      picture,
      token,
      menu: getMenuFrontEnd(usuario.role)
    });
    
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Token de Google no válido'
    });
  }

}

const renewToken = async (req = request, res = response) => {

  try {

    const uid = req.uid;
    const token = await generarJWT(uid);

    // Obtener el usuario UID
    const usuario = await Usuario.findById(uid);

    res.status(200).json({
      ok: true,
      usuario,
      token,
      menu: getMenuFrontEnd(usuario.role),
    });
    
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

module.exports = {
  login,
  googleSignIn,
  renewToken
}