import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import * as R from "ramda";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ZepClient } from "@getzep/zep-cloud";
import { CustomRequest, GetSessionQueryParameters, IJwtPayload, Session } from "../shared/Interface";
import * as uuid from "uuid";
import type { Message } from "@getzep/zep-cloud/api";

import {
    encode,
    decode,
    isWithinTokenLimit,
} from 'gpt-tokenizer'

const API_KEY = process.env.ZEP_SECRET_KEY

export interface ISessionService {
  create(req: Request, res: Response): Promise<void>; 
  getAll(req: Request, res: Response): Promise<void>; 
  addMemoryToSession(req: Request, res: Response): Promise<void>; 
}


export class SessionService implements ISessionService {
    constructor(
        private sessionRepo: IBase,
        private memoryRepo: IBase,
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public create = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const user: IJwtPayload = req.user as IJwtPayload;
            
            const zep = new ZepClient({ apiKey: API_KEY });
            
            const userId = user.id;    
            const sessionId = uuid.v4()

            const session = await zep.memory.addSession({
                sessionId: sessionId,
                userId: userId
            });
    
            const savedSession = await this.sessionRepo.create({
                data: {
                    userId: user.id,                  
                    summary: '',                 
                    publicId: sessionId, 
                    metaData: session
                }
            });   
            
            res.status(201).json({ data: session, error: false, message: "Success" });        
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public getAll = async (req: CustomRequest, res: Response): Promise<void> => {
    
        try {
            const user: IJwtPayload = req.user as IJwtPayload;
            const zep = new ZepClient({ apiKey: API_KEY });

            let userId: string = user?.id ?? ''
            const sessions = await zep.user.getSessions(userId);

            res.status(200).json({
                sessions
            });

        } catch (error) {
          this.errorService.handleErrorResponse(error)(res);
        }
    };

    public addMemoryToSession = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            const { role, roleType, content, metadata } = req.body
            const user: IJwtPayload = req.user as IJwtPayload;
            const zep = new ZepClient({ apiKey: API_KEY });
            
            const history: Message[] = [
                { role, roleType, content, metadata }
            ];
            let tokenCount = encode(content).length

            const session = await this.sessionRepo.get({
                where: { publicId: id },
            }) as Session;    
            
            if (!session) throw new Error("Session not found");

            const memory = await zep.memory.add(id, {
                messages: history
            });
                    
            const memorySaved =  await this.saveMemory({
                userId: user.id,
                sessionId: session?.id,
                publicSessionId: id,
                content,
                role, 
                roleType,
                token_count: tokenCount                
            })

            res.status(201).json({ data: memory, error: false, message: "Memory successfully added" });        
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public getSessionMemories = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user: IJwtPayload = req.user as IJwtPayload;
            const zep = new ZepClient({ apiKey: API_KEY });

            const session = await this.sessionRepo.get({
                where: { userId: user.id },
            }) as Session; 

            if (session) {
                let sessionId = session?.publicId as string

                // const memories = await zep.memory.get(sessionId);
                const memories = await zep.memory.getSessionMessages(sessionId);
                
                const summaries = await zep.memory.getSummaries(sessionId);

                res.status(201).json({ data: { memories, summaries }, error: false, message: "Session memories successfully retrieved" });        
            }

            if (!session) {
                const sessionId = uuid.v4()

                const newSession = await zep.memory.addSession({
                    sessionId: sessionId,
                    userId: user.id
                });

                const memories = await zep.memory.getSessionMessages(sessionId);
                console.log({memories});

                res.status(201).json({ data: memories, error: false, message: "Session memories successfully retrieved" });        
            }


        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public removeSession = async (req: CustomRequest, res: Response): Promise<void> => {
        try {            
            const { id } = req.params;

            const user: IJwtPayload = req.user as IJwtPayload;
            const zep = new ZepClient({ apiKey: API_KEY });
            const deleted = await zep.memory.delete(id);

            res.status(200).json({ data: deleted, error: false, message: "success" });        
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }

    }

    public getSessionSummary = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user: IJwtPayload = req.user as IJwtPayload;
            const zep = new ZepClient({ apiKey: API_KEY });
            const summaries = await zep.memory.getSummaries("sessionId");
            res.status(200).json({ data: summaries, error: false, message: "success" });        

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                                    
        }
    }

    private saveMemory = async (data: any) => {     
        // publicId                
        // metaData                   
        const session = await this.memoryRepo.create({ 
            data: {
                userId: data.userId,
                sessionId: data?.sessionId,
                publicSessionId: data.publicSessionId,
                content: data.content,
                role: data.role, 
                roleType: data.roleType,
                token_count: data.roleType,   
            } 
        })
        return
    }
}