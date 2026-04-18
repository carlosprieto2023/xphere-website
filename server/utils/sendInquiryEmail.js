const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInquiryEmail(contact) {
  const response = await resend.emails.send({
    from: `Xphere Group <${process.env.FROM_EMAIL}>`,
    to: process.env.TO_EMAIL,
    reply_to: contact.email,
    subject: `New Service Inquiry - ${contact.name}`,
    html: `
      <h2>New Xphere Inquiry</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
      <hr />
      <p><strong>Inquiry ID:</strong> ${contact._id}</p>
    `,
  });

  console.log('Resend response:', response);

  return response;
}

module.exports = sendInquiryEmail;
