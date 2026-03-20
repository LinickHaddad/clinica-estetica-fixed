import type { Express, Request, Response } from "express";
import * as db from "../db";
import { setSessionCookie } from "./context";
import bcrypt from "bcryptjs";
import { COOKIE_NAME } from "@shared/const";

export function registerAuthRoutes(app: Express) {
  // Rota de registro
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      // Verificar se usuário já existe
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await db.createUser(email, hashedPassword, name);

      // Definir cookie de sessão
      setSessionCookie(res, user.id);

      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[Auth] Register failed:", errorMsg, error);
      res.status(500).json({ error: `Registration failed: ${errorMsg}` });
    }
  });

  // Rota de login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      // Buscar usuário
      const user = await db.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Definir cookie de sessão
      setSessionCookie(res, user.id);

      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Rota de logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  // Rota para obter usuário atual
  app.get("/api/auth/me", (req: Request, res: Response) => {
    const sessionCookie = req.cookies?.[COOKIE_NAME];
    
    if (!sessionCookie) {
      res.json({ user: null });
      return;
    }

    const userId = parseInt(sessionCookie, 10);
    if (isNaN(userId)) {
      res.json({ user: null });
      return;
    }

    // Buscar usuário (isso será feito no context, aqui apenas retornamos o ID)
    res.json({ userId });
  });
}
