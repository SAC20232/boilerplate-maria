# Capability Specification: contracts-validation

## 1. Overview
The `contracts-validation` capability enforces data integrity and UX feedback rules for contract creation and modification across both frontend and backend tiers. It guarantees that phone numbers conform to numeric digits, reservation dates are not in the past, required fields are present with actionable inline errors, and backend payloads adhere strictly to Joi schema definitions.

## 2. Requirements & Normative Rules

### 2.1 Frontend Phone Format Validation
- The phone field in `ContratoModal.jsx` MUST require numeric digits only (`/^\d+$/`).
- If the phone field contains non-numeric characters (such as letters, symbols, hyphens, or spaces), validation MUST fail with the error message: `"El teléfono solo debe contener números"`.
- If the phone field is empty or whitespace-only, validation MUST fail with the error message: `"El teléfono es obligatorio"`.
- The helper function `validatePhone(phone)` in `front/src/utils/helpers.js` MUST validate telephone strings and return a boolean.

### 2.2 Frontend Reservation Date Constraint
- The reservation date field (`fecha_reserva`) in `ContratoModal.jsx` MUST be on or after the current local date (`today` in `YYYY-MM-DD` format).
- If `fecha_reserva` is earlier than `today`, validation MUST fail with the error message: `"La fecha no puede ser en el pasado"`.
- If `fecha_reserva` is empty, validation MUST fail with the error message: `"La fecha de reserva es obligatoria"`.
- The date input element MUST set its `min` attribute to the current date string (`YYYY-MM-DD`) to restrict date picker selection.

### 2.3 Frontend Required Field Validation & Error Visuals
- All contract form fields (`nombre`, `apellidos`, `telefono`, `email`, `fecha_reserva`) are mandatory.
- When `nombre` is empty or whitespace-only, validation MUST fail with: `"El nombre es obligatorio"`.
- When `apellidos` is empty or whitespace-only, validation MUST fail with: `"Los apellidos son obligatorios"`.
- When `email` is empty or whitespace-only, validation MUST fail with: `"El email es obligatorio"`.
- When `email` is non-empty but does not match standard email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), validation MUST fail with: `"El email no es válido"`.
- Any field with an active validation error MUST be visually styled with a red border (`border-red-400`) and display the error message directly below the input.
- Editing an input (`onChange`) SHOULD clear the corresponding field's active error state.
- Form submission MUST be blocked if any validation error is present.

### 2.4 Backend Joi Schema Validation
- The backend MUST validate request bodies for `POST /contratos` and `PUT /contratos/:id` against a Joi schema:
  - `nombre`: `Joi.string().min(2).max(100).required()`
  - `apellidos`: `Joi.string().min(2).max(100).required()`
  - `telefono`: `Joi.string().min(6).max(20).required()`
  - `email`: `Joi.string().email().required()`
  - `fecha_reserva`: `Joi.string().isoDate().required()`
- If validation fails, the controller MUST abort execution and return HTTP status `400 Bad Request` with payload:
  `{ "error": "<error details message>", "status": 400 }`.

---

## 3. Scenarios

### Scenario 1: Reject phone number with non-digit characters in modal
- **Given** the `ContratoModal` is open
- **When** the user inputs `"55-123-4567"` in the `telefono` field and submits the form
- **Then** form submission is aborted
- **And** the `telefono` field displays the error message `"El teléfono solo debe contener números"`
- **And** the input is highlighted with error border styling

### Scenario 2: Accept valid numeric digits phone number
- **Given** the `ContratoModal` is open
- **When** the user inputs `"5512349876"` in the `telefono` field
- **Then** the phone validation passes with no error message

### Scenario 3: Reject reservation date set in the past
- **Given** current date is `2026-08-17`
- **When** the user selects `fecha_reserva="2026-05-01"` in `ContratoModal` and submits
- **Then** form submission is aborted
- **And** the `fecha_reserva` field displays the error message `"La fecha no puede ser en el pasado"`

### Scenario 4: Accept reservation date set today or in future
- **Given** current date is `2026-08-17`
- **When** the user selects `fecha_reserva="2026-08-17"` or `fecha_reserva="2026-09-01"`
- **Then** date validation passes with no error message

### Scenario 5: Reject empty form submission and show all required field errors
- **Given** the `ContratoModal` is open with all fields empty
- **When** the user clicks "Guardar"
- **Then** form submission is aborted
- **And** inline error messages are displayed for `nombre`, `apellidos`, `telefono`, `email`, and `fecha_reserva`
- **And** no API request is dispatched

### Scenario 6: Validate email format in frontend and backend
- **Given** the user inputs `"invalid-email-address"` in the `email` field
- **When** the user submits the modal form
- **Then** the frontend displays `"El email no es válido"`
- **And** when sent directly to backend `POST /contratos`, the backend returns HTTP 400 with email validation error

### Scenario 7: Successful backend Joi schema validation
- **Given** a request body with:
  ```json
  {
    "nombre": "Elena",
    "apellidos": "Vargas",
    "telefono": "3321456987",
    "email": "elena.vargas@example.com",
    "fecha_reserva": "2026-09-15"
  }
  ```
- **When** the payload is validated against `contratoSchema`
- **Then** the validation result contains no error
- **And** the controller proceeds with database insertion
