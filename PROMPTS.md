# PROMPTS.md

Documenta los prompts que utilizaste para las siguientes tareas. Sigue la estructura indicada para cada uno.

---

## Prompt 1: Generación de datos de prueba

**Tarea:** Generar 10 registros realistas para la tabla de contratos (nombre, apellidos, teléfono, email, fecha_reserva, status).

### Contexto dado a la IA
<!-- Qué información le proporcionaste: stack, estructura de la tabla, restricciones, etc. -->

Estoy trabajando en una prueba tecnica fullstack para un sistema llamado MarIA SaaS. El proyecto tiene un backend en Node.js con Express y SQLite, y un frontend en React con Vite.

Necesito generar datos de prueba para la tabla contratos, ya que al inicio el endpoint GET /contratos regresaba una lista vacia. La idea es tener registros suficientes para probar el listado, los filtros, la busqueda y la paginacion.

La tabla maneja estos campos:

- nombre
- apellidos
- telefono
- email
- fecha_reserva
- status

Los estados que usa el sistema son:

- Pendiente de firma
- Firmado
- Cancelado

Tambien toma en cuenta que las fechas deben ser futuras, porque el formulario no debe aceptar fechas anteriores al dia actual.


### Prompt

Estoy resolviendo una prueba tecnica fullstack para un sistema SaaS de hospitality llamado MarIA SaaS. Necesito generar datos de prueba realistas para una tabla llamada contratos.

La tabla tiene estos campos:

- nombre
- apellidos
- telefono
- email
- fecha_reserva
- status

Genera 10 registros realistas en espanol, con nombres y apellidos creibles, telefonos mexicanos de 10 digitos, emails validos, fechas de reserva futuras y distintos status.

Los unicos status permitidos son:

- Pendiente de firma
- Firmado
- Cancelado

Quiero que los datos me sirvan para probar filtros por status, busqueda parcial por nombre y paginacion. Devuelveme el resultado en formato SQL usando:
INSERT INTO contratos (nombre, apellidos, telefono, email, fecha_reserva, status) VALUES ...

### Por qué lo estructuraste así
<!-- 2-3 líneas explicando tu razonamiento al construir el prompt -->

Lo estructure de esa manera porque no queria datos genericos, si no registros que tuvieran sentido dentro del sistema. Por eso primero le di el contexto del proyecto y despues especifique los campos reales de la tabla.

Tambien aclare los status permitidos para evitar que se generaran valores diferentes a los que se manejan. Pedi el resultado en SQL porque era la forma mas practica de insertar los datos y probar rapido el backend.

### Segunda iteración (si aplica)
<!-- Si el primer resultado no fue ideal, ¿cómo refinaste el prompt? -->

### Resultado obtenido
<!-- Pega aquí los datos generados -->

INSERT INTO contratos (nombre, apellidos, telefono, email, fecha_reserva, status)
VALUES
('Juan Carlos', 'Perez Ramirez', '5512345678', 'juan.perez@example.com', '2026-08-15', 'Firmado'),
('Maria Fernanda', 'Lopez Hernandez', '5523456789', 'maria.lopez@example.com', '2026-08-18', 'Pendiente de firma'),
('Carlos Alberto', 'Gomez Salinas', '5534567890', 'carlos.gomez@example.com', '2026-08-21', 'Cancelado'),
('Ana Sofia', 'Martinez Torres', '5545678901', 'ana.martinez@example.com', '2026-08-24', 'Firmado'),
('Luis Enrique', 'Ramirez Castillo', '5556789012', 'luis.ramirez@example.com', '2026-08-27', 'Pendiente de firma'),
('Valeria', 'Sanchez Morales', '5567890123', 'valeria.sanchez@example.com', '2026-09-01', 'Firmado'),
('Diego Armando', 'Flores Vargas', '5578901234', 'diego.flores@example.com', '2026-09-04', 'Pendiente de firma'),
('Paola Andrea', 'Jimenez Ruiz', '5589012345', 'paola.jimenez@example.com', '2026-09-08', 'Cancelado'),
('Roberto', 'Nunez Aguilar', '5590123456', 'roberto.nunez@example.com', '2026-09-12', 'Firmado'),
('Camila', 'Herrera Mendoza', '5511223344', 'camila.herrera@example.com', '2026-09-16', 'Pendiente de firma');

## Prompt 2: Mensaje de email profesional

**Tarea:** Redactar el cuerpo del email que simula el envío del contrato al huésped (el que actualmente hace `console.log` en `emailService.js`).

### Contexto dado a la IA
<!-- Qué información le proporcionaste: tono, destinatario, datos del contrato disponibles, etc. -->
Estoy trabajando en el mismo proyecto de prueba tecnica, MarIA SaaS. El backend tiene un archivo llamado emailService.js, donde el envio de correo es simulado usando console.log.

No necesito configurar un servicio real de correo, pero si quiero que el mensaje tenga mejor presentacion. La idea es que el correo suene mas profesional y que sea claro para el huesped que acaba de generar un contrato de reserva.

Los datos disponibles del contrato son:

nombre
apellidos
telefono
email
fecha_reserva
status
contrato

El tono que busco es amable, claro y formal, sin sonar demasiado robotico.

### Prompt
<!-- Escribe aquí el texto exacto que usaste -->
Estoy trabajando en el mismo proyecto de prueba tecnica, MarIA SaaS.

El backend tiene un archivo emailService.js que simula el envio de un correo con console.log. No necesito enviar un email real, pero si quiero mejorar el cuerpo del mensaje para que se vea profesional y util para el huesped.

Redacta un email en español que confirme que el contrato de reserva fue generado correctamente. El mensaje debe ser amable, claro y formal.

Debe incluir un resumen con estos datos usando variables de JavaScript del objeto contrato:

nombre completo
telefono
email
fecha de reserva
status
archivo del contrato generado

Devuelve el resultado como un template string de JavaScript para integrarlo directamente en emailService.js.

### Por qué lo estructuraste así
<!-- 2-3 líneas explicando tu razonamiento al construir el prompt -->
Lo escribi asi porque queria que supiera que el email era simulado y que no necesitaba una integracion real. El objetivo era mejorar el contenido del mensaje, no agregar algo innecesario al proyecto.

Tambien especifique el tono y los datos disponibles para que el resultado fuera facil de integrar en el codigo y no usara campos que no existen en el objeto contrato.

### Segunda iteración (si aplica)
<!-- Si el primer resultado no fue ideal, ¿cómo refinaste el prompt? -->
La primera version del correo cumplia, pero se sentia un generica como si fuera un copy paste de algun otro correo. Por eso ajuste el prompt para pedir que incluyera un resumen mas claro de la reserva y una frase en caso de que el huesped detectara algun dato incorrecto.

Con ese cambio, el correo quedo mas natural y mas cercano a un flujo real de atencion al cliente.

### Resultado obtenido
<!-- Pega aquí el texto del email generado e intégralo en emailService.js -->
const nodemailer = require('nodemailer');

// Simulated email transport (logs to console instead of sending)
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

function buildContractEmailBody(contrato) {
  const fullName = `${contrato.nombre} ${contrato.apellidos}`;

  return `
Hola ${contrato.nombre},

Esperamos que te encuentres muy bien.

Te confirmamos que tu contrato de reserva fue generado correctamente en MarIA SaaS. A continuacion, compartimos el resumen de la informacion registrada:

Nombre del huesped: ${fullName}
Telefono: ${contrato.telefono}
Email: ${contrato.email}
Fecha de reserva: ${contrato.fecha_reserva}
Estado del contrato: ${contrato.status}
Archivo generado: ${contrato.contrato || 'Contrato pendiente de generacion'}

Si detectas algun dato incorrecto, por favor responde a este correo para que nuestro equipo pueda ayudarte con la actualizacion correspondiente.

Gracias por confiar en MarIA SaaS.

Saludos,
Equipo MarIA
`.trim();
}

async function sendContractEmail(contrato) {
  const fullName = `${contrato.nombre} ${contrato.apellidos}`;
  const emailBody = buildContractEmailBody(contrato);

  const mailOptions = {
    from: process.env.SMTP_USER || 'noreply@maria-saas.com',
    to: contrato.email,
    subject: `Confirmacion de contrato de reserva - ${fullName}`,
    text: emailBody,
  };

  // TODO: In production, use real SMTP transport
  const info = await transporter.sendMail(mailOptions);

  console.log('[EMAIL SIMULADO] Enviando email a:', contrato.email);
  console.log('[EMAIL SIMULADO] Asunto:', mailOptions.subject);
  console.log('[EMAIL SIMULADO] Contenido:', mailOptions.text);

  return {
    message: 'Email simulado enviado',
    recipient: contrato.email,
    subject: mailOptions.subject,
    preview: info.message,
  };
}

module.exports = { sendContractEmail };