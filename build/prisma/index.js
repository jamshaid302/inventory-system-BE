"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = prisma;
// prisma commands
// npx prisma db push
// npx prisma studio   http://localhost:5555/
// npm install @prisma/client
// npx prisma generate
// npx prisma migrate dev --name init
