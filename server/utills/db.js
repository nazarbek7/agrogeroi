// Prefer the root-level Prisma Client (generated from ../prisma/schema.prisma),
// which includes bulk upload models. Fallback to local if not available.
let PrismaClient;
try {
    // When running server/* scripts, this resolves to project root node_modules
    ({ PrismaClient } = require("../../node_modules/@prisma/client"));
} catch (e) {
    ({ PrismaClient } = require("@prisma/client"));
}

const prismaClientSingleton = () => {
    // Validate that DATABASE_URL is present
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    if (process.env.NODE_ENV === "development") {
        const url = new URL(process.env.DATABASE_URL);
        console.log(`Database connection: ${url.protocol}//${url.hostname}`);
    }

    return new PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ['query', 'info', 'warn', 'error']
            : ['error', 'warn'],
    });
}

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;