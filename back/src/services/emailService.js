const nodemailer = require('nodemailer');

// Simulated email transport (logs to console instead of sending)
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

async function sendContractEmail(contrato) {
  const mailOptions = {
    from: process.env.SMTP_USER || 'noreply@maria-saas.com',
    to: contrato.email,
    subject: `Contrato de Reserva - Hotel Boutique MarIA - ${contrato.nombre} ${contrato.apellidos}`,
    text: `Estimado/a ${contrato.nombre},

Nos alegra mucho darte la bienvenida a Hotel Boutique MarIA. Tu reserva programada para el día ${contrato.fecha_reserva} ha sido procesada con éxito en nuestro sistema.

Adjunto a este correo encontrarás tu documento oficial de contrato (${contrato.contrato}), el cual contiene los términos y condiciones de tu estancia. Te invitamos a revisarlo detalladamente.

Si tienes alguna duda o requieres asistencia especial antes de tu llegada, puedes responder directamente a este mensaje.

¡Esperamos brindarte una experiencia inolvidable!

Atentamente,
El equipo de Hotel Boutique MarIA`,
  };

  // TODO: In production, use real SMTP transport
  console.log('[EMAIL SIMULADO] Enviando email a:', contrato.email);
  console.log('[EMAIL SIMULADO] Asunto:', mailOptions.subject);
  console.log('[EMAIL SIMULADO] Contenido:', mailOptions.text);

  return { message: 'Email simulado enviado', recipient: contrato.email };
}

module.exports = { sendContractEmail };
