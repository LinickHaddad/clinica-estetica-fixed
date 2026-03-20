import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { clientes, evolucoes, fichas, InsertCliente, InsertEvolucao, InsertFicha, users, InsertUser, Cliente, Ficha, Evolucao, User } from "../drizzle/schema";
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── AUTENTICAÇÃO ───────────────────────────────────────────────────────────

// DB migration applied - schema corrected
export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const user: InsertUser = {
    email,
    password,
    name,
  };
  
  await db.insert(users).values(user);
  
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('[DB] getUserByEmail error:', error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(users).where(eq(users.id, id));
  return result.length > 0 ? result[0] : null;
}

// ─── CLIENTES ───────────────────────────────────────────────────────────────

export async function createCliente(userId: number, data: Omit<InsertCliente, 'id' | 'userId'>): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = nanoid();
  await db.insert(clientes).values({
    ...data,
    id,
    userId,
  } as InsertCliente);
  
  return id;
}

export async function getClientesByUser(userId: number): Promise<Cliente[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(clientes).where(eq(clientes.userId, userId));
}

export async function getClienteById(id: string, userId: number): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(clientes)
    .where(eq(clientes.id, id))
    ;
  
  if (result.length === 0) return null;
  if (result[0].userId !== userId) throw new Error("Unauthorized");
  
  return result[0];
}

export async function updateCliente(id: string, userId: number, data: Partial<InsertCliente>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  const existing = await getClienteById(id, userId);
  if (!existing) throw new Error("Cliente not found");
  
  await db.update(clientes).set({
    ...data,
    atualizadoEm: new Date(),
  }).where(eq(clientes.id, id));
}

export async function deleteCliente(id: string, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  const existing = await getClienteById(id, userId);
  if (!existing) throw new Error("Cliente not found");
  
  await db.delete(clientes).where(eq(clientes.id, id));
}

// ─── FICHAS ──────────────────────────────────────────────────────────────────

export async function createFicha(clienteId: string, userId: number, data: Omit<InsertFicha, 'id'>): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  await getClienteById(clienteId, userId);
  
  const id = nanoid();
  await db.insert(fichas).values({
    ...data,
    id,
    clienteId,
  } as InsertFicha);
  
  return id;
}

export async function getFichasByCliente(clienteId: string, userId: number): Promise<Ficha[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Verify ownership
  await getClienteById(clienteId, userId);
  
  return db.select().from(fichas).where(eq(fichas.clienteId, clienteId));
}

export async function getFichaById(id: string, userId: number): Promise<Ficha | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(fichas).where(eq(fichas.id, id));
  if (result.length === 0) return null;
  
  // Verify ownership
  await getClienteById(result[0].clienteId, userId);
  
  return result[0];
}

export async function deleteFicha(id: string, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const ficha = await getFichaById(id, userId);
  if (!ficha) throw new Error("Ficha not found");
  
  await db.delete(fichas).where(eq(fichas.id, id));
}

// ─── EVOLUÇÕES ──────────────────────────────────────────────────────────────

export async function createEvolucao(clienteId: string, userId: number, data: Omit<InsertEvolucao, 'id'>): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verify ownership
  await getClienteById(clienteId, userId);
  
  const id = nanoid();
  await db.insert(evolucoes).values({
    ...data,
    id,
    clienteId,
  } as InsertEvolucao);
  
  return id;
}

export async function getEvolucoesByCliente(clienteId: string, userId: number): Promise<Evolucao[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Verify ownership
  await getClienteById(clienteId, userId);
  
  return db.select().from(evolucoes).where(eq(evolucoes.clienteId, clienteId));
}

export async function deleteEvolucao(id: string, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(evolucoes).where(eq(evolucoes.id, id));
  if (result.length === 0) throw new Error("Evolucao not found");
  
  // Verify ownership
  await getClienteById(result[0].clienteId, userId);
  
  await db.delete(evolucoes).where(eq(evolucoes.id, id));
}
