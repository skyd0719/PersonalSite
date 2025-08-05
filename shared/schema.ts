import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations, sql } from "drizzle-orm";
import { z } from "zod";

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
}).extend({
  email: z.string().email("Érvényes email címet adjon meg"),
  name: z.string().min(2, "A név legalább 2 karakter hosszú legyen"),
  subject: z.string().min(5, "A tárgy legalább 5 karakter hosszú legyen"),
  message: z.string().min(10, "Az üzenet legalább 10 karakter hosszú legyen"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Booking system tables
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: varchar("description"),
  duration: integer("duration").notNull(), // minutes
  price: integer("price").default(0), // in HUF
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").references(() => services.id),
  clientName: varchar("client_name").notNull(),
  clientEmail: varchar("client_email").notNull(),
  clientPhone: varchar("client_phone"),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").notNull(), // minutes
  status: varchar("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  notes: varchar("notes"),
  meetingLink: varchar("meeting_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentRelations = relations(appointments, ({ one }) => ({
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  duration: true,
  price: true,
  isActive: true,
});

// Future services to be added later (currently commented out):
/*
Future Service Options:
1. Stratégiai tanácsadás (90 perc, 25,000 HUF) - Vállalati stratégia kidolgozása és optimalizálása
2. Projektmenedzsment tanácsadás (90 perc, 25,000 HUF) - Projekt tervezés, koordináció és megvalósítás támogatása  
3. Innovációs tanácsadás (90 perc, 25,000 HUF) - Új ötletek fejlesztése és piaci lehetőségek felmérése
4. Digitalizációs tanácsadás (120 perc, 35,000 HUF) - Digitális átállás és modernizációs folyamatok
5. Üzleti folyamat optimalizálás (90 perc, 30,000 HUF) - Meglévő folyamatok hatékonyságának növelése
*/

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  serviceId: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  appointmentDate: true,
  duration: true,
  notes: true,
}).extend({
  clientEmail: z.string().email("Érvényes email címet adjon meg"),
  clientName: z.string().min(2, "A név legalább 2 karakter hosszú legyen"),
  clientPhone: z.string().optional(),
  appointmentDate: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
