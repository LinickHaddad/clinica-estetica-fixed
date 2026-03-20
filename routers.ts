import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ─── CLIENTES ──────────────────────────────────────────────────────────────────

  clientes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getClientesByUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        nome: z.string().min(1),
        cpf: z.string().optional(),
        rg: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().optional(),
        endereco: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        dataNascimento: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createCliente(ctx.user.id, input);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getClienteById(input.id, ctx.user.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        nome: z.string().optional(),
        cpf: z.string().optional(),
        rg: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().optional(),
        endereco: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        dataNascimento: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateCliente(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteCliente(input.id, ctx.user.id);
      }),
  }),

  // ─── FICHAS ──────────────────────────────────────────────────────────────────

  fichas: router({
    listByCliente: protectedProcedure
      .input(z.object({ clienteId: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getFichasByCliente(input.clienteId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        clienteId: z.string(),
        tipo: z.enum(["avaliacao-corporal", "avaliacao-facial", "anamnese-gluteos"]),
        dados: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createFicha(input.clienteId, ctx.user.id, {
          tipo: input.tipo,
          dados: input.dados,
          criadoPor: ctx.user.email || ctx.user.name || "Sistema",
        } as any);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getFichaById(input.id, ctx.user.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteFicha(input.id, ctx.user.id);
      }),
  }),

  // ─── EVOLUÇÕES ──────────────────────────────────────────────────────────────

  evolucoes: router({
    listByCliente: protectedProcedure
      .input(z.object({ clienteId: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getEvolucoesByCliente(input.clienteId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        clienteId: z.string(),
        data: z.string(),
        procedimento: z.string().min(1),
        observacoes: z.string().optional(),
        profissional: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createEvolucao(input.clienteId, ctx.user.id, {
          data: input.data,
          procedimento: input.procedimento,
          observacoes: input.observacoes || undefined,
          profissional: input.profissional || undefined,
        } as any);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteEvolucao(input.id, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
