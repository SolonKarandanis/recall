import { PrismaClient } from './generated/prisma/client.js'
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var __prisma: PrismaClient | undefined
}

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "192.168.1.6",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "recall",
  password: process.env.DB_PASSWORD || "recall",
  database: process.env.DB_DATABASE || "recall",
  connectionLimit: 5,
});

export const prisma = globalThis.__prisma || new PrismaClient({adapter}) as any

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
