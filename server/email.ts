import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn("Gmail credentials not found. Email notifications will be skipped.");
}

interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  appointmentDate: Date;
  duration: number;
  notes?: string;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData): Promise<boolean> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("Gmail credentials not configured, skipping email");
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

    const mailOptions = {
      from: `"Kun Botond - Professzionális Tanácsadó" <${process.env.GMAIL_USER}>`,
      to: data.clientEmail,
      replyTo: 'kun.botond@icloud.com',
      subject: 'Időpontfoglalás megerősítése - Kun Botond',
      html: `
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
      `,
      text: `
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
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Gmail email megerősítés elküldve: ${data.clientEmail}`);
    return true;
  } catch (error: any) {
    console.error('Gmail SMTP error:', error);
    if (error.code === 'EAUTH') {
      console.log(`⚠️ Gmail hitelesítési hiba: Ellenőrizze a felhasználónevet és app jelszót.`);
    } else if (error.code === 'ESOCKET') {
      console.log(`⚠️ Gmail kapcsolódási hiba: Ellenőrizze az internetkapcsolatot.`);
    }
    return false;
  }
}