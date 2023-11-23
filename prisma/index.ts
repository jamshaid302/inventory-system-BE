import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// prisma commands
// npx prisma db push
// npx prisma studio   http://localhost:5555/
// npm install @prisma/client
// npx prisma generate
// npx prisma migrate dev --name init
