import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

if (!process.env.MAILERSEND_API_KEY) {
  console.warn("MAILERSEND_API_KEY not found. Email notifications will be skipped.");
}

interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  appointmentDate: Date;
  duration: number;
  notes?: string;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean> {
  if (!process.env.MAILERSEND_API_KEY) {
    console.log("MailerSend not configured, skipping email");
    return false;
  }

  try {
    const appointmentTime = data.appointmentDate.toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Budapest'
    });

    // Try MailerSend's default verified domain first, then custom domain
    const sentFrom = new Sender("noreply@trial-351nd4k8nj94zqx8.mlsender.net", "Kun Botond - Professzionális Tanácsadó");
    const recipients = [new Recipient(data.clientEmail, data.clientName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Időpontfoglalás megerősítése - Kun Botond")
      .setHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Időpontfoglalás megerősítése</h2>
          
          <p>Kedves <strong>${data.clientName}</strong>!</p>
          
          <p>Köszönöm, hogy időpontot foglalt egy ingyenes online konzultációra. Örömmel megerősítem a foglalását:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Foglalás részletei:</h3>
            <p><strong>Időpont:</strong> ${appointmentTime}</p>
            <p><strong>Időtartam:</strong> ${data.duration} perc</p>
            <p><strong>Típus:</strong> Online konzultáció (videohívás)</p>
            ${data.notes ? `<p><strong>Megjegyzés:</strong> ${data.notes}</p>` : ''}
          </div>
          
          <p>A konzultáció előtt 24 órával egy külön emailben megküldöm a videohívás linkjét.</p>
          
          <p>Ha bármilyen kérdése van vagy módosítania kell az időpontot, kérem írjon nekem erre az email címre vagy hívjon a <strong>+36 70 466 6325</strong> telefonszámon.</p>
          
          <p>Várom a találkozást!</p>
          
          <p>Üdvözlettel,<br>
          <strong>Kun Botond</strong><br>
          Professzionális tanácsadó<br>
          <a href="mailto:kun.botond@icloud.com">kun.botond@icloud.com</a><br>
          <a href="tel:+36704666325">+36 70 466 6325</a><br>
          <a href="https://botit.hu">botit.hu</a></p>
        </div>
      `)
      .setText(`
        Kedves ${data.clientName}!

        Köszönöm, hogy időpontot foglalt egy ingyenes online konzultációra.

        Foglalás részletei:
        - Időpont: ${appointmentTime}
        - Időtartam: ${data.duration} perc
        - Típus: Online konzultáció (videohívás)
        ${data.notes ? `- Megjegyzés: ${data.notes}` : ''}

        A konzultáció előtt 24 órával megküldöm a videohívás linkjét.

        Üdvözlettel,
        Kun Botond
        kun.botond@icloud.com
        +36 70 466 6325
        https://botit.hu
      `);

    await mailerSend.email.send(emailParams);
    console.log(`✅ MailerSend email megerősítés elküldve: ${data.clientEmail}`);
    return true;
  } catch (error: any) {
    // Handle MailerSend trial account limitations and other errors
    if (error.statusCode === 422) {
      if (error.body?.message?.includes('Trial accounts')) {
        console.log(`⚠️ MailerSend trial korlátozás: Csak verifikált címekre küldhet.`);
        console.log(`💡 Upgradelje a fiókot "Hobby" (ingyenes) csomagra a korlátlan küldéshez.`);
      } else if (error.body?.message?.includes('domain')) {
        console.log(`⚠️ MailerSend domain hiba: ${error.body.message}`);
        console.log(`💡 Ellenőrizze a domain verifikációt a MailerSend admin panelben.`);
      } else {
        console.log(`⚠️ MailerSend validációs hiba: ${error.body?.message || 'Ismeretlen hiba'}`);
      }
    } else {
      console.error('MailerSend email error:', error);
    }
    return false;
  }
}