import { int, json, longtext, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: text("name"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── CLIENTES ────────────────────────────────────────────────────────────────

export const clientes = mysqlTable("clientes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("userId").notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }),
  rg: varchar("rg", { length: 20 }),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  endereco: varchar("endereco", { length: 255 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  dataNascimento: varchar("dataNascimento", { length: 10 }),
  observacoes: longtext("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

// ─── FICHAS ──────────────────────────────────────────────────────────────────

export const fichas = mysqlTable("fichas", {
  id: varchar("id", { length: 36 }).primaryKey(),
  clienteId: varchar("clienteId", { length: 36 }).notNull(),
  tipo: mysqlEnum("tipo", ["avaliacao-corporal", "avaliacao-facial", "anamnese-gluteos"]).notNull(),
  dados: json("dados").$type<Record<string, unknown>>().notNull(),
  criadoPor: varchar("criadoPor", { length: 255 }),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type Ficha = typeof fichas.$inferSelect;
export type InsertFicha = typeof fichas.$inferInsert;

// ─── EVOLUÇÕES ───────────────────────────────────────────────────────────────

export const evolucoes = mysqlTable("evolucoes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  clienteId: varchar("clienteId", { length: 36 }).notNull(),
  data: varchar("data", { length: 10 }).notNull(),
  procedimento: varchar("procedimento", { length: 255 }).notNull(),
  observacoes: longtext("observacoes"),
  profissional: varchar("profissional", { length: 255 }),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type Evolucao = typeof evolucoes.$inferSelect;
export type InsertEvolucao = typeof evolucoes.$inferInsert;