interface TelegramMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendTelegramNotification(params: TelegramMessage): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log('🔍 Telegram debug info:', {
      botTokenExists: !!botToken,
      botTokenLength: botToken?.length || 0,
      chatIdExists: !!chatId,
      chatId: chatId ? chatId.substring(0, 3) + '***' : 'nincs'
    });

    if (!botToken || !chatId) {
      console.log('❌ Telegram beállítás hiányzik - BOT_TOKEN vagy CHAT_ID nincs megadva');
      return false;
    }

    const messageText = `
🔔 *Új üzenet a weboldalról*

👤 *Név:* ${params.name}
📧 *Email:* ${params.email}
📋 *Tárgy:* ${params.subject}
🕐 *Időpont:* ${new Date().toLocaleString('hu-HU')}

💬 *Üzenet:*
${params.message}

---
_Automatikus értesítés a kun-botond.hu weboldalról_
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });

    if (response.ok) {
      console.log('✅ Telegram értesítés sikeresen elküldve!');
      return true;
    } else {
      const errorData = await response.text();
      console.error('❌ Telegram hiba:', response.status, errorData);
      
      // Specifikus hibaüzenetek
      if (errorData.includes("bots can't send messages to bots")) {
        console.log('💡 MEGOLDÁS: A Chat ID egy bot-é, nem felhasználóé!');
        console.log('   1. Írjon üzenetet közvetlenül a bot-nak (ne másik bot-nak)');
        console.log('   2. Használja saját Telegram felhasználói ID-ját');
        console.log('   3. Ellenőrizze: https://api.telegram.org/bot[TOKEN]/getUpdates');
      }
      
      return false;
    }

  } catch (error) {
    console.error('Telegram küldési hiba:', error);
    return false;
  }
}