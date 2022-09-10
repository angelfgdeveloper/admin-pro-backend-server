/*
 * Ruta: /api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator');

const {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario, 
  borrarUsuario
} = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole, validarAdminRoleOMiUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo electrónico es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], crearUsuarios);

router.put('/:id', [
  validarJWT,
  validarAdminRoleOMiUsuario, // Valida con privilegios de administrador y si es mi propio perfil
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo electrónico es obligatorio').isEmail(),
  check('role', 'El rol es obligatorio').not().isEmpty(),
  validarCampos
], actualizarUsuario);

router.delete('/:id', [
  validarJWT,
  validarAdminRole, // Valida con privilegios de administrador
], borrarUsuario);

module.exports = router;