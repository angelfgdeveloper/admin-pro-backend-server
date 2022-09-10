const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = (req = request, res = response, next) => {
  // Leer token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición'
    });
  }

  try {

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido'
    });
  }

}

const validarAdminRole = async(req = request, res = response, next) => {

  const uid = req.uid;

  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe'
      });
    }

    if (usuarioDB.role !== 'ADMIN_ROLE') {
      // 403 => usuario no autorizado
      return res.status(403).json({
        ok: false,
        msg: 'Tu usuario no tiene privilegios de Administrador'
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}
const validarAdminRoleOMiUsuario = async(req = request, res = response, next) => {

  const uid = req.uid;
  const id = req.params.id;

  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe'
      });
    }

    if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
      // 403 => usuario no autorizado
      return res.status(403).json({
        ok: false,
        msg: 'Tu usuario no tiene privilegios de Administrador'
      });
    }

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

module.exports = {
  validarJWT,
  validarAdminRole,
  validarAdminRoleOMiUsuario,
}