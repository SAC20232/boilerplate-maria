const nodemailer = require('nodemailer');

// Simulated email transport (logs to console instead of sending)
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

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

module.exports = { sendContractEmail };
