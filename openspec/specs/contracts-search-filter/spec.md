# Capability Specification: contracts-search-filter

## 1. Overview
The `contracts-search-filter` capability provides search, multi-criteria filtering, and paginated retrieval for hotel guest contracts in the MarIA SaaS platform. It enables efficient lookup by status and customer name while ensuring accurate pagination metadata across all query combinations.

## 2. Requirements & Normative Rules

### 2.1 Status Query Filtering
- `GET /contratos` MUST accept an optional query parameter `status`.
- When `status` is provided, the server MUST filter records where `status = ?` matches the specified value (e.g., `'Pendiente de firma'`, `'Firmado'`, `'Cancelado'`).
- The status filter MUST apply to both the data query and the total count query.

### 2.2 Customer Name Filtering
- `GET /contratos` MUST accept an optional query parameter `nombre`.
- When `nombre` is provided, the server MUST perform a case-insensitive partial substring match against both `nombre` and `apellidos` using parameterized SQL: `(nombre LIKE ? OR apellidos LIKE ?)` with `%${nombre}%`.
- The name filter MUST apply to both the data query and the total count query.

### 2.3 Combined Filter Logic & Security
- When both `status` and `nombre` query parameters are provided, the server MUST combine them using logical `AND`.
- All dynamic query parameters MUST use parameterized placeholders (`?`) to prevent SQL injection attacks.

### 2.4 Pagination Metadata Calculation
- `GET /contratos` MUST accept an optional `page` query parameter (default `1`).
- The page size (`limit`) MUST be fixed at `10` records per page.
- The server MUST compute `offset = (page - 1) * limit`.
- The response MUST contain a `pagination` object with:
  - `page`: Current page number (integer, >= 1).
  - `limit`: Number of records per page (integer, 10).
  - `total`: Total number of matching records in the database (integer).
  - `totalPages`: Number of total pages calculated as `Math.ceil(total / limit)` (integer, 0 when total is 0).
- Results in `data` MUST be ordered by `created_at DESC`.

### 2.5 Empty Result Handling
- When no contract records match the given filter criteria, the server MUST return HTTP status `200 OK` with:
  - `data`: Empty array `[]`.
  - `pagination`: `{ page: <page>, limit: 10, total: 0, totalPages: 0 }`.

---

## 3. Scenarios

### Scenario 1: Filter contracts by status
- **Given** the database contains contracts with various statuses (`Pendiente de firma`, `Firmado`, `Cancelado`)
- **When** the client sends a `GET` request to `/contratos?status=Firmado`
- **Then** the server returns HTTP status `200`
- **And** all items in `data` have `status="Firmado"`
- **And** `pagination.total` reflects the count of contracts with status `"Firmado"`

### Scenario 2: Filter contracts by partial first name
- **Given** the database contains a contract with `nombre="Carlos"` and `apellidos="Ramírez"`
- **When** the client sends a `GET` request to `/contratos?nombre=car`
- **Then** the server returns HTTP status `200`
- **And** the returned `data` includes the contract for Carlos Ramírez

### Scenario 3: Filter contracts by partial last name
- **Given** the database contains a contract with `nombre="María"` and `apellidos="Fernández"`
- **When** the client sends a `GET` request to `/contratos?nombre=Fernan`
- **Then** the server returns HTTP status `200`
- **And** the returned `data` includes the contract for María Fernández

### Scenario 4: Combined multi-criteria filter
- **Given** the database contains:
  - Contract A: `nombre="Jorge"`, `apellidos="López"`, `status="Cancelado"`
  - Contract B: `nombre="Jorge"`, `apellidos="Hernández"`, `status="Firmado"`
- **When** the client sends a `GET` request to `/contratos?status=Cancelado&nombre=Jorge`
- **Then** the server returns HTTP status `200`
- **And** `data` contains only Contract A
- **And** `pagination.total` equals `1`

### Scenario 5: Accurate pagination metadata calculation
- **Given** the database contains `25` matching contracts for a given query
- **When** the client sends a `GET` request to `/contratos?page=2`
- **Then** the server returns HTTP status `200`
- **And** `data` contains at most `10` records representing offset 10 to 19
- **And** `pagination.page` is `2`, `pagination.limit` is `10`, `pagination.total` is `25`, and `pagination.totalPages` is `3`

### Scenario 6: Query yielding no matching records
- **Given** no contracts exist matching `nombre="NonExistentName"`
- **When** the client sends a `GET` request to `/contratos?nombre=NonExistentName`
- **Then** the server returns HTTP status `200`
- **And** `data` is an empty array `[]`
- **And** `pagination.total` is `0` and `pagination.totalPages` is `0`
