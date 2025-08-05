import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertAppointmentSchema, insertServiceSchema, services, appointments } from "@shared/schema";
import { sendTelegramNotification } from "./telegram";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      const message = await storage.createContactMessage(validatedData);
      
      // Üzenet részletes naplózása
      console.log("\n" + "=".repeat(60));
      console.log("🔔 ÚJ ÜZENET ÉRKEZETT A WEBOLDALRÓL!");
      console.log("=".repeat(60));
      console.log(`📧 Név: ${validatedData.name}`);
      console.log(`📬 Email: ${validatedData.email}`);
      console.log(`📋 Tárgy: ${validatedData.subject}`);
      console.log(`🕐 Időpont: ${new Date().toLocaleString('hu-HU')}`);
      console.log("-".repeat(60));
      console.log("📝 ÜZENET TARTALMA:");
      console.log(validatedData.message);
      console.log("=".repeat(60) + "\n");
      
      // Telegram értesítés küldése
      console.log('📱 Telegram értesítés küldése...');
      const telegramSent = await sendTelegramNotification({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message
      });

      // Értesítés állapota
      if (telegramSent) {
        console.log("✅ Telegram értesítés elküldve!");
      } else {
        console.log("⚠️ Telegram értesítés sikertelen - üzenet azért tárolva van");
      }
      
      res.json({ 
        success: true, 
        message: "Köszönöm az üzenetét! Megkaptam és a lehető leghamarabb válaszolni fogok. Várhatóan 24 órán belül felveszem Önnel a kapcsolatot." 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Hibás adatok",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Szerver hiba történt. Kérjük próbálja újra később."
        });
      }
    }
  });

  // Get contact messages (for admin purposes)
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Hiba történt az üzenetek betöltése során."
      });
    }
  });

  // Services endpoints
  app.get("/api/services", async (req, res) => {
    try {
      const allServices = await db.select().from(services).where(eq(services.isActive, true));
      res.json(allServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Appointments endpoints
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const [appointment] = await db.insert(appointments).values(validatedData).returning();

      // Send Telegram notification for new appointment
      console.log("\n" + "=".repeat(60));
      console.log("📅 ÚJ IDŐPONT FOGLALÁS!");
      console.log("=".repeat(60));
      console.log(`👤 Név: ${validatedData.clientName}`);
      console.log(`📧 Email: ${validatedData.clientEmail}`);
      console.log(`📱 Telefon: ${validatedData.clientPhone || 'Nincs megadva'}`);
      console.log(`📅 Időpont: ${new Date(validatedData.appointmentDate).toLocaleString('hu-HU')}`);
      console.log(`⏰ Időtartam: ${validatedData.duration} perc`);
      if (validatedData.notes) {
        console.log(`📝 Megjegyzés: ${validatedData.notes}`);
      }
      console.log("=".repeat(60) + "\n");

      const telegramMessage = `🎯 **ÚJ IDŐPONT FOGLALÁS**\n\n` +
        `👤 **Név:** ${validatedData.clientName}\n` +
        `📧 **Email:** ${validatedData.clientEmail}\n` +
        `📱 **Telefon:** ${validatedData.clientPhone || 'Nincs megadva'}\n` +
        `📅 **Időpont:** ${new Date(validatedData.appointmentDate).toLocaleString('hu-HU')}\n` +
        `⏰ **Időtartam:** ${validatedData.duration} perc\n` +
        `${validatedData.notes ? `📝 **Megjegyzés:** ${validatedData.notes}\n` : ''}\n` +
        `🕐 **Foglalás időpontja:** ${new Date().toLocaleString('hu-HU')}`;

      await sendTelegramNotification({
        name: validatedData.clientName,
        email: validatedData.clientEmail,
        subject: `Új időpont foglalás - ${new Date(validatedData.appointmentDate).toLocaleDateString('hu-HU')}`,
        message: telegramMessage
      });

      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.errors
        });
      }
      
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
