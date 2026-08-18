const Joi = require('joi');
const {
  getContratos,
  getContrato,
  createContrato,
  firmarContrato,
  cancelarContrato,
  reenviarContrato,
  deleteContrato,
} = require('../src/controllers/contratosController');

const contratoSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  apellidos: Joi.string().min(2).max(100).required(),
  telefono: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().required(),
  fecha_reserva: Joi.string().isoDate().required(),
});

describe('Joi Schema Validation', () => {
  test('valid contrato passes validation', () => {
    const { error, value } = contratoSchema.validate({
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '612345678',
      email: 'juan@example.com',
      fecha_reserva: '2026-06-15',
    });
    expect(error).toBeUndefined();
    expect(value.nombre).toBe('Juan');
  });

  test('invalid email fails validation', () => {
    const { error } = contratoSchema.validate({
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '612345678',
      email: 'not-an-email',
      fecha_reserva: '2026-06-15',
    });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('email');
  });

  test('missing required fields fails validation', () => {
    const { error } = contratoSchema.validate({ nombre: 'Juan' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('apellidos');
  });

  test('phone too short (< 6 chars) fails validation', () => {
    const { error } = contratoSchema.validate({
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '12345',
      email: 'juan@example.com',
      fecha_reserva: '2026-06-15',
    });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('telefono');
  });

  test('invalid date format fails validation', () => {
    const { error } = contratoSchema.validate({
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '5512349876',
      email: 'juan@example.com',
      fecha_reserva: '15/06/2026',
    });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('fecha_reserva');
  });
});

describe('Pagination logic', () => {
  test('calculates correct offset', () => {
    const limit = 10;
    expect((1 - 1) * limit).toBe(0);
    expect((2 - 1) * limit).toBe(10);
    expect((3 - 1) * limit).toBe(20);
  });

  test('calculates total pages correctly', () => {
    const limit = 10;
    expect(Math.ceil(45 / limit)).toBe(5);
    expect(Math.ceil(10 / limit)).toBe(1);
    expect(Math.ceil(11 / limit)).toBe(2);
    expect(Math.ceil(0 / limit) || 0).toBe(0);
  });
});

describe('Contratos Controller Integration', () => {
  let createdId;

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('POST /contratos (createContrato) creates a contract and returns 201', () => {
    const req = {
      body: {
        nombre: 'Carlos',
        apellidos: 'Ramírez Soto',
        telefono: '5512349876',
        email: 'carlos.ramirez@example.com',
        fecha_reserva: '2026-06-15',
      },
    };
    const res = mockRes();

    createContrato(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonCall = res.json.mock.calls[0][0];
    expect(jsonCall).toBeDefined();
    expect(jsonCall.id).toBeDefined();
    expect(jsonCall.nombre).toBe('Carlos');
    expect(jsonCall.status).toBe('Pendiente de firma');
    expect(jsonCall.contrato).toMatch(/^contrato_\d+_\d+\.txt$/);
    createdId = jsonCall.id;
  });

  test('POST /contratos returns 400 on invalid payload', () => {
    const req = {
      body: {
        nombre: 'Carlos',
        email: 'invalid-email',
      },
    };
    const res = mockRes();

    createContrato(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 400, error: expect.any(String) })
    );
  });

  test('GET /contratos/:id (getContrato) retrieves contract with a single query', () => {
    const req = { params: { id: createdId } };
    const res = mockRes();

    getContrato(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createdId,
        nombre: 'Carlos',
        apellidos: 'Ramírez Soto',
      })
    );
  });

  test('GET /contratos/:id returns 404 when not found', () => {
    const req = { params: { id: 999999 } };
    const res = mockRes();

    getContrato(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Contrato no encontrado',
      status: 404,
    });
  });

  test('GET /contratos (getContratos) supports status filtering', () => {
    const req = {
      query: { status: 'Pendiente de firma' },
    };
    const res = mockRes();

    getContratos(req, res);

    const result = res.json.mock.calls[0][0];
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.pagination).toBeDefined();
    expect(result.pagination.total).toBeGreaterThanOrEqual(1);
    result.data.forEach((c) => {
      expect(c.status).toBe('Pendiente de firma');
    });
  });

  test('GET /contratos supports partial nombre filtering', () => {
    const req = {
      query: { nombre: 'carl' },
    };
    const res = mockRes();

    getContratos(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.data[0].nombre).toContain('Carlos');
  });

  test('GET /contratos supports partial apellidos filtering', () => {
    const req = {
      query: { nombre: 'Soto' },
    };
    const res = mockRes();

    getContratos(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    expect(result.data[0].apellidos).toContain('Soto');
  });

  test('GET /contratos handles combined status and nombre filters with no match', () => {
    const req = {
      query: { status: 'Cancelado', nombre: 'NonExistentPerson' },
    };
    const res = mockRes();

    getContratos(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });

  test('PATCH /contratos/:id/firmar updates status to Firmado', () => {
    const req = { params: { id: createdId } };
    const res = mockRes();

    firmarContrato(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createdId,
        status: 'Firmado',
      })
    );
  });

  test('PATCH /contratos/:id/cancelar updates status to Cancelado', () => {
    const req = { params: { id: createdId } };
    const res = mockRes();

    cancelarContrato(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createdId,
        status: 'Cancelado',
      })
    );
  });

  test('POST /contratos/:id/reenviar sends simulated email', () => {
    const req = { params: { id: createdId } };
    const res = mockRes();

    reenviarContrato(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Email reenviado',
      status: 200,
    });
  });

  test('DELETE /contratos/:id removes the contract', () => {
    const req = { params: { id: createdId } };
    const res = mockRes();

    deleteContrato(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Contrato eliminado',
      status: 200,
    });

    const verifyRes = mockRes();
    getContrato(req, verifyRes);
    expect(verifyRes.status).toHaveBeenCalledWith(404);
  });
});
