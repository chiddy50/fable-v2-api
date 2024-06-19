
import { MemoryRepository } from "../repositories/MemoryRepository";
import { SessionRepository } from "../repositories/SessionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { PrismaClient } from "@prisma/client";

const prisma: any = new PrismaClient();

export const userRepository = new UserRepository(prisma);
export const sessionRepository = new SessionRepository(prisma);
export const memoryRepository = new MemoryRepository(prisma)