const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const contratoSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  apellidos: Joi.string().min(2).max(100).required(),
  telefono: Joi.string().min(6).max(20).required(),
  email: Joi.string().email().required(),
  fecha_reserva: Joi.string().isoDate().required(),
});

describe('Joi Schema Validation', () => {
  test('valid contrato passes validation', () => {
    const { error } = contratoSchema.validate({
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '612345678',
      email: 'juan@example.com',
      fecha_reserva: '2024-06-15',
    });
    expect(error).toBeUndefined();
  });

  test('invalid email fails validation', () => {
    const { error } = contratoSchema.validate({
      nombre: 'Juan',
      apellidos: 'Pérez',
      telefono: '612345678',
      email: 'not-an-email',
      fecha_reserva: '2024-06-15',
    });
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('email');
  });

  test('missing required fields fails validation', () => {
    const { error } = contratoSchema.validate({ nombre: 'Juan' });
    expect(error).toBeDefined();
  });
});

describe('Pagination logic', () => {
  test('calculates correct offset', () => {
    const page = 3;
    const limit = 10;
    const offset = (page - 1) * limit;
    expect(offset).toBe(20);
  });

  test('calculates total pages correctly', () => {
    const total = 45;
    const limit = 10;
    const totalPages = Math.ceil(total / limit);
    expect(totalPages).toBe(5);
  });
});

describe('GET /contratos filters', () => {
  const testDbPath = path.join(__dirname, 'test-contratos-filters.sqlite');
  let db;
  let getContratos;

  const seed = [
    { nombre: 'Juan', apellidos: 'Pérez', telefono: '611111111', email: 'juan@example.com', fecha_reserva: '2024-06-15', status: 'Pendiente de firma' },
    { nombre: 'Juana', apellidos: 'Gómez', telefono: '622222222', email: 'juana@example.com', fecha_reserva: '2024-06-16', status: 'Firmado' },
    { nombre: 'Pedro', apellidos: 'López', telefono: '633333333', email: 'pedro@example.com', fecha_reserva: '2024-06-17', status: 'Cancelado' },
  ];

  beforeAll(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    process.env.DB_PATH = testDbPath;

    jest.resetModules();
    db = require('../src/database/db');
    ({ getContratos } = require('../src/controllers/contratosController'));

    const stmt = db.prepare(`
      INSERT INTO contratos (nombre, apellidos, telefono, email, fecha_reserva, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    seed.forEach((c) => stmt.run(c.nombre, c.apellidos, c.telefono, c.email, c.fecha_reserva, c.status));
  });

  afterAll(() => {
    delete process.env.DB_PATH;
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  function mockRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }

  test('returns all contratos when no filters are given', () => {
    const req = { query: {} };
    const res = mockRes();

    getContratos(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    const body = res.json.mock.calls[0][0];
    expect(body.data).toHaveLength(3);
    expect(body.pagination.total).toBe(3);
  });

  test('filters by exact status', () => {
    const req = { query: { status: 'Firmado' } };
    const res = mockRes();

    getContratos(req, res);

    const body = res.json.mock.calls[0][0];
    expect(body.data).toHaveLength(1);
    expect(body.data[0].nombre).toBe('Juana');
    expect(body.pagination.total).toBe(1);
  });

  test('filters by nombre using a case-insensitive partial match', () => {
    const req = { query: { nombre: 'jua' } };
    const res = mockRes();

    getContratos(req, res);

    const body = res.json.mock.calls[0][0];
    const nombres = body.data.map((c) => c.nombre).sort();
    expect(nombres).toEqual(['Juan', 'Juana']);
  });

  test('combines status and nombre filters', () => {
    const req = { query: { status: 'Pendiente de firma', nombre: 'jua' } };
    const res = mockRes();

    getContratos(req, res);

    const body = res.json.mock.calls[0][0];
    expect(body.data).toHaveLength(1);
    expect(body.data[0].nombre).toBe('Juan');
  });

  test('returns an empty list when no contrato matches the filters', () => {
    const req = { query: { status: 'Firmado', nombre: 'pedro' } };
    const res = mockRes();

    getContratos(req, res);

    const body = res.json.mock.calls[0][0];
    expect(body.data).toHaveLength(0);
    expect(body.pagination.total).toBe(0);
  });
});
