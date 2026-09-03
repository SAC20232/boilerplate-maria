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
router.put('/:id', updateContrato);
router.delete('/:id', deleteContrato);
router.post('/:id/reenviar', reenviarContrato);
router.patch('/:id/firmar', firmarContrato);
router.patch('/:id/cancelar', cancelarContrato);
router.post('/', createContrato);

module.exports = router;
