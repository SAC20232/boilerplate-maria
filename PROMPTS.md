# PROMPTS.md

Documenta los prompts que utilizaste para las siguientes tareas. Sigue la estructura indicada para cada uno.

---

## Prompt 1: Generación de datos de prueba

**Tarea:** Generar 10 registros realistas para la tabla de contratos (nombre, apellidos, teléfono, email, fecha_reserva, status).

### Contexto dado a la IA

Estoy desarrollando una aplicación SaaS para la gestión de contratos de hospedaje. Necesito generar datos de prueba para poblar la tabla `contratos` con información realista que me permita probar búsquedas, filtros y paginación.

### Prompt

Genera 10 registros realistas para una tabla de contratos con los siguientes campos:

- nombre
- apellidos
- telefono
- email
- fecha_reserva (formato YYYY-MM-DD)
- status

Los estados permitidos son:
- Pendiente de firma
- Firmado
- Cancelado

Utiliza nombres y apellidos en español, teléfonos de 10 dígitos, correos electrónicos válidos y fechas de reserva distribuidas entre el presente y los próximos meses. Devuelve únicamente los registros en formato JSON.

### Por qué lo estructuraste así

Se proporcionó el contexto del proyecto, la estructura exacta de la tabla y las restricciones de cada campo para obtener datos consistentes con el modelo de la base de datos y facilitar su inserción durante las pruebas.

### Segunda iteración (si aplica)

No fue necesaria.

### Resultado obtenido

Se obtuvieron 10 registros realistas y consistentes que permitieron validar correctamente el funcionamiento de la aplicación, incluyendo filtros, búsquedas y paginación.

---

## Prompt 2: Mensaje de email profesional

**Tarea:** Redactar el cuerpo del email que simula el envío del contrato al huésped (el que actualmente hace `console.log` en `emailService.js`).

### Contexto dado a la IA

La aplicación genera un contrato automáticamente cuando se registra una nueva reserva y simula el envío de un correo electrónico al huésped. El mensaje debe tener un tono profesional y confirmar que el contrato fue generado correctamente.

### Prompt

Redacta un correo electrónico profesional para un huésped informando que su contrato ha sido generado correctamente.

El correo debe:

- utilizar un tono cordial y formal;
- indicar que el contrato se encuentra adjunto;
- agradecer la confianza del huésped;
- invitar a responder el correo en caso de dudas;
- finalizar con una despedida institucional.

No incluyas HTML; únicamente el cuerpo del mensaje en texto plano.

### Por qué lo estructuraste así

El prompt especifica claramente el propósito del correo, el público objetivo, el tono esperado y las restricciones del formato para obtener un mensaje directamente utilizable dentro del sistema.

### Segunda iteración (si aplica)

Se solicitó que el mensaje fuera más breve para facilitar su lectura en clientes de correo y mantener un estilo profesional.

### Resultado obtenido

Se obtuvo un mensaje claro, profesional y reutilizable para la simulación del envío de contratos desde el sistema.