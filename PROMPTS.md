# Documentación de Prompt Engineering & Arquitectura con Agentes de IA

**Candidato:** Evaluación Técnica Fullstack — MarIA SaaS  
**Metodología:** Prompt Engineering Estructurado + Spec-Driven Development (SDD) + Orquestación de Agentes de IA  

---

## 1. Estrategia y Enfoque de Prompt Engineering

Para resolver esta prueba técnica, no se utilizó la IA como un generador de código aislado o de "caja negra". Como **Senior Engineer / Architect**, el enfoque fue dirigir a la IA a través de **Prompt Engineering avanzado y metodológico**, asegurando:

1. **Context Injection & System Framing**: Contextualizar a la IA con el stack exacto (Node 24 `node:sqlite DatabaseSync`, Express, React 18, Vite, Jest, Biome) antes de solicitar cualquier cambio.
2. **Role & Constraint Prompting**: Forzar a la IA a actuar bajo roles específicos (System Architect, QA Engineer, TDD Implementer) con restricciones estrictas de no-regresión y seguridad (ej. SQL parametrizado contra CWE-89).
3. **Spec-Driven Development (SDD)**: Guiar a la IA a través de un ciclo formal por fases (**Diagnóstico $\rightarrow$ Propuesta $\rightarrow$ Especificación $\rightarrow$ Diseño $\rightarrow$ Tareas TDD $\rightarrow$ Implementación $\rightarrow$ Verificación**), impidiendo que escriba código antes de tener contratos y pruebas definidos.
4. **Iterative Refinement & Verification Gates**: Cada prompt de ejecución estuvo condicionado a la validación mediante suites de pruebas automatizadas (`npm test`) y linters (`biome check`).

---

## 2. Prompts Utilizados para las Tareas de la Prueba

A continuación se documentan los prompts clave formulados a la IA para guiar la resolución de los bugs core, las funcionalidades bonus y la verificación del sistema.

---

### Prompt 1: Inicialización, Diagnóstico y Detección de Stack (`/sdd-init`)

**Tarea:** Analizar la arquitectura del repositorio completo, descubrir linters, frameworks de prueba y dependencias en backend y frontend para establecer la línea base sin alterar código.

#### Contexto dado a la IA
Se le instruyó a la IA que inspeccionara la raíz del proyecto `boilerplate-maria/`, leyendo `package.json`, `README.md`, configuraciones de Jest, Biome y la estructura monorepo (`front/` y `back/`).

#### Prompt
```text
Actúa como Lead Software Architect. Analiza exhaustivamente este repositorio monorepo de prueba técnica:
1. Inspecciona back/ y front/ para identificar versiones exactas de runtime (Node.js, Express, React, Vite), motores de base de datos (SQLite / node:sqlite) y suites de prueba (Jest, Biome).
2. Detecta todas las discrepancias de configuración inicial (.env, dependencias, scripts de prueba).
3. Configura el marco de trabajo OpenSpec (openspec/) para gobernar el desarrollo guiado por especificaciones.
4. No modifiques código de negocio en este paso. Entrega un informe de diagnóstico de capacidades y riesgos.
```

#### Por qué se estructuró así
- **Restricción de No Modificación**: Asegura que la IA entienda el estado actual y sus dependencias antes de proponer cambios.
- **Detección de Motor de DB**: Permitió descubrir que el backend utiliza `node:sqlite DatabaseSync` nativo de Node.js, lo que requería manejo estricto de tipos en parámetros de SQL.

#### Refinamiento / Iteración
La IA identificó inicialmente un entorno Node tradicional; se le forzó a validar la configuración experimental de módulos VM para Jest en el frontend (`--experimental-vm-modules`).

#### Resultado Obtenido
Diagnóstico completo, mapeo de capacidades de prueba y árbol de trabajo inicializado en `openspec/config.yaml`.

---

### Prompt 2: Definición de Especificaciones y Diseño de Arquitectura (`/sdd-spec` y `/sdd-design`)

**Tarea:** Modelar formalmente las correcciones de los 6 bugs y las 3 funcionalidades bonus en especificaciones normativas y diseño técnico antes de escribir código.

#### Contexto dado a la IA
Se suministraron los requerimientos del `README.md` divididos en 3 dominios funcionales (`contracts-management`, `contracts-search-filter`, `contracts-validation`) y se exigieron escenarios BDD/Gherkin y contratos de API.

#### Prompt
```text
Actúa como Requirements Engineer & System Architect.
Diseña la solución técnica y redacta las especificaciones para los siguientes requerimientos:

1. contracts-management (6 Core Bugs):
   - Registro de POST /contratos en back/src/routes/contratos.js con código HTTP 201.
   - Eliminación de consulta duplicada (N+1) en GET /contratos/:id en contratosController.js.
   - Resolución robusta de DB_PATH en .env y fallback en db.js.
   - Cierre de modal (onClose) al guardar y solución de lógica invertida en ContratoModal.jsx.
   - Envoltura responsive (overflow-x-auto min-w-[800px]) en la tabla de Contratos.jsx.

2. contracts-search-filter (Bonus Backend):
   - Soporte para query params `status` y `nombre` (case-insensitive en nombre y apellidos).
   - Construcción de SQL dinámico estrictamente PARAMETRIZADO con placeholders '?' (CWE-89 mitigation).
   - Sincronización exacta de total y totalPages en la metadata de paginación.

3. contracts-validation (Bonus Frontend):
   - Teléfono estrictamente numérico (/^\d+$/, 6 a 20 dígitos).
   - Fecha de reserva obligatoria y >= hoy (formato YYYY-MM-DD).
   - Mensajes y bordes de error inline (border-red-400) en campos vacíos al hacer submit.

Define escenarios de prueba en formato Gherkin (Given/When/Then) para cada caso.
```

#### Por qué se estructuró así
- **Desacoplamiento de Especificación vs Implementación**: Evita que la IA asuma comportamientos arbitrarios.
- **Seguridad Explícita**: La indicación expresa de usar `?` para parámetros de SQL garantiza que la IA no recurra a concatenación de strings vulnerable a SQL Injection.

#### Refinamiento / Iteración
Se refinó la regla de búsqueda por nombre para que evaluara tanto `nombre` como `apellidos` mediante `(nombre LIKE ? OR apellidos LIKE ?)`, asegurando una experiencia de usuario natural.

#### Resultado Obtenido
Especificaciones normativas en `openspec/specs/` con 22 escenarios de prueba y documento de diseño en `design.md`.

---

### Prompt 3: Implementación Guiada por Pruebas (TDD) en Backend (`/sdd-apply`)

**Tarea:** Corregir los bugs de backend, implementar el filtrado dinámico parametrizado y expandir la suite de pruebas unitarias/integración en Jest.

#### Contexto dado a la IA
Se le proporcionó el archivo `back/src/controllers/contratosController.js`, `back/src/routes/contratos.js`, `back/src/database/db.js` y `back/tests/contratos.test.js`.

#### Prompt
```text
Actúa como Senior Backend Developer aplicando estricta metodología TDD:
1. En back/src/database/db.js y back/.env, asegura que DB_PATH=./database.sqlite sea cargado correctamente con fallback seguro.
2. En back/src/routes/contratos.js, registra la ruta POST / apuntando a createContrato.
3. En back/src/controllers/contratosController.js:
   - Refactoriza getContrato para usar una sola consulta SQLite (elimina query redundante).
   - Implementa en getContratos el filtrado dinámico por `status` y `nombre` (parcial en nombre y apellidos) usando parámetros posicionales '?' con array de valores.
   - Realiza una consulta separada `SELECT COUNT(*) as count` con los mismos filtros para sincronizar pagination.total y totalPages.
4. En back/tests/contratos.test.js, escribe pruebas unitarias y de integración para cada uno de estos escenarios (CRUD, filtros combinados, edge cases de paginación y validación Joi).
5. Ejecuta `npm test` en back/ y no te detengas hasta que el 100% de las pruebas estén en verde (PASS).
```

#### Por qué se estructuró así
- **Enfoque TDD**: Obliga a la IA a escribir las pruebas y ejecutar el test runner para validar su propio código antes de dar la tarea por concluida.
- **Instrucción de Paginación Dual**: Garantiza que `totalPages` no quede desfasado cuando se apliquen filtros que reduzcan el total de registros.

#### Refinamiento / Iteración
- **Iteración 1**: `node:sqlite` arrojó `TypeError: Provided value cannot be bound to SQLite parameter` cuando se pasaban valores `undefined`.
- **Refinamiento**: Se instruyó a la IA construir el array de bindings condicionalmente (`if (status) queryParams.push(status); if (nombre) queryParams.push(...)`), resolviendo el error de tipos.

#### Resultado Obtenido
Backend 100% funcional con **19/19 pruebas Jest pasando** (`cd back && npm test`).

---

### Prompt 4: Implementación Frontend, Validaciones y Responsive Design

**Tarea:** Corregir los bugs de frontend, implementar validaciones avanzadas, soporte responsive en móviles y asegurar accesibilidad Biome.

#### Contexto dado a la IA
Archivos `front/src/components/ContratoModal.jsx`, `front/src/pages/Contratos.jsx`, `front/src/utils/helpers.js` y `front/src/tests/helpers.test.js`.

#### Prompt
```text
Actúa como Senior Frontend Engineer (React 18 + TailwindCSS + Biome):
1. En front/src/utils/helpers.js:
   - Implementa validatePhone(phone) que valide estrictamente dígitos numéricos (/^\d+$/) entre 6 y 20 caracteres.
   - Implementa isDateTodayOrFuture(dateStr) comparando contra la fecha actual en formato ISO (YYYY-MM-DD).
2. En front/src/components/ContratoModal.jsx:
   - Corrige la lógica de validación invertida y muestra mensajes de error debajo de cada campo obligatorio vacío al enviar el formulario.
   - Agrega bordes dinámicos de error (border-red-400) cuando un campo tenga error activo y límpialos en onChange.
   - Asegura que onClose() se invoque tras una creación exitosa (HTTP 201).
3. En front/src/pages/Contratos.jsx:
   - Envuelve la tabla en un contenedor `<div className="overflow-x-auto">` con tabla `<table className="w-full text-sm min-w-[800px]">` para evitar desbordamientos en pantallas móviles.
   - Memoiza fetchContratos con useCallback para cumplir con las reglas de efectos de React y Biome.
   - Agrega `type="button"` explícito en botones no-submit y etiquetas `<title>` en iconos SVG para accesibilidad.
4. En front/src/tests/helpers.test.js:
   - Escribe pruebas unitarias exhaustivas para validatePhone, isDateTodayOrFuture, validateEmail y formatDate.
5. Ejecuta `npm test` y `npm run lint` en front/ asegurando 0 errores.
```

#### Por qué se estructuró así
- **Cobertura Integral**: Cubre corrección funcional, validaciones bonus, responsive design y accesibilidad en un solo marco coherente.
- **Cumplimiento de Linter**: Instrucciones explícitas sobre `type="button"`, dependencias de `useEffect` y SVG `<title>` para garantizar conformidad con Biome.

#### Refinamiento / Iteración
- **Iteración 1**: Jest en frontend fallaba en `toBeInstanceOf(Array)` por límites de módulos VM en Node experimental.
- **Refinamiento**: Se cambió la aserción a `Array.isArray(result)` en las pruebas auxiliares.

#### Resultado Obtenido
Frontend 100% funcional con **11/11 pruebas unitarias pasando** y **0 errores de Biome** (`npm test && npm run lint`).

---

### Prompt 5: Generación de Datos de Prueba SQL (Bonus Prompt Engineering)

**Tarea:** Generar 10 registros ficticios y consistentes para poblar la base de datos de contratos.

#### Prompt
```text
Actúa como Database Administrator. Genera 10 registros ficticios pero realistas para la tabla SQLite `contratos`.
Campos obligatorios: nombre, apellidos, telefono (10 dígitos de México, solo números), email, fecha_reserva (fechas a partir de junio de 2026) y status ('Pendiente de firma', 'Firmado', 'Cancelado').
Entrega exclusivamente la sentencia SQL `INSERT INTO contratos (...) VALUES ...` lista para ejecutarse.
```

#### Por qué se estructuró así
Se definió el rol técnico y el formato de salida puro en SQL para evitar tener que convertir arrays o tablas a código SQL manualmente.

#### Resultado Obtenido
```sql
INSERT INTO contratos (nombre, apellidos, telefono, email, fecha_reserva, status) VALUES 
('Carlos', 'Ramírez Soto', '5512349876', 'carlos.ramirez@example.com', '2026-06-15', 'Pendiente de firma'),
('María', 'Fernández Ruiz', '3387654321', 'maria.fernandez@example.com', '2026-05-20', 'Firmado'),
('Jorge', 'López Vega', '8190908765', 'jorge.lopez@example.com', '2026-07-02', 'Cancelado'),
('Ana', 'Torres Mendieta', '5567675432', 'ana.torres@example.com', '2026-05-28', 'Firmado'),
('Luis', 'García Pimentel', '3345456789', 'luis.garcia@example.com', '2026-06-10', 'Pendiente de firma'),
('Diana', 'Cortés Alba', '8123234567', 'diana.cortes@example.com', '2026-07-12', 'Firmado'),
('Roberto', 'Márquez Solís', '5534567890', 'roberto.marquez@example.com', '2026-05-22', 'Cancelado'),
('Elena', 'Vargas Rico', '3321456987', 'elena.vargas@example.com', '2026-06-05', 'Firmado'),
('Arturo', 'Castillo Bueno', '8111223344', 'arturo.castillo@example.com', '2026-07-20', 'Pendiente de firma'),
('Sofía', 'Navarro del Río', '5588776655', 'sofia.navarro@example.com', '2026-08-01', 'Firmado');
```

---

### Prompt 6: Redacción de Plantilla de Email Transaccional (Bonus Prompt Engineering)

**Tarea:** Redactar el cuerpo del correo de notificación de contrato para `emailService.js`.

#### Prompt
```text
Actúa como Copywriter Senior en hotelería de lujo para 'MarIA SaaS'.
Redacta una plantilla de correo electrónico formal y cálida para enviar a un huésped su contrato de reservación para firma digital.
Incluye interpolación nativa de JavaScript: ${contrato.nombre}, ${contrato.apellidos} y ${contrato.fecha_reserva}.
Entrega la plantilla directamente en un Template Literal de JavaScript (` `) listo para ser asignado en emailService.js.
```

#### Por qué se estructuró así
El uso de interpolación nativa `${}` permitió insertar el texto generado directamente en `back/src/services/emailService.js` sin refactorizaciones intermedias.

#### Resultado Obtenido (Integrado en `emailService.js`)
```javascript
const emailBody = `
Estimado/a ${contrato.nombre} ${contrato.apellidos},

Esperamos que se encuentre muy bien.

En nombre de MarIA SaaS y nuestro hotel asociado, nos alegra confirmar los detalles iniciales de su próxima estadía. Adjunto encontrará su contrato de reservación para la fecha: ${contrato.fecha_reserva}.

Por favor, revise detenidamente la información y, en caso de estar de acuerdo, proceda con la firma electrónica del documento para asegurar su espacio con nosotros.

Si tiene alguna duda con el contrato o su reservación, responder a este correo será suficiente para ponernos en contacto con usted.

Agradecemos su preferencia y esperamos darle la bienvenida pronto.

Atentamente,
El equipo de MarIA SaaS
`;
```

---

### Prompt 7: Verificación Formal y Calidad Final (`/sdd-verify`)

**Tarea:** Ejecutar una auditoría independiente de calidad que contraste todo el código implementado contra los 22 escenarios de especificación y ejecute todas las pruebas automatizadas.

#### Prompt
```text
Actúa como Independent QA Verifier & Quality Gate.
Ejecuta la fase formal /sdd-verify para el cambio complete-technical-assessment:
1. Revisa que todas las tareas en tasks.md estén completadas ([x]).
2. Ejecuta `cd back && npm test`, `cd front && npm test` y `cd front && npm run lint`.
3. Construye la matriz de conformidad de comportamiento mapeando los 22 escenarios de las capacidades contracts-management, contracts-search-filter y contracts-validation con su prueba correspondiente.
4. Genera el reporte formal openspec/changes/complete-technical-assessment/verify-report.md y emite el veredicto oficial (PASS o FAIL).
```

#### Resultado Obtenido
Reporte `verify-report.md` emitido con veredicto **`PASS`** (100% de escenarios conformes, 30/30 pruebas automatizadas pasando).

---

## 3. Uso de la Metodología SDD y Arquitectura de Agentes

### ¿Por qué SDD (Spec-Driven Development)?
En un entorno profesional o de producción, el desarrollo asistido por IA requiere **disciplina de ingeniería**:
- **Especificaciones como Fuente de Verdad**: Los contratos y reglas de negocio se definen en Markdown versionable (`openspec/specs/`) antes de alterar el código.
- **Eliminación del Sesgo de Confirmación**: La fase de verificación (`sdd-verify`) evalúa el comportamiento de forma independiente a la fase de implementación (`sdd-apply`).
- **Trazabilidad y Auditoría**: El cambio se archiva formalmente en `openspec/changes/archive/` preservando el historial de decisiones técnicas.

### Orquestación Multi-Agente con Memoria Persistente (Engram MCP)
Durante la sesión, el candidato orquestó subagentes especializados mediante llamadas al sistema y coordinó la persistencia de decisiones en **Engram (MCP Server)**:
- **Agentes Especializados**: `sdd-init` (Diagnóstico), `sdd-propose` (Alcance), `sdd-spec` (Especificación), `sdd-design` (Arquitectura), `sdd-tasks` (Planificación TDD), `sdd-apply` (Implementación), `sdd-verify` (Auditoría QA) y `sdd-archive` (Cierre y Release).
- **Memoria Contextual Persistente**: Cada decisión técnica (prevención de inyección SQL, tipo de bindings en SQLite, estructura de validaciones) fue almacenada en Engram (`sdd/complete-technical-assessment/...`), permitiendo que todos los subagentes compartieran el mismo contexto sin pérdida de información ni alucinaciones.

---

## 4. Resumen de Métricas de Calidad Entregadas

| Métrica | Estado | Detalle |
|---|---|---|
| **Bugs Core Backend Resueltos** | 3 / 3 | `POST /contratos` (201), N+1 eliminado en `GET /:id`, `DB_PATH` configurado. |
| **Bugs Core Frontend Resueltos** | 3 / 3 | Cierre de modal `onClose()`, tabla responsive `overflow-x-auto`, validación invertida corregida. |
| **Funcionalidades Bonus** | 3 / 3 | Validaciones avanzadas (`/^\d+$/`, fecha $\ge$ hoy), filtrado backend dinámico parametrizado, Prompt Docs. |
| **Pruebas Automatizadas Backend** | **19 / 19 PASS** | Jest unit & integration tests (`back/tests/contratos.test.js`). |
| **Pruebas Automatizadas Frontend** | **11 / 11 PASS** | Jest unit tests (`front/src/tests/helpers.test.js`). |
| **Análisis Estático / Linter** | **0 Errores** | Biome check y formateo limpio en 13 archivos. |
| **Veredicto Final SDD** | **`PASS`** | Certificado en `verify-report.md` y archivado en `openspec/`. |