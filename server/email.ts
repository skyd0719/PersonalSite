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

    await mailService.send({
      to: 'kun.botond@icloud.com',
      from: 'hello@trysendgrid.com', // Ezt használhatjuk SendGrid teszteléshez
      subject: `Új üzenet a weboldalról: ${params.subject}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });
    
    console.log('Email sikeresen elküldve:', {
      to: 'kun.botond@icloud.com',
      subject: params.subject,
      from: params.email
    });
    
    return true;
  } catch (error) {
    console.error('SendGrid email hiba:', error);
    return false;
  }
}