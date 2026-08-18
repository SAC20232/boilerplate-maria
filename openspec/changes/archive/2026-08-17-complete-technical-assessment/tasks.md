# Tasks: complete-technical-assessment

## Review Workload Forecast
- **Estimated changed lines**: ~140 lines across 10 files
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low
- **Rollback boundaries**: Atomic git reset / checkout on `back/`, `front/`, `.env`, and `PROMPTS.md`.
- **Runtime harness**: Node.js v20+ with native `DatabaseSync` (`node:sqlite`) and React 18 / Vite client.

### Work Units & Test Harness
| Unit | Scope | Files | Focused Test Command |
|---|---|---|---|
| U1 | Backend Config & Routes | `back/src/database/db.js`, `.env`, `back/src/routes/contratos.js` | `cd back && npm test` |
| U2 | Backend Controller & Filtering | `back/src/controllers/contratosController.js`, `back/tests/contratos.test.js` | `cd back && npm test` |
| U3 | Frontend Modal & Validation | `front/src/components/ContratoModal.jsx`, `front/src/utils/helpers.js` | `cd front && npm test` |
| U4 | Frontend Layout & Tests | `front/src/pages/Contratos.jsx`, `front/src/tests/helpers.test.js` | `cd front && npm test` |
| U5 | Prompt Docs & Quality Gates | `PROMPTS.md` | `cd front && npm run lint` |

---

## Task List

### Phase 1: Backend Bug Fixes & Configuration
- [x] 1.1 Configure `.env` with `DB_PATH=./database.sqlite` and ensure robust fallback path resolution in [`back/src/database/db.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/back/src/database/db.js).
- [x] 1.2 Register missing `POST /` route pointing to `createContrato` in [`back/src/routes/contratos.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/back/src/routes/contratos.js).
- [x] 1.3 Refactor `getContrato` in [`back/src/controllers/contratosController.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/back/src/controllers/contratosController.js) to retrieve records with a single SQL query without duplicate count lookups.

### Phase 2: Backend Filtering & Tests
- [x] 2.1 Add unit tests in [`back/tests/contratos.test.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/back/tests/contratos.test.js) asserting query parameter filtering (`status`, `nombre`) and pagination total math.
- [x] 2.2 Implement parameterized dynamic `WHERE` filtering (`status`, `nombre` with `LIKE ?`) and synchronized total count query in `getContratos` in [`back/src/controllers/contratosController.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/back/src/controllers/contratosController.js).
- [x] 2.3 Run backend test suite via `npm test` in `back/` to verify zero regression.

### Phase 3: Frontend Bug Fixes & Validation
- [x] 3.1 Update [`front/src/utils/helpers.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/front/src/utils/helpers.js) with strict numeric phone validation (`/^\d+$/`) and date formatting helpers.
- [x] 3.2 Update [`front/src/components/ContratoModal.jsx`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/front/src/components/ContratoModal.jsx) to call `onClose()` on successful creation, enforce date `>= today`, validate numeric digits phone, and apply red error border styling (`border-red-400`).

### Phase 4: Frontend Layout & Tests
- [x] 4.1 Expand [`front/src/tests/helpers.test.js`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/front/src/tests/helpers.test.js) test cases for numeric phone validation, future/past dates, and email edge cases.
- [x] 4.2 Verify responsive layout wrapper in [`front/src/pages/Contratos.jsx`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/front/src/pages/Contratos.jsx) with `overflow-x-auto` container and `min-w-[800px]` table width.
- [x] 4.3 Run frontend test suite via `npm test` in `front/`.

### Phase 5: Prompt Documentation & Verification
- [x] 5.1 Verify completeness of prompt templates, AI context, rationale, and outputs in [`PROMPTS.md`](file:///home/jhenderzon/Documents/Work/boilerplate-maria/PROMPTS.md).
- [x] 5.2 Execute Biome formatting and linting check (`npm run lint`) in `front/`.
- [x] 5.3 Run full verification across both `back/` and `front/` test suites.
