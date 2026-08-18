# PROMPTS.md

Documenta los prompts que utilizaste para las siguientes tareas. Sigue la estructura indicada para cada uno.

---

## Prompt 1: Generación de datos de prueba

**Tarea:** Generar 10 registros realistas para la tabla de contratos (nombre, apellidos, teléfono, email, fecha_reserva, status).

### Contexto dado a la IA
Se le proporcionó al modelo el stack tecnológico empleado (SQLite), el esquema de la base de datos relacional para la tabla `contratos`, las validaciones de formato requeridas (teléfonos móviles a 10 dígitos, correos electrónicos con formato válido y fechas bajo el estándar ISO 8601), y la regla de distribución de los estados permitidos (`Pendiente de firma`, `Firmado`, `Cancelado`).

### Prompt
```text
Actúa como un desarrollador backend generando datos de prueba (seed data) realistas para una base de datos SQLite orientada al sistema de gestión de un hotel boutique. 
Genera un conjunto de datos en formato JSON estricto con exactamente 10 registros para la tabla `contratos`.

Las restricciones y columnas requeridas son:
- nombre: String con nombres comunes en español.
- apellidos: String con apellidos compuestos o sencillos reales.
- telefono: String de exactamente 10 dígitos numéricos simulando formato móvil local.
- email: String con correos válidos y coherentes respecto al nombre del usuario.
- fecha_reserva: String en formato ISO 'YYYY-MM-DD', abarcando un rango temporal entre junio y diciembre de 2026.
- status: String limitado estrictamente y de forma aleatoria a uno de estos tres valores: 'Pendiente de firma', 'Firmado', 'Cancelado'.

Devuelve únicamente el arreglo JSON puro, sin bloques de explicación adicionales ni texto introductorio.
```

### Por qué lo estructuraste así
Establecer un rol técnico como "desarrollado backend" y delimitar restricciones estrictas de formato evita que la IA devuelva estructuras anómalas, datos genéricos en inglés o formatos de fecha incompatibles con la base de datos local.
### Segunda iteración (si aplica)
<!-- Si el primer resultado no fue ideal, ¿cómo refinaste el prompt? -->

### Resultado obtenido
```json
[
  {"nombre": "Carlos", "apellidos": "Ruiz Mendoza", "telefono": "5512345678", "email": "carlos.ruiz@gmail.com", "fecha_reserva": "2026-06-05", "status": "Firmado"},
  {"nombre": "Ana", "apellidos": "López Pérez", "telefono": "5587654321", "email": "ana.lopez@yahoo.com", "fecha_reserva": "2026-06-12", "status": "Pendiente de firma"},
  {"nombre": "Pedro", "apellidos": "Martín Gómez", "telefono": "5543218765", "email": "pmartin@outlook.com", "fecha_reserva": "2026-07-01", "status": "Cancelado"},
  {"nombre": "María", "apellidos": "García Sánchez", "telefono": "5598761234", "email": "mgarcia@gmail.com", "fecha_reserva": "2026-07-15", "status": "Firmado"},
  {"nombre": "Luis", "apellidos": "Fernández Torres", "telefono": "5534567890", "email": "luis.ft@hotmail.com", "fecha_reserva": "2026-08-02", "status": "Pendiente de firma"},
  {"nombre": "Sofía", "apellidos": "Ramírez Flores", "telefono": "5578901234", "email": "sofia.ramirez@gmail.com", "fecha_reserva": "2026-08-20", "status": "Firmado"},
  {"nombre": "Jorge", "apellidos": "Álvarez Ruiz", "telefono": "5523456789", "email": "jorge.alvarez@outlook.com", "fecha_reserva": "2026-09-10", "status": "Cancelado"},
  {"nombre": "Elena", "apellidos": "Castillo Vega", "telefono": "5567890123", "email": "elena.castillo@yahoo.com", "fecha_reserva": "2026-10-05", "status": "Pendiente de firma"},
  {"nombre": "Raúl", "apellidos": "Ortiz Morales", "telefono": "5589012345", "email": "r.ortiz@gmail.com", "fecha_reserva": "2026-11-12", "status": "Firmado"},
  {"nombre": "Lucía", "apellidos": "Jiménez Castro", "telefono": "5511223344", "email": "lucia.jc@hotmail.com", "fecha_reserva": "2026-12-01", "status": "Pendiente de firma"}
]
```
---

## Prompt 2: Mensaje de email profesional

**Tarea:** Redactar el cuerpo del email que simula el envío del contrato al huésped (el que actualmente hace `console.log` en `emailService.js`).

### Contexto dado a la IA
Se le especificó al modelo la identidad de marca y el tono institucional requerido (hospitalidad de lujo para un hotel boutique), el perfil del destinatario final (huésped del sistema), disponibilidad de los datos provenientes del objeto contrato (contrato.nombre, contrato.apellidos, contrato.fecha_reserva, contrato.contrato) y la necesidad de sustituir el console.log actual por una plantilla profesional, transaccional, concisa y acogedora.

### Prompt
```ŧext
Actúa como un especialista en comunicación corporativa y experiencia de usuario (UX Writing) para el servicio de notificaciones de un hotel boutique de lujo llamado MarIA. 

Redacta el cuerpo de una plantilla de correo electrónico formal, transaccional y acogedora para enviar adjunto el contrato a un huésped. El mensaje debe cumplir con lo siguiente:
1. Dar una cálida bienvenida al huésped por su nombre (tomando datos del objeto 'contrato').
2. Hacer referencia a que su reserva para la fecha {{contrato.fecha_reserva}} ha sido procesada exitosamente.
3. Informar que el archivo {{contrato.contrato}} se encuentra adjunto para su revisión.
4. Usar marcadores de posición basados en la estructura del objeto 'contrato' (ej. {{contrato.nombre}}, {{contrato.fecha_reserva}}, {{contrato.contrato}}).

Conserva un equilibrio idóneo entre formalidad ejecutiva y calidez humana, priorizando la concisión para mejorar la experiencia de lectura.
```
### Por qué lo estructuraste así
El contexto asegura que la IA comprenda que los datos provienen directamente de un objeto (contrato), lo cual permite que la plantilla resultante sea fácilmente implementable en emailService.js. El enfoque en UX Writing garantiza que el mensaje sea profesional y coherente con el sistema de hospitalidad de MarIA.

### Segunda iteración (si aplica)
<!-- Si el primer resultado no fue ideal, ¿cómo refinaste el prompt? -->

### Resultado obtenido
```ŧext
Asunto: Contrato de Reserva - Hotel Boutique MarIA - {{contrato.nombre}} {{contrato.apellidos}}

Estimado/a {{contrato.nombre}},

Nos alegra mucho darte la bienvenida a Hotel Boutique MarIA. Tu reserva programada para el día {{contrato.fecha_reserva}} ha sido procesada con éxito en nuestro sistema.

Adjunto a este correo encontrarás tu documento oficial de contrato ({{contrato.contrato}}), el cual contiene los términos y condiciones de tu estancia. Te invitamos a revisarlo detalladamente.

Si tienes alguna duda o requieres asistencia especial antes de tu llegada, puedes responder directamente a este mensaje.

¡Esperamos brindarte una experiencia inolvidable!

Atentamente,
El equipo de Hotel Boutique MarIA
```
