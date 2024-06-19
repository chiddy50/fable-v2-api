import { UserRepository } from "./UserRepository";
import { PrismaClient } from "@prisma/client";

const prisma: any = new PrismaClient();

export const userRepository = new UserRepository(prisma);
