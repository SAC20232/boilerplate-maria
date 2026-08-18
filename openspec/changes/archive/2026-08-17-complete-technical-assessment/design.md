# Technical Design: complete-technical-assessment

## 1. Technical Approach
The design addresses 6 core bug fixes and 3 bonus capabilities across backend, frontend, and prompt engineering tiers. It maintains zero breaking schema changes, uses SQLite parameterized queries via Node.js `node:sqlite` (`DatabaseSync`), enforces layered validation (client-side form guards + backend Joi schemas), and ensures responsive UI rendering.

## 2. Architecture Decisions
| Decision | Rationale | Tradeoffs |
|---|---|---|
| **Parameterized Dynamic WHERE Builder** | Prevents SQL injection and dynamically composes `status` and `nombre` (first + last name) filters. | Manual SQL string concatenation; mitigated by strict placeholder (`?`) arrays. |
| **Dual Query for Pagination (`COUNT` + `SELECT`)** | Keeps total record count synchronized with active filter criteria without fetching full datasets into memory. | Two database round-trips per paginated search request; negligible on indexed SQLite. |
| **Layered Input Validation** | Frontend gives instant UX feedback; backend Joi guarantees API boundary security. | Slight duplication of validation rules between React state and Joi schemas. |
| **Tailwind Responsive Table Container** | Wraps data tables in `overflow-x-auto` with fixed column baselines (`min-w-[800px]`). | Requires horizontal swipe on narrow screens instead of adaptive card stack. |

## 3. Data Flow
```
[User Browser]
      │
      ├─ 1. Form Input & Validation (ContratoModal: phone /^\d+$/, date >= today)
      │
      ├─ 2. POST /contratos ──────────────► [Express Router (contratos.js)]
      │                                                │
      │                                     3. Joi Validation (contratoSchema)
      │                                                │
      │                                     4. Insert & Generate File
      │                                                │
      │                                     5. Persist to SQLite (db.js)
      │                                                │
      │                                     6. Mock Email (emailService.js)
      │                                                │
      ◄── 7. HTTP 201 + JSON Payload ──────────────────┘
      │
[Contratos Page]
      ├─ 8. Update state ([newContrato, ...prev])
      ├─ 9. Trigger Toast Notification
      └─ 10. Close Modal (onClose())
```

## 4. File Changes
| Action | Path | Description |
|---|---|---|
| Modify | `back/src/routes/contratos.js` | Register missing `POST /` route pointing to `createContrato`. |
| Modify | `back/src/controllers/contratosController.js` | Fix duplicate queries in `getContrato`; add parameterized dynamic filters (`status`, `nombre`) and pagination in `getContratos`. |
| Modify | `back/src/database/db.js` | Ensure robust fallback resolution for `process.env.DB_PATH`. |
| Modify | `front/src/components/ContratoModal.jsx` | Fix submit closure (`onClose()`), date validation (`>= today`), and numeric-only phone regex. |
| Modify | `front/src/pages/Contratos.jsx` | Add responsive `overflow-x-auto` container with `min-w-[800px]` table width. |
| Modify | `front/src/utils/helpers.js` | Refactor helper regexes for phone and email validation. |
| Modify | `PROMPTS.md` | Document AI prompts, context, rationale, and outputs for SQL seed data and email drafting. |

## 5. Interfaces & API Contracts

### GET `/contratos`
- **Query Params**: `page` (int, default 1), `status` (string, optional), `nombre` (string, optional)
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Carlos",
      "apellidos": "Ramírez Soto",
      "telefono": "5512349876",
      "email": "carlos.ramirez@example.com",
      "fecha_reserva": "2026-06-15",
      "contrato": "contrato_1_Carlos_Ramirez.pdf",
      "status": "Pendiente de firma",
      "created_at": "2026-08-17 12:00:00",
      "updated_at": "2026-08-17 12:00:00"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

### POST `/contratos`
- **Request Body**:
```json
{
  "nombre": "Elena",
  "apellidos": "Vargas Rico",
  "telefono": "3321456987",
  "email": "elena.vargas@example.com",
  "fecha_reserva": "2026-09-15"
}
```
- **Response `201 Created`**: Returns created contract entity with `id`, `status: "Pendiente de firma"`, and generated `contrato` filename.
- **Response `400 Bad Request`**: `{ "error": "<validation message>", "status": 400 }`

## 6. Testing Strategy
- **Backend**:
  - Jest unit tests for Joi schema constraints (`contratos.test.js`).
  - Integration tests for `GET /contratos` query filters (`status`, `nombre`, pagination math) and `POST /contratos` HTTP 201 / 400 handlers.
  - SQL verification asserting single query execution on `GET /contratos/:id`.
- **Frontend**:
  - Vitest / Jest unit tests in `helpers.test.js` validating `validateEmail`, `validatePhone`, and `formatDate`.
  - Component tests for `ContratoModal` verifying submit lifecycle, error boundary rendering, and `onClose()` invocation.

## 7. Threat Matrix
| Threat | Impact | Mitigation |
|---|---|---|
| **SQL Injection (CWE-89)** | High (Data breach / tampering) | Dynamic query parameters use strict `?` positional placeholders in `node:sqlite`. |
| **Invalid Payload Injection (CWE-20)** | Medium (Corrupt state) | Backend Joi validation schema rejects malformed phone strings, invalid emails, and past reservation dates. |
| **XSS via Input Reflection (CWE-79)** | Medium (Session compromise) | React JSX automatic string escaping on all rendered table cells and toast messages. |

## 8. Migration & Rollout
1. Ensure `.env` includes `DB_PATH=./database.sqlite`.
2. Run database migration / schema initialization via `DatabaseSync`.
3. Deploy backend services with registered `POST /contratos` route.
4. Deploy frontend client build with responsive table styling and corrected form validation.
