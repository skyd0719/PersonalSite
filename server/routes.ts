import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { sendContactEmail } from "./email";
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
      
      // Email küldési kísérlet - de továbbra is működik az oldal email nélkül is
      let emailSent = false;
      try {
        emailSent = await sendContactEmail({
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message
        });
      } catch (error) {
        console.log("⚠️ SendGrid email küldés sikertelen");
      }
      
      if (emailSent) {
        console.log("✅ Email sikeresen elküldve a kun.botond@icloud.com címre!");
      } else {
        console.log("📌 FONTOS: Az üzenet megérkezett és tárolva van!");
        console.log("💡 Email automatikus továbbítás: SendGrid beállítás szükséges");
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

  const httpServer = createServer(app);
  return httpServer;
}
