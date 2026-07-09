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