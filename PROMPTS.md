# PROMPTS.md

Documenta los prompts que utilizaste para las siguientes tareas. Sigue la estructura indicada para cada uno.

---

## Prompt 1: Generación de datos de prueba

**Tarea:** Generar 10 registros realistas para la tabla de contratos (nombre, apellidos, teléfono, email, fecha_reserva, status).

### Contexto dado a la IA
Le compartí a la IA el esquema real de la tabla `contratos` (`back/src/database/db.js`) y las reglas de validación de `contratosController.js`:
- `nombre` y `apellidos`: string, 2-100 caracteres.
- `telefono`: string, 6-20 caracteres.
- `email`: formato email válido.
- `fecha_reserva`: fecha ISO (`YYYY-MM-DD`).
- `status`: solo puede ser uno de los tres valores usados en el frontend (`front/src/pages/Contratos.jsx`): `Pendiente de firma`, `Firmado`, `Cancelado`.
- Fecha actual del sistema: 2026-09-03, para que las `fecha_reserva` generadas fueran coherentes (próximas semanas/meses).

### Prompt
```
Genera 10 registros realistas para la tabla `contratos` de un SaaS de gestión hotelera español.
Cada registro debe tener: nombre, apellidos, telefono, email, fecha_reserva, status.

Restricciones:
- nombre y apellidos: nombres y apellidos españoles variados (2-100 caracteres).
- telefono: móviles españoles de 9 dígitos (formato 6XXXXXXXX u 8-9 similares).
- email: coherente con nombre.apellido en dominios comunes (gmail.com, hotmail.com, outlook.com, yahoo.es, icloud.com).
- fecha_reserva: fechas ISO (YYYY-MM-DD) escalonadas entre septiembre y octubre de 2026.
- status: distribuido entre "Pendiente de firma", "Firmado" y "Cancelado" (no todos iguales).

Devuélvelo en formato tabla y también como array de objetos JS listo para usar en un seed/test.
```

### Por qué lo estructuraste así
Le di el esquema exacto y los valores permitidos de `status` para evitar que la IA inventara campos o estados que no existen en el código (por ejemplo "Enviado" o "Activo"). Pedí formato tabla + array JS porque la tabla es fácil de revisar visualmente y el array se puede pegar directamente en un test o seed sin retrabajo.

### Segunda iteración (si aplica)
No fue necesaria. El primer resultado ya respetaba los rangos de validación de Joi y los tres valores de `status` usados por el frontend, así que no hubo que refinar el prompt.

### Resultado obtenido

| # | nombre | apellidos | telefono | email | fecha_reserva | status |
|---|--------|-----------|----------|-------|----------------|--------|
| 1 | Laura | Fernández Ruiz | 611223344 | laura.fernandez@gmail.com | 2026-09-15 | Pendiente de firma |
| 2 | Carlos | Gómez Torres | 699887766 | carlos.gomez@hotmail.com | 2026-09-20 | Firmado |
| 3 | María | López Sánchez | 622334455 | maria.lopez@yahoo.es | 2026-09-22 | Pendiente de firma |
| 4 | Javier | Moreno Díaz | 655112233 | javier.moreno@outlook.com | 2026-09-25 | Cancelado |
| 5 | Ana | Jiménez Ortega | 633445566 | ana.jimenez@gmail.com | 2026-09-28 | Firmado |
| 6 | David | Romero Castro | 677889900 | david.romero@gmail.com | 2026-10-02 | Pendiente de firma |
| 7 | Elena | Navarro Vidal | 644556677 | elena.navarro@icloud.com | 2026-10-05 | Firmado |
| 8 | Pablo | Serrano Molina | 688990011 | pablo.serrano@gmail.com | 2026-10-08 | Pendiente de firma |
| 9 | Sofía | Ramos Iglesias | 611998877 | sofia.ramos@hotmail.com | 2026-10-12 | Cancelado |
| 10 | Miguel | Torres Delgado | 699112233 | miguel.torres@gmail.com | 2026-10-15 | Firmado |

```js
const contratosDePrueba = [
  { nombre: 'Laura', apellidos: 'Fernández Ruiz', telefono: '611223344', email: 'laura.fernandez@gmail.com', fecha_reserva: '2026-09-15', status: 'Pendiente de firma' },
  { nombre: 'Carlos', apellidos: 'Gómez Torres', telefono: '699887766', email: 'carlos.gomez@hotmail.com', fecha_reserva: '2026-09-20', status: 'Firmado' },
  { nombre: 'María', apellidos: 'López Sánchez', telefono: '622334455', email: 'maria.lopez@yahoo.es', fecha_reserva: '2026-09-22', status: 'Pendiente de firma' },
  { nombre: 'Javier', apellidos: 'Moreno Díaz', telefono: '655112233', email: 'javier.moreno@outlook.com', fecha_reserva: '2026-09-25', status: 'Cancelado' },
  { nombre: 'Ana', apellidos: 'Jiménez Ortega', telefono: '633445566', email: 'ana.jimenez@gmail.com', fecha_reserva: '2026-09-28', status: 'Firmado' },
  { nombre: 'David', apellidos: 'Romero Castro', telefono: '677889900', email: 'david.romero@gmail.com', fecha_reserva: '2026-10-02', status: 'Pendiente de firma' },
  { nombre: 'Elena', apellidos: 'Navarro Vidal', telefono: '644556677', email: 'elena.navarro@icloud.com', fecha_reserva: '2026-10-05', status: 'Firmado' },
  { nombre: 'Pablo', apellidos: 'Serrano Molina', telefono: '688990011', email: 'pablo.serrano@gmail.com', fecha_reserva: '2026-10-08', status: 'Pendiente de firma' },
  { nombre: 'Sofía', apellidos: 'Ramos Iglesias', telefono: '611998877', email: 'sofia.ramos@hotmail.com', fecha_reserva: '2026-10-12', status: 'Cancelado' },
  { nombre: 'Miguel', apellidos: 'Torres Delgado', telefono: '699112233', email: 'miguel.torres@gmail.com', fecha_reserva: '2026-10-15', status: 'Firmado' },
];
```

---

## Prompt 2: Mensaje de email profesional

**Tarea:** Redactar el cuerpo del email que simula el envío del contrato al huésped (el que actualmente hace `console.log` en `emailService.js`).

### Contexto dado a la IA
Le mostré el archivo `back/src/services/emailService.js` completo, señalando que:
- El email es simulado (`jsonTransport: true`, solo se loguea en consola, no se envía de verdad).
- Los datos disponibles en el objeto `contrato` son: `nombre`, `apellidos`, `email`, `fecha_reserva` y `contrato` (nombre del archivo generado).
- El tono debe ser formal/profesional en español, coherente con el resto de la app (que ya usa "Estimado/a" y firma "Equipo MarIA").
- El destinatario es un huésped de un hotel al que se le envía su contrato de reserva para firmar.

### Prompt
```
Redacta el cuerpo de un email profesional en español para un SaaS de gestión hotelera
llamado MarIA. El email se envía automáticamente al huésped cuando se genera su contrato
de reserva, y debe pedirle que revise y firme el documento adjunto.

Datos disponibles para interpolar: nombre, apellidos, fecha_reserva (formateada) y el
nombre del archivo del contrato adjunto.

Tono: formal pero cercano, sin sonar robótico. Debe incluir:
1. Saludo personalizado.
2. Confirmación de la fecha de la reserva.
3. Mención del archivo adjunto y la acción requerida (firmarlo).
4. Una línea invitando a responder el correo si hay dudas.
5. Despedida firmada como "Equipo MarIA".

Después, intégralo en `sendContractEmail` de emailService.js, formateando fecha_reserva
con toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
antes de interpolarla.
```

### Por qué lo estructuraste así
Enumerar los 5 puntos obligatorios (saludo, fecha, adjunto+acción, invitación a responder, firma) evita que la IA genere un texto genérico o le falte información clave para el huésped (como qué debe hacer con el contrato). Pedir explícitamente el formateo de la fecha con `toLocaleDateString` asegura que el resultado sea código funcional y no solo texto de ejemplo, y mantiene el estilo ya usado en el resto del proyecto.

### Segunda iteración (si aplica)
No hizo falta una segunda iteración: el primer texto ya cubría los 5 puntos pedidos y encajó sin cambios al integrarlo en el código.

### Resultado obtenido

```
Estimado/a {nombre} {apellidos},

Gracias por confiar en MarIA para su próxima estancia. Le confirmamos que su reserva ha quedado registrada para el día {fecha_reserva formateada}.

Adjuntamos el contrato correspondiente ({contrato}) para su revisión y firma. Le pedimos que lo firme a la mayor brevedad posible para completar el proceso de reserva.

Si tiene cualquier duda o necesita ayuda con el documento, puede responder directamente a este correo y nuestro equipo le atenderá con gusto.

Un cordial saludo,
Equipo MarIA
```

Integrado en `back/src/services/emailService.js`:

```js
async function sendContractEmail(contrato) {
  const fechaFormateada = new Date(contrato.fecha_reserva).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const cuerpo = `Estimado/a ${contrato.nombre} ${contrato.apellidos},

Gracias por confiar en MarIA para su próxima estancia. Le confirmamos que su reserva ha quedado registrada para el día ${fechaFormateada}.

Adjuntamos el contrato correspondiente (${contrato.contrato}) para su revisión y firma. Le pedimos que lo firme a la mayor brevedad posible para completar el proceso de reserva.

Si tiene cualquier duda o necesita ayuda con el documento, puede responder directamente a este correo y nuestro equipo le atenderá con gusto.

Un cordial saludo,
Equipo MarIA`;

  const mailOptions = {
    from: process.env.SMTP_USER || 'noreply@maria-saas.com',
    to: contrato.email,
    subject: `Contrato - ${contrato.nombre} ${contrato.apellidos}`,
    text: cuerpo,
  };

  // TODO: In production, use real SMTP transport
  console.log('[EMAIL SIMULADO] Enviando email a:', contrato.email);
  console.log('[EMAIL SIMULADO] Asunto:', mailOptions.subject);
  console.log('[EMAIL SIMULADO] Contenido:', mailOptions.text);

  return { message: 'Email simulado enviado', recipient: contrato.email };
}
```
