import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(params: ContactEmailParams): Promise<boolean> {
  try {
    // Ellenőrizzük, hogy van-e érvényes API kulcs
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.trim() === '') {
      console.error('SendGrid API kulcs hiányzik vagy üres');
      return false;
    }

    const emailContent = `
Új üzenet érkezett a weboldalról:

Név: ${params.name}
Email: ${params.email}
Tárgy: ${params.subject}

Üzenet:
${params.message}

---
Ez az email automatikusan lett küldve a kun-botond.hu weboldalról.
    `.trim();

    const htmlContent = `
      <h2>Új üzenet érkezett a weboldalról</h2>
      <p><strong>Név:</strong> ${params.name}</p>
      <p><strong>Email:</strong> ${params.email}</p>
      <p><strong>Tárgy:</strong> ${params.subject}</p>
      <h3>Üzenet:</h3>
      <p>${params.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Ez az email automatikusan lett küldve a kun-botond.hu weboldalról.</em></p>
    `;

    await mailService.send({
      to: 'kun.botond@icloud.com',
      from: 'test@example.com', // Alapértelmezett SendGrid teszt email
      subject: `Weboldal üzenet: ${params.subject}`,
      text: emailContent,
      html: htmlContent,
      replyTo: params.email, // Így közvetlenül válaszolhat a küldőnek
    });
    
    console.log('Email sikeresen elküldve:', {
      to: 'kun.botond@icloud.com',
      subject: params.subject,
      from: params.email,
      apiKeyLength: process.env.SENDGRID_API_KEY?.length || 0
    });
    
    return true;
  } catch (error: any) {
    console.error('SendGrid email hiba részletesen:', {
      message: error.message,
      code: error.code,
      response: error.response?.body,
      apiKeyExists: !!process.env.SENDGRID_API_KEY,
      apiKeyLength: process.env.SENDGRID_API_KEY?.length || 0
    });
    return false;
  }
}