# Kun Botond - Professional Website

Professional personal website built with React, TypeScript, Express.js and Telegram bot integration.

## 🌟 Features

- **Modern React Frontend** - Responsive design with Tailwind CSS
- **Express.js Backend** - RESTful API with TypeScript  
- **Telegram Integration** - Contact form notifications via Telegram bot
- **Contact Form** - Validated forms with instant notifications
- **Professional Design** - Clean, business-focused layout
- **Mobile Responsive** - Works perfectly on all devices

## 🚀 Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit (ready for custom domain)
- **Notifications**: Telegram Bot API

## 📦 Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/      # Page components  
│   │   └── lib/        # Utilities
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   ├── telegram.ts  # Telegram integration
│   └── storage.ts   # Database layer
├── shared/          # Shared TypeScript schemas
└── package.json     # Dependencies
```

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd kun-botond-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create `.env` file with:
```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
DATABASE_URL=your_postgresql_url
```

4. **Run development server**
```bash
npm run dev
```

## 🔧 Deployment

This project is optimized for Replit deployment with custom domain support.

1. Deploy on Replit
2. Add custom domain (botit.hu)
3. Configure DNS records
4. SSL automatically configured

## 📞 Contact Integration

The contact form automatically sends notifications via:
- Telegram bot (primary method)
- Server console logging  
- Database storage

## 🏗️ Built By

**Kun Botond**
- Email: kun.botond@icloud.com
- Phone: +36 70 466 6325
- Location: Budapest és Vácrátót, Magyarország

---

**Ready for deployment and domain connection!**