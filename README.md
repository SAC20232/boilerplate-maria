# MarIA SaaS - Prueba Técnica Fullstack

Sistema SaaS de hospitality con gestión de contratos, reservas y tickets.

---

## Despliegues (Live Demo)

### 🚀 Despliegue de la Solución (Candidato: Herzon Palma)
- **Frontend (App en Vivo):** [https://boilerplate-maria.vercel.app/](https://boilerplate-maria.vercel.app/)
- **Backend (API en Vivo):** [https://boilerplate-maria.onrender.com/](https://boilerplate-maria.onrender.com/)

### 📌 Despliegues Originales de Referencia (Plantilla Base)
- **Frontend (Referencia):** [https://maria-saas.vercel.app/](https://maria-saas.vercel.app/)
- **Backend (Referencia):** [https://maria-saas-api.onrender.com/](https://maria-saas-api.onrender.com/)

---

## Resumen de Solución y Entregables (Candidato: Herzon Palma)

### 1. Resolución de Bugs Core

#### Backend (`back/`)
- **Bug 1 (`POST /contratos` retorna 404)**: Ruta registrada en `back/src/routes/contratos.js` vinculada al controlador `createContrato`, respondiendo con HTTP 201 y generando el documento de contrato.
- **Bug 2 (`GET /contratos/:id` duplica query / N+1)**: Eliminada la consulta redundante de verificación previa en `back/src/controllers/contratosController.js`, ejecutando una única consulta directa parametrizada.
- **Bug 3 (`DB_PATH` undefined en conexión)**: Configuración en `back/.env` con `DB_PATH=./database.sqlite` y resolución de fallback seguro mediante `path.join` en `back/src/database/db.js`.

#### Frontend (`front/`)
- **Bug 1 (Modal no cierra tras submit)**: Descomentada la invocación de `onClose()` en `front/src/components/ContratoModal.jsx` tras la creación exitosa con HTTP 201.
- **Bug 2 (Tabla no responsive en móvil)**: Envoltorio en contenedor con `overflow-x-auto` y tabla con `min-w-[800px]` en `front/src/pages/Contratos.jsx` para permitir desplazamiento horizontal limpio en dispositivos móviles sin desbordar la vista.
- **Bug 3 (Validación inline incorrecta)**: Inversión de las condiciones lógicas erróneas en `ContratoModal.jsx` para mostrar correctamente los estados de error.

---

### 2. Implementación de Características Bonus

- **Validaciones Avanzadas de Formulario (`ContratoModal.jsx` y `helpers.js`)**:
  - Teléfono restringido estrictamente a dígitos numéricos (`/^\d+$/`, entre 6 y 20 dígitos).
  - Fecha de reserva obligatoria y con restricción $\ge$ día de hoy (`YYYY-MM-DD`).
  - Detección de campos obligatorios vacíos al hacer submit con mensajes inline y bordes dinámicos de error (`border-red-400`).
- **Filtrado y Búsqueda Dinámica en Backend (`contratosController.js`)**:
  - Filtro por estado (`status`) y búsqueda parcial case-insensitive por nombre/apellidos (`nombre`) usando sentencias SQL estrictamente parametrizadas con placeholders `?` para prevenir inyección SQL (CWE-89).
  - Sincronización exacta de `pagination.total` y `totalPages` mediante consulta de conteo filtrada (`SELECT COUNT(*)`).
- **Documentación de Prompt Engineering (`PROMPTS.md`)**:
  - Registro de prompts para generación de 10 registros SQL y plantilla de copywriting de email transaccional con variables JavaScript.
  - Documentación de la estrategia de Prompt Engineering y arquitectura multi-agente bajo metodología **SDD (Spec-Driven Development)**.

---

### 3. Resultados de Pruebas y Control de Calidad

- **Backend (`back/`)**: **19/19 tests unitarios e integración pasando** (`cd back && npm test`).
- **Frontend (`front/`)**: **11/11 tests unitarios pasando** (`cd front && npm test`).
- **Linter & Accesibilidad (`front/`)**: **0 errores / 0 warnings** con Biome (`npm run lint`).
- **Configuración SPA para Producción**: Inclusión de `front/vercel.json` con reglas de reescritura para soporte de rutas directas y recargas en Vercel.

---

## Estructura del Proyecto

```
boilerplate/
├── .husky/          # Configuración de husky para conventional commits
├── front/          # Vite + React + Tailwind + Biome
├── back/           # Node.js + Express + SQLite (node:sqlite)
├── openspec/       # Especificaciones normativas, diseño y archivo SDD
├── PROMPTS.md      # Documentación de Prompt Engineering y metodología SDD
├── README.md       # Documentación general y entregables
├── package.json    # Configuración raíz de Node.js
└── .env.example    # Ejemplo de variables de entorno
```

## Inicio Rápido Local

### Backend

```bash
cd back
npm install
cp .env.example .env
npm run dev
# Servidor ejecutándose en http://localhost:3000
```

### Frontend

```bash
cd front
npm install
cp .env.example .env
npm run dev
# Cliente ejecutándose en http://localhost:5173
```

## Ejecución de Pruebas Automatizadas

```bash
# Backend (19 tests)
cd back && npm test

# Frontend (11 tests + Linter)
cd front && npm test && npm run lint
```
