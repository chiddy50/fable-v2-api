import { Request } from "express";
export interface IJwtPayload {
  id?: string;
  userId?: string;
  publicId?: string;
  email?: string;
  name: string;
}

export interface CustomRequest extends Request {
  user?: IJwtPayload;
}
export interface GetSessionQueryParameters {
  id?: string;
  page?: number|string;
  limit?: number|string;
  from?: string;
  to?: string;
}

export interface User {
  id: string;
  email?: string | null;
  emailVerified?: Date | null;
  name?: string | null;
  publicId?: string | null;
  primaryWalletAddress?: string | null;
  createdAt: Date;
  stories: Story[];
  memories: Memory[];
}


export interface Session {
  id: string;
  userId: string;
  summary?: string | null;
  publicId?: string | null;
  metaData?: Record<string, any>; // Json type in Prisma
  createdAt: Date;
  memories: Memory[];
}

export interface Memory {
  id: string;
  userId: string;
  sessionId: string;
  content: string;
  role: string;
  roleType: string;
  token_count?: string | null;
  publicId?: string | null;
  publicSessionId?: string | null;
  metaData?: Record<string, any>; // Json type in Prisma
  createdAt: Date;
  session: Session;
  user: User;
}

export interface Story {
  id: string;
  userId: string;
  story: any;  // Assuming you will parse this JSON object to a specific type, otherwise use any
  script?: any;  // Optional JSON field
  publicId?: string | null;  // Optional unique string
  metaData?: any | null;  // Optional JSON field
  createdAt: Date;
  user: User;  // Assuming you have a User interface
}