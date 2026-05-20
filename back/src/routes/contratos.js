const express = require('express');
const router = express.Router();
const {
  getContratos,
  getContrato,
  createContrato,
  updateContrato,
  deleteContrato,
  reenviarContrato,
  firmarContrato,
  cancelarContrato,
} = require('../controllers/contratosController');

router.get('/', getContratos);
router.get('/:id', getContrato);
router.post('/', createContrato);
router.put('/:id', updateContrato);
router.delete('/:id', deleteContrato);
router.post('/:id/reenviar', reenviarContrato);
router.patch('/:id/firmar', firmarContrato);
router.patch('/:id/cancelar', cancelarContrato);

// TODO: Bug #1 - POST /contratos returns 404 because this route is missing
// Fix: add the following line:
// router.post('/', createContrato);

module.exports = router;
