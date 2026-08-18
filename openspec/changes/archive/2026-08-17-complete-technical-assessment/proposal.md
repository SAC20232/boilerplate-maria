# Change Proposal: complete-technical-assessment

## 1. Overview & Objectives
Full resolution and verification of the MarIA SaaS technical assessment, addressing 6 core bugs and 3 bonus features across frontend, backend, and prompt engineering documentation.

## 2. Scope of Changes

### Core Bug Fixes
| Component | Issue | File | Fix Description |
|---|---|---|---|
| Backend | `POST /contratos` returns 404 | `back/src/routes/contratos.js` | Register missing `POST /` route handler |
| Backend | `GET /contratos/:id` duplicate query | `back/src/controllers/contratosController.js` | Remove redundant SQL query execution |
| Backend | `DB_PATH` undefined | `.env` / `back/src/config/db.js` | Configure and load `DB_PATH` properly |
| Frontend | Modal remains open on submit | `front/src/components/ContratoModal.jsx` | Uncomment `onClose()` on success |
| Frontend | Table overflow on mobile | `front/src/pages/Contratos.jsx` | Add `overflow-x-auto` wrapper |
| Frontend | Validation condition inverted | `front/src/components/ContratoModal.jsx` | Invert incorrect validation logic |

### Bonus Features
- **Frontend Form Validation**: Enforce digits-only phone numbers, reservation date >= today, and required field error messages in `ContratoModal.jsx`.
- **Backend Search & Filtering**: Support `status` and partial case-insensitive `nombre` query params on `GET /contratos`, preserving pagination metadata.
- **Prompt Engineering**: Complete `PROMPTS.md` with AI prompt context, templates, rationale, and outputs for SQL seed data and email drafting.

## 3. Impacted Capabilities
- **`contracts-management`**: Core CRUD operations, lifecycle state transitions (`Pendiente de firma`, `Firmado`, `Cancelado`), and email simulation.
- **`contracts-search-filter`**: Multi-criteria query filtering (`status`, `nombre`) with pagination metadata.
- **`contracts-validation`**: Frontend inline validation and backend Joi schema constraints.

## 4. Implementation Approach
- **Backend**: Register missing route in `contratos.js`; refactor `contratosController.js` for clean query fetching and parameterized dynamic WHERE filters; ensure `.env` loading.
- **Frontend**: Correct modal event handlers and validation predicates in `ContratoModal.jsx`; add responsive table container in `Contratos.jsx`.
- **Documentation**: Verify prompt engineering deliverables in `PROMPTS.md`.

## 5. Risks & Mitigations
- **SQL Injection in dynamic filters**: Use parameterized SQLite queries (`?` placeholders).
- **Pagination count drift**: Execute separate filtered count query alongside data query.
- **Date timezone mismatches**: Normalize dates to `YYYY-MM-DD` strings for comparisons.

## 6. Rollback Plan
- Revert commits via Git on `back/`, `front/`, `.env`, and `PROMPTS.md`.
- Reset SQLite database to initial state if needed.

## 7. Acceptance Criteria
- [ ] `POST /contratos` creates contracts and returns HTTP 201.
- [ ] `GET /contratos/:id` returns a single contract without duplicate queries.
- [ ] `DB_PATH` is properly loaded from environment variables.
- [ ] Modal closes on submission; inline validation errors render correctly.
- [ ] Contratos table is horizontally scrollable on mobile viewports.
- [ ] Phone accepts only digits; reservation date rejects past dates.
- [ ] `GET /contratos?status=...&nombre=...&page=...` filters accurately with pagination.
- [ ] `PROMPTS.md` contains structured prompt documentation.
- [ ] All backend and frontend test suites pass (`npm test`).
