const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req = request, res = response) => {

  const desde = Number(req.query.desde) || 0;

  try {
    
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //                               .skip(desde)
    //                               .limit(5);

    // const total = await Usuario.count();

    const [ usuarios, total ] = await Promise.all([
      Usuario.find({}, 'nombre email role google img').skip(desde).limit(5),
      Usuario.countDocuments()
    ]);
  
    res.status(200).json({
      ok: true,
      uid: req.uid,
      total,
      usuarios,
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const crearUsuarios = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {

    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya esta registrado'
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
  
    // Guardar usuario
    await usuario.save();
    
    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.status(201).json({
      ok: true,
      usuario,
      token
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

const actualizarUsuario = async (req = request, res = response) => {

  // Validar token y comprar usuario correcto

  const uid = req.params.id;

  try {

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id'
      });
    }

    // Actualización
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email'
        });
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuarios de Google no pueden cambiar su correo'
      });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

    res.status(201).json({
      ok: true,
      usuario: usuarioActualizado
    });
     
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }
}

const borrarUsuario = async (req = request, res = response) => {

  const uid = req.params.id;

  try {

    const usuarioDB = await Usuario.findById(uid);
    
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id'
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.status(200).json({
      ok: true,
      msg: 'Usuario eliminado'
    });
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    });
  }

}

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
}