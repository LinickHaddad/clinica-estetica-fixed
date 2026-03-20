import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserById } from "../../server/db";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get session cookie
    const sessionCookie = opts.req.cookies?.[COOKIE_NAME];
    
    if (sessionCookie) {
      // Parse session cookie to get user ID
      const userId = parseInt(sessionCookie, 10);
      if (!isNaN(userId)) {
        user = await getUserById(userId);
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

export function setSessionCookie(res: CreateExpressContextOptions["res"], userId: number) {
  res.cookie(COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function clearSessionCookie(res: CreateExpressContextOptions["res"]) {
  res.clearCookie(COOKIE_NAME);
}
