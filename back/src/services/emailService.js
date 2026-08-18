const nodemailer = require('nodemailer');

// Simulated email transport (logs to console instead of sending)
const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

async function sendContractEmail(contrato) {
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

  // TODO: In production, use real SMTP transport
  console.log('[EMAIL SIMULADO] Enviando email a:', contrato.email);
  console.log('[EMAIL SIMULADO] Asunto: Tu contrato de reservación - MarIA SaaS\n`');
  console.log('[EMAIL SIMULADO] Contenido:', emailBody);

  return { message: 'Email simulado enviado', recipient: contrato.email };
}

module.exports = { sendContractEmail };
