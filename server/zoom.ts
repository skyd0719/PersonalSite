import { sendEmail } from './email';

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ZoomMeetingResponse {
  id: number;
  uuid: string;
  host_id: string;
  topic: string;
  type: number;
  status: string;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  join_url: string;
  password: string;
  h323_password: string;
  pstn_password: string;
  encrypted_password: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    cn_meeting: boolean;
    in_meeting: boolean;
    join_before_host: boolean;
    jbh_time: number;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    approval_type: number;
    audio: string;
    auto_recording: string;
    enforce_login: boolean;
    enforce_login_domains: string;
    alternative_hosts: string;
    close_registration: boolean;
    show_share_button: boolean;
    allow_multiple_devices: boolean;
    registrants_confirmation_email: boolean;
    waiting_room: boolean;
    request_permission_to_unmute_participants: boolean;
    global_dial_in_countries: string[];
    global_dial_in_numbers: any[];
    registrants_email_notification: boolean;
    meeting_authentication: boolean;
    encryption_type: string;
    approved_or_denied_countries_or_regions: {
      enable: boolean;
    };
    breakout_room: {
      enable: boolean;
    };
    internal_meeting: boolean;
    continuous_meeting_chat: {
      enable: boolean;
    };
  };
}

// Get Zoom OAuth token
async function getZoomToken(): Promise<string> {
  if (!process.env.ZOOM_ACCOUNT_ID || !process.env.ZOOM_CLIENT_ID || !process.env.ZOOM_CLIENT_SECRET) {
    throw new Error('Zoom credentials not configured');
  }

  const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: process.env.ZOOM_ACCOUNT_ID,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Zoom token error:', errorText);
    throw new Error(`Failed to get Zoom token: ${response.status}`);
  }

  const data: ZoomTokenResponse = await response.json();
  return data.access_token;
}

// Create Zoom meeting
export async function createZoomMeeting(
  topic: string,
  startTime: string,
  duration: number = 30,
  timezone: string = 'Europe/Budapest'
): Promise<ZoomMeetingResponse> {
  const token = await getZoomToken();
  
  const meetingData = {
    topic,
    type: 2, // Scheduled meeting
    start_time: startTime,
    duration,
    timezone,
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      mute_upon_entry: true,
      watermark: false,
      use_pmi: false,
      approval_type: 2, // No registration required
      audio: 'both',
      auto_recording: 'none',
      waiting_room: false,
      allow_multiple_devices: true,
    },
  };

  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Zoom meeting creation error:', errorText);
    throw new Error(`Failed to create Zoom meeting: ${response.status}`);
  }

  const meeting: ZoomMeetingResponse = await response.json();
  console.log('✅ Zoom meeting created:', {
    id: meeting.id,
    topic: meeting.topic,
    start_time: meeting.start_time,
    join_url: meeting.join_url
  });
  
  return meeting;
}

// Send Zoom meeting invitation email
export async function sendZoomInvitation(
  clientEmail: string,
  clientName: string,
  meeting: ZoomMeetingResponse,
  appointmentDate: string
): Promise<boolean> {
  const meetingDate = new Date(meeting.start_time);
  const formattedDate = meetingDate.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  const formattedTime = meetingDate.toLocaleTimeString('hu-HU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = `Zoom meghívó - Ingyenes konzultáció (${formattedDate})`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #000000; background-color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #1e40af; border-radius: 8px; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #1e40af; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .info-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { color: #1e40af; font-weight: bold; display: inline-block; min-width: 120px; }
        .value { color: #000000; }
        .zoom-link { background: #1e40af; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .zoom-link:hover { background: #1e3a8a; }
        .footer { margin-top: 30px; text-align: center; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">🎥 Zoom Videohívás Meghívó</div>
          <p style="color: #64748b; margin: 5px 0;">Ingyenes online konzultáció</p>
        </div>
        
        <p>Kedves <strong>${clientName}</strong>!</p>
        
        <p>Köszönöm, hogy időpontot foglalt az ingyenes konzultációra. Itt a Zoom videohívás részletei:</p>
        
        <div class="info-section">
          <div class="info-row">
            <span class="label">Dátum:</span>
            <span class="value">${formattedDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Időpont:</span>
            <span class="value">${formattedTime}</span>
          </div>
          <div class="info-row">
            <span class="label">Időtartam:</span>
            <span class="value">30 perc</span>
          </div>
          <div class="info-row">
            <span class="label">Meeting ID:</span>
            <span class="value">${meeting.id}</span>
          </div>
          ${meeting.password ? `
          <div class="info-row">
            <span class="label">Jelszó:</span>
            <span class="value">${meeting.password}</span>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center;">
          <a href="${meeting.join_url}" class="zoom-link">
            🎥 Csatlakozás a Zoom meetinghez
          </a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <strong style="color: #92400e;">⏰ Fontos tudnivalók:</strong>
          <ul style="color: #92400e; margin: 10px 0; padding-left: 20px;">
            <li>Kérem, csatlakozzon 2-3 perccel korábban</li>
            <li>Stabil internetkapcsolat szükséges</li>
            <li>Ha bármilyen technikai probléma merül fel, hívjon: +36 70 466 6325</li>
          </ul>
        </div>
        
        <p>Ha bármilyen kérdése van vagy módosítani szeretné az időpontot, kérem, válaszoljon erre az emailre vagy hívjon a +36 70 466 6325 telefonszámon.</p>
        
        <p>Várom a konzultációt!</p>
        
        <p style="margin-top: 30px;">
          Üdvözlettel,<br>
          <strong>Kun Botond</strong><br>
          <span style="color: #64748b;">Üzleti tanácsadó</span><br>
          📧 kun.botond@icloud.com<br>
          📱 +36 70 466 6325
        </p>
        
        <div class="footer">
          <p>Ez egy automatikusan generált email. Kérem, ne válaszoljon közvetlenül erre az üzenetre.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Zoom Videohívás Meghívó - Ingyenes konzultáció

Kedves ${clientName}!

Köszönöm, hogy időpontot foglalt az ingyenes konzultációra. Itt a Zoom videohívás részletei:

Dátum: ${formattedDate}
Időpont: ${formattedTime}
Időtartam: 30 perc
Meeting ID: ${meeting.id}
${meeting.password ? `Jelszó: ${meeting.password}` : ''}

Zoom link: ${meeting.join_url}

Fontos tudnivalók:
- Kérem, csatlakozzon 2-3 perccel korábban
- Stabil internetkapcsolat szükséges
- Ha bármilyen technikai probléma merül fel, hívjon: +36 70 466 6325

Ha bármilyen kérdése van vagy módosítani szeretné az időpontot, kérem, válaszoljon erre az emailre vagy hívjon a +36 70 466 6325 telefonszámon.

Várom a konzultációt!

Üdvözlettel,
Kun Botond
Üzleti tanácsadó
kun.botond@icloud.com
+36 70 466 6325
  `;

  return await sendEmail(
    clientEmail,
    'kun.botond@icloud.com',
    subject,
    textContent,
    htmlContent
  );
}

// Schedule Zoom meeting invitation (to be sent 24 hours before)
export function scheduleZoomInvitation(
  clientEmail: string,
  clientName: string,
  meetingTime: Date,
  meeting: ZoomMeetingResponse
): void {
  const sendTime = new Date(meetingTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
  const now = new Date();
  
  if (sendTime <= now) {
    // If the meeting is within 24 hours, send immediately
    console.log('⚡ Meeting is within 24 hours, sending Zoom invitation immediately');
    sendZoomInvitation(clientEmail, clientName, meeting, meetingTime.toISOString())
      .then(success => {
        if (success) {
          console.log('✅ Zoom invitation sent immediately');
        } else {
          console.error('❌ Failed to send immediate Zoom invitation');
        }
      });
  } else {
    const delayMs = sendTime.getTime() - now.getTime();
    console.log(`⏰ Scheduling Zoom invitation to be sent in ${Math.round(delayMs / (1000 * 60 * 60))} hours`);
    
    setTimeout(() => {
      sendZoomInvitation(clientEmail, clientName, meeting, meetingTime.toISOString())
        .then(success => {
          if (success) {
            console.log('✅ Scheduled Zoom invitation sent successfully');
          } else {
            console.error('❌ Failed to send scheduled Zoom invitation');
          }
        });
    }, delayMs);
  }
}