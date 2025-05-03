// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default prisma;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['warn', 'error'], // log warnings and errors
});

// Add middleware to log query durations
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  console.log(`[⏱️ Prisma] ${params.model}.${params.action} took ${duration}ms`);
  return result;
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
