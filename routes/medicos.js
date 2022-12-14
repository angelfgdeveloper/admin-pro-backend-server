/**
 * Path: '/api/medicos'
 */

const { Router } = require('express');
const { check } = require('express-validator');

const {
  getMedicos,
  getMedicoById,
  crearMedico,
  actualizarMedico,
  borrarMedico,
} = require('../controllers/medicos');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getMedicos);

router.get('/:id', [
  validarJWT,
  check('id', 'El id del médico debe ser válido').isMongoId(),
  validarCampos
], getMedicoById);

router.post('/', [
  validarJWT,
  check('nombre', 'Es obligatorio el nombre del médico').not().isEmpty(),
  check('hospital', 'Es id del hospital debe de ser válido').isMongoId(),
  validarCampos
], crearMedico);

router.put('/:id', [
  validarJWT,
  check('nombre', 'El nombre del médico es obligatorio').not().isEmpty(),
  check('hospital', 'Es id del hospital debe de ser válido').isMongoId(),
  validarCampos
], actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);


module.exports = router;