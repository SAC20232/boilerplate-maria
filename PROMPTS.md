# PROMPTS.md

Documenta los prompts que utilizaste para las siguientes tareas. Sigue la estructura indicada para cada uno.

---

## Prompt 1: Generación de datos de prueba

**Tarea:** Generar 10 registros realistas para la tabla de contratos (nombre, apellidos, teléfono, email, fecha_reserva, status).

### Contexto dado a la IA
<!-- Qué información le proporcionaste: stack, estructura de la tabla, restricciones, etc. -->
La información escencial que le proporcioné a la inteligencia artificial fue acerca de qué trataba la aplicación (en este caso una aplicación para hotel), indiqué específicamente con qué tecnología estaba hecha la base de datos (si bien, decir que use sentencia SQL podría ser suficiente, puede haber diferencias entre sintaxis de bases de datos), así mismo, le proporcioné com tal la estructura de la tabla, y las restricciones de los datos (datos realistas, correos válidos, números de teléfono de 10 dígitos y status válidos).

### Prompt
<!-- Escribe aquí el texto exacto que usaste -->
Necesito que me ayudes con una tarea.
Tu rol es el de un agente de reservas de un hotel, aunque tienes unos cuantos conocimientos en base de datos.

Necesito que me ayudes a generar 10 registros de prueba realistas para la tabla de contratos de una base de datos.

La aplicación donde se usa la base de datos es un sistema SaaS del Hotel Boutique del Mar. La base de datos está hecha en SQLite, y cuenta con la siguiente estructura:
```sql
CREATE TABLE IF NOT EXISTS contratos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    fecha_reserva DATE NOT NULL,
    contrato TEXT,
    status TEXT DEFAULT 'Pendiente de firma',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
```
Las restricciones son que tanto el email como el número de teléfono deben de ser válidos, además de que el número debe de contar únicamente con 10 dígitos numéricos, y los status válidos son "Firmado", "Pendiente de firma" y "Cancelado".

Entonces, dame la consulta para hacer los 10 registros por favor.

### Por qué lo estructuraste así
El rol de agente de reservas permite redactar el campo de contrato y demás información como lo sería en un ambiente real, indiqué la tarea de manera simple, en el contexto indiqué los campos y restricciones con el fin de que me retornara la consulta con una sintaxis SQL compatible con la base de datos, y en el resultado indiqué precisamente lo que quería, una consulta SQL.

### Segunda iteración (si aplica)
<!-- Si el primer resultado no fue ideal, ¿cómo refinaste el prompt? -->
No aplica

### Resultado obtenido
<!-- Pega aquí los datos generados -->
¡Hola! Qué gusto saludarte. Claro que sí, con mi sombrero de agente de reservas del *Hotel Boutique del Mar* (y un poco de maña con las bases de datos), te armo esos registros de prueba en un santiamén.

Para que los datos se vean súper realistas para nuestro hotel, consideré lo siguiente:

* **Fechas de reserva:** Distribuidas en fechas recientes (mayo de 2026).
* **Teléfonos:** Exactamente de 10 dígitos numéricos (formato típico de México, que encaja perfecto con el ambiente de hotel de playa).
* **Correos:** Estructuras válidas y variadas (`.com`, `.net`, `.org`).
* **Estados:** Distribuidos entre 'Firmado', 'Pendiente de firma' y 'Cancelado', respetando tus restricciones.
* **Fechas de auditoría (`created_at`, `updated_at`):** Aunque tienen valores por defecto en tu definición, los incluí explícitamente en el `INSERT` usando `DATETIME('now')` para que los registros queden con la estampa de tiempo exacta del momento en que los corras.

Aquí tienes la consulta lista para ejecutar en tu base de datos SQLite:

```sql
INSERT INTO contratos (nombre, apellidos, telefono, email, fecha_reserva, contrato, status, created_at, updated_at) 
VALUES 
('Alejandro', 'Gómez Ruiz', '5512345678', 'alejandro.gomez@email.com', '2026-05-15', 'Contrato de hospedaje - Habitación Deluxe Vista al Mar', 'Firmado', DATETIME('now'), DATETIME('now')),

('Mariana', 'López Hernández', '8119876543', 'mariana.lopez@webmail.net', '2026-05-18', 'Contrato de hospedaje - Suite Presidencial', 'Pendiente de firma', DATETIME('now'), DATETIME('now')),

('Carlos', 'Martínez Castro', '3322114455', 'carlos.mtz@Servicio.org', '2026-05-10', 'Contrato de evento - Renta de terraza para boda', 'Firmado', DATETIME('now'), DATETIME('now')),

('Sofía', 'Rodríguez Peña', '4423456789', 'sofia.rodriguez@outlook.com', '2026-05-19', 'Contrato de hospedaje - Habitación Estándar King', 'Pendiente de firma', DATETIME('now'), DATETIME('now')),

('Ricardo', 'Sánchez Tovar', '2227654321', 'ricardo.sanchez@gmail.com', '2026-05-01', 'Contrato de hospedaje - Bungalow Familiar', 'Cancelado', DATETIME('now'), DATETIME('now')),

('Lucía', 'Fernández Vega', '9991239876', 'lucia.fer@Proton.me', '2026-05-12', 'Contrato de hospedaje - Suite con Jacuzzi', 'Firmado', DATETIME('now'), DATETIME('now')),

('Diego', 'Ramírez Ortiz', '7774561230', 'diego.ramirez@empresa.com', '2026-05-17', 'Contrato corporativo - Bloque de 5 habitaciones', 'Pendiente de firma', DATETIME('now'), DATETIME('now')),

('Elena', 'Torres Méndez', '6649873210', 'elena.torres@yahoo.com', '2026-05-05', 'Contrato de hospedaje - Habitación Deluxe Vista al Mar', 'Cancelado', DATETIME('now'), DATETIME('now')),

('Javier', 'Vázquez Esparza', '4776540987', 'javier.vazquez@Hotmail.com', '2026-05-14', 'Contrato de hospedaje - Habitación Estándar Doble', 'Firmado', DATETIME('now'), DATETIME('now')),

('Gabriela', 'Jiménez Luna', '6563217890', 'gaby.jimenez@icloud.com', '2026-05-20', 'Contrato de hospedaje - Suite Presidencial', 'Pendiente de firma', DATETIME('now'), DATETIME('now'));

```

Espero que estos huéspedes de prueba te sirvan para dejar a punto el sistema SaaS del hotel. Si necesitas armar alguna consulta intermedia (como un trigger para actualizar automáticamente el `updated_at` cuando cambien de estado a "Firmado"), avísame y lo revisamos. ¡Éxito con la tarea!

---

## Prompt 2: Mensaje de email profesional

**Tarea:** Redactar el cuerpo del email que simula el envío del contrato al huésped (el que actualmente hace `console.log` en `emailService.js`).

### Contexto dado a la IA
<!-- Qué información le proporcionaste: tono, destinatario, datos del contrato disponibles, etc. -->
Para la herramienta, indiqué para quién va dirigido el correo y el contexto en el que está escrito el correo (es decir, la plantilla del correo es para una aplicación de hotel, y el correo indica el contrato para el huésped), además de indicar los campos dinámicos del correo (como tal no se dio la tabla SQL, simplemente se le dió el nombre de los atributos que contiene la tabla).

### Prompt
<!-- Escribe aquí el texto exacto que usaste -->
Necesito que me ayudes con algo.
Tu rol es el de un agente de reservas.

Necesito que me ayudes a redactar una plantilla de cuerpo de correo.

La plantilla de correo es para una aplicación SaaS de un Hotel destinado para el huésped del contrato, además adjunta el contrato en el correo (que es una cadena de texto). Se cuenta con la información del nombre, apellidos, teléfono y correo del huesped, la fecha de reservación, el contrato en sí y el status del contrato. Emplea un tono cordial. La aplicación se llama MarIA.

Necesito que me des el contrato como una cadena de texto de Java Script por favor

### Por qué lo estructuraste así
Escogí esta vez el rol de agente de ventas con el fin de que la herramienta redactara con el lenguaje que se usaría en el ambiente de hotelería, para el contexto, se le indicó con qué fin era el correo y dónde se usaría la plantilla, además del nombre de la aplicación, y para el formato de salida, se pidió una cadena de texto de Java Script para facilitar su implementación en el código.

### Segunda iteración (si aplica)
<!-- Si el primer resultado no fue ideal, ¿cómo refinaste el prompt? -->
No aplica

### Resultado obtenido
<!-- Pega aquí el texto del email generado e intégralo en emailService.js -->
¡Hola! Con gusto nos ponemos la camiseta de agente de reservas de **MarIA**.

La clave para una plantilla SaaS de hotelería es que sea sumamente clara, le de seguridad al huésped al recibir su documentación y mantenga ese trato impecable y hospitalario.

Aquí tienes la estructura del correo y, justo abajo, el código en JavaScript con los datos organizados en variables y el contrato formateado como una cadena de texto (usando *template literals* para que conserve los saltos de línea perfectamente).

---

## 📩 Estructura del Correo

**Asunto:** Confirmación de Reserva y Envío de Contrato de Hospedaje - MarIA

**Cuerpo:**

*(El contenido dinámico se generará con el script de abajo, manteniendo un tono cálido, profesional y transparente sobre el estatus de su trámite).*

---

## 💻 Implementación en JavaScript

```javascript
// 1. Información del Huésped y de la Reservación
const huesped = {
    nombre: "Carlos Fabricio",
    apellidos: "Molina Mendoza",
    telefono: "+52 961 123 4567",
    correo: "carlos.molina@email.com"
};

const reservacion = {
    fecha: "20 de Mayo de 2026",
    statusContrato: "Pendiente de Firma" // Puede ser: "Firmado", "Pendiente de Firma", "En Revisión"
};

// 2. El Contrato como cadena de texto (Template Literal)
const contratoTexto = `CONTRATO DE SERVICIOS DE HOSPEDAJE
=========================================
Este documento certifica el acuerdo de hospedaje celebrado entre el Complejo Hotelero MarIA y el Huésped registrado.

1. PARTES:
   - Prestador: Sistema de Gestión MarIA / Complejo Hotelero.
   - Huésped: ${huesped.nombre} ${huesped.apellidos}.
   - Contacto: ${huesped.telefono} | ${huesped.correo}.

2. OBJETO DEL CONTRATO:
   El Prestador se obliga a brindar el servicio de alojamiento temporal de acuerdo con la reservación registrada el día ${reservacion.fecha}.

3. TÉRMINOS Y CONDICIONES:
   - El uso de las instalaciones está sujeto al reglamento interno del hotel.
   - Toda modificación o cancelación se regirá bajo las políticas SaaS de MarIA aceptadas al momento de la cotización.
   
Estatus actual del documento: [${reservacion.statusContrato.toUpperCase()}]
=========================================`;

// 3. Generación de la plantilla del Cuerpo del Correo
const cuerpoCorreo = `
Estimado(a) ${huesped.nombre} ${huesped.apellidos},

Esperamos que se encuentre muy bien. 

A nombre de todo el equipo de MarIA, queremos agradecerle su preferencia y confianza al elegirnos para su próxima estancia. Nos complace informarle que su solicitud de reservación para el día ${reservacion.fecha} ha sido procesada con éxito en nuestra plataforma.

Como parte de nuestro compromiso con la transparencia y la excelencia en el servicio, adjuntamos a este mensaje el texto íntegro de su Contrato de Hospedaje. Le recordamos que el estatus actual de dicho documento es: **${reservacion.statusContrato}**.

A continuación, puede revisar los detalles del acuerdo:

-----------------------------------------------------------------------
${contratoTexto}
-----------------------------------------------------------------------

Por favor, revise que toda la información concuerde con sus requerimientos. Si tiene alguna duda con respecto a las cláusulas o si necesita actualizar sus datos de contacto (${huesped.telefono}), no dude en responder directamente a este correo o comunicarse con nuestra central de atención.

Estamos ansiosos por recibirle y hacer de su estancia una experiencia inolvidable.

Atentamente,

**Área de Reservaciones y Recepción**
MarIA - Innovación y Hospitalidad a su Servicio
`;

// Ejemplo de uso: Mostrar el resultado en consola
console.log(cuerpoCorreo);

```

---

### Lo que hace especial a esta plantilla:

* **Estatus Dinámico:** Puedes cambiar la variable `statusContrato` y tanto el cuerpo del correo como el texto incrustado del contrato se actualizarán automáticamente.
* **Legibilidad:** Al usar las comillas invertidas (```), el contrato mantiene su estructura de bloques, ideal para que el huésped lo lea sin esfuerzo desde cualquier dispositivo.

¿Te gustaría agregar algún campo extra al contrato, como el número de habitación o la fecha de salida (Check-out)?
