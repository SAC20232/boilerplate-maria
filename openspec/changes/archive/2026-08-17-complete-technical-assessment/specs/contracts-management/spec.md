# Capability Specification: contracts-management

## 1. Overview
The `contracts-management` capability governs the lifecycle management of hotel guest contracts within the MarIA SaaS platform. This includes contract creation, single-record retrieval, status updates (`Pendiente de firma`, `Firmado`, `Cancelado`), contract document generation, email notification simulation, database path resolution, and responsive UI presentations.

## 2. Requirements & Normative Rules

### 2.1 Route Registration & Contract Creation
- The backend Express router MUST register `POST /contratos` pointing to the `createContrato` controller handler.
- When handling `POST /contratos`, the server MUST validate input data against the contract schema.
- Upon valid input, the server MUST insert the record with initial status `'Pendiente de firma'`.
- The server MUST generate a contract document filename via `generateContractFile(contrato)`.
- The server MUST update the database record with the generated filename and dispatch a notification email via `sendContractEmail(contrato)`.
- The endpoint MUST return HTTP status `201 Created` with the persisted contract object.

### 2.2 Single-Query Contract Retrieval (N+1 Query Elimination)
- `GET /contratos/:id` MUST execute exactly one database query (`SELECT * FROM contratos WHERE id = ?`) to retrieve the contract.
- The server MUST NOT execute redundant count or lookup queries before returning the contract.
- If the contract exists, the server MUST return HTTP status `200 OK` with the contract object.
- If the contract does not exist, the server MUST return HTTP status `404 Not Found` with `{ "error": "Contrato no encontrado", "status": 404 }`.

### 2.3 Environment Database Path Resolution
- The database connection module MUST read `process.env.DB_PATH` when initializing `DatabaseSync`.
- If `process.env.DB_PATH` is not defined or empty, it MUST fallback to `path.join(__dirname, '../../database.sqlite')`.
- The `.env` file MUST define `DB_PATH=./database.sqlite` to ensure predictable runtime resolution.

### 2.4 Modal Dismissal & Feedback on Submission
- In `ContratoModal.jsx`, when contract creation succeeds, the component MUST invoke the `onClose` callback to dismiss the modal dialog.
- The component MUST invoke `onSuccess(data)` passing the newly created contract data.
- The parent component `Contratos.jsx` MUST prepend the new contract to the list and display a transient toast notification.

### 2.5 Contract Lifecycle State Transitions & Actions
- `PATCH /contratos/:id/firmar` MUST update the contract status to `'Firmado'`, update `updated_at` to current timestamp, and return the updated contract with HTTP `200 OK`.
- `PATCH /contratos/:id/cancelar` MUST update the contract status to `'Cancelado'`, update `updated_at` to current timestamp, and return the updated contract with HTTP `200 OK`.
- `POST /contratos/:id/reenviar` MUST invoke `sendContractEmail(contrato)` and return HTTP `200 OK` with `{ "message": "Email reenviado", "status": 200 }`.
- `DELETE /contratos/:id` MUST delete the record and return HTTP `200 OK` with `{ "message": "Contrato eliminado", "status": 200 }`.

### 2.6 Responsive Mobile Table Layout
- The contracts table container in `Contratos.jsx` MUST include CSS class `overflow-x-auto`.
- The `table` element MUST have a minimum width (e.g., `min-w-[800px]`) ensuring columns remain legible and allowing horizontal scroll on mobile viewports.

---

## 3. Scenarios

### Scenario 1: Create a new contract via registered POST route
- **Given** a valid contract payload with `nombre="Carlos"`, `apellidos="Ramírez"`, `telefono="5512349876"`, `email="carlos@example.com"`, and `fecha_reserva="2026-06-15"`
- **When** the client sends a `POST` request to `/contratos`
- **Then** the server returns HTTP status `201`
- **And** the returned contract has `status="Pendiente de firma"` and a generated `contrato` filename
- **And** the contract record is persisted in the database

### Scenario 2: Retrieve single contract details with a single query
- **Given** an existing contract with ID `1` in the database
- **When** the client sends a `GET` request to `/contratos/1`
- **Then** the server returns HTTP status `200` with the contract details
- **And** exactly one SQL query is executed against the database

### Scenario 3: Attempt to retrieve a non-existent contract
- **Given** no contract exists with ID `999`
- **When** the client sends a `GET` request to `/contratos/999`
- **Then** the server returns HTTP status `404`
- **And** the response body contains `{ "error": "Contrato no encontrado", "status": 404 }`

### Scenario 4: Database connection initializes using environment DB_PATH
- **Given** `process.env.DB_PATH` is set to `./database.sqlite`
- **When** the database connection module `db.js` is loaded
- **Then** `DatabaseSync` is instantiated with the path defined in `DB_PATH`
- **And** the database tables are initialized if not already existing

### Scenario 5: Modal closes and updates UI after successful contract creation
- **Given** the `ContratoModal` is open and filled with valid contract data
- **When** the user clicks "Guardar" and the API returns HTTP 201
- **Then** `onSuccess` is called with the new contract
- **And** `onClose` is invoked, closing the modal dialog
- **And** a toast notification is displayed on the parent view

### Scenario 6: Transition contract status to Firmado
- **Given** an existing contract with ID `1` and status `"Pendiente de firma"`
- **When** the client sends a `PATCH` request to `/contratos/1/firmar`
- **Then** the server returns HTTP status `200`
- **And** the contract `status` in the database is updated to `"Firmado"`

### Scenario 7: Transition contract status to Cancelado
- **Given** an existing contract with ID `1` and status `"Pendiente de firma"`
- **When** the client sends a `PATCH` request to `/contratos/1/cancelar`
- **Then** the server returns HTTP status `200`
- **And** the contract `status` in the database is updated to `"Cancelado"`

### Scenario 8: Resend contract email
- **Given** an existing contract with ID `1`
- **When** the client sends a `POST` request to `/contratos/1/reenviar`
- **Then** the server dispatches a simulated contract email
- **And** returns HTTP status `200` with `{ "message": "Email reenviado", "status": 200 }`

### Scenario 9: Render table with responsive horizontal scrolling on narrow screens
- **Given** the user views the contracts table on a mobile screen width (< 800px)
- **When** the contracts page renders
- **Then** the table is wrapped inside an `overflow-x-auto` element
- **And** all table columns remain accessible via horizontal scrolling without viewport clipping
