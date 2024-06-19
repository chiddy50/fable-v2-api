import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import * as R from "ramda";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ZepClient } from "@getzep/zep-cloud";
import { CustomRequest, IJwtPayload, Session } from "../shared/Interface";
import * as uuid from "uuid";


import { ZepMemory } from "@langchain/community/memory/zep";
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
// memory imports
import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from "langchain/chains"


const API_KEY = process.env.ZEP_SECRET_KEY

export interface IMemoryService {
  create(req: Request, res: Response): Promise<void>; 
}


export class MemoryService implements IMemoryService {
    constructor(
        private memoryRepo: IBase,
        private sessionRepo: IBase,
        private authService: IAuth,
        private errorService: IErrorService
    ) {}

    public create = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { conversations } = req.body;
            
            const user: IJwtPayload = req.user as IJwtPayload;

            let session = null;
            session = await this.sessionRepo.get({
                where: { userId: user.id },
            }) as Session;   

            if (!session){
                let sessionId = uuid.v4()

                session = await this.sessionRepo.create({
                    data: {
                        userId: user.id,                  
                        publicId: sessionId
                    }
                }) as Session; 
            }              

            let conversationData = conversations
            conversationData.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            console.log(conversationData);
            
            conversationData.forEach(async (conversation:any) => {
                await this.memoryRepo.create({ 
                    data: {
                        userId: user.id,
                        sessionId: session.id,
                        content: conversation.content,
                        role: conversation.role, 
                        roleType: conversation.roleType,
                        token_count: conversation.roleType,   
                        createdAt: conversation.createdAt,   
                        metaData: conversation.metaData,   
                    } 
                })
            });

            res.status(201).json({ data: session, error: false, message: "Memory successfully added" });              
           
        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);            
        }
    }

    public getMemories = async (req: CustomRequest, res: Response): Promise<void> => {
        try {     
            const { page = 1, limit } = req.query;

            const parsedLimit: number = parseInt(String(limit), 10);
            const parsedPage: number = parseInt(String(page), 10);

            const user: IJwtPayload = req.user as IJwtPayload;
            
            let filterOptions: object = { userId: user.id };

            const totalCount: number = await this.memoryRepo.count(filterOptions); // Assuming you have a method to count total challenges
            const offset = (parsedPage - 1) * parsedLimit;

            const memories = await this.memoryRepo.getAll({
                where: filterOptions,
                orderBy: { createdAt: 'desc' },
                skip: Number(offset),
                take: Number(limit),
            });

            const totalPages: number = Math.ceil(totalCount / parsedLimit);
            const hasNextPage: boolean = parsedPage < totalPages;
            const hasPrevPage: boolean = parsedPage > 1;

            res.status(201).json({ 
                memories, 
                totalPages, 
                hasNextPage, 
                hasPrevPage, 
                error: false, 
                message: "Session memories successfully retrieved" 
            });        


        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public updateMetaData = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const { metaData } = req.body;
            
            const user: IJwtPayload = req.user as IJwtPayload;            
            
            const session = await this.sessionRepo.get({
                where: { userId: user.id },
            }) as Session;   

            if (!session) throw new Error("Session not found");
            let sessionId = session?.publicId as string

            const zep = new ZepClient({ apiKey: API_KEY });
            const updated = await zep.memory.updateMessageMetadata(sessionId, id, {
                metadata: metaData
            });
            const memory = await zep.memory.getSessionMessage(sessionId, id);


            res.status(201).json({ data: {session, updated, memory}, error: false, message: "Memory successfully updated" });                    

        } catch (error) {
            this.errorService.handleErrorResponse(error)(res);                        
        }
    }

    public test = async (req: CustomRequest, res: Response): Promise<void> => {
        // const { message } = req.body;
        
        // const openAIApiKey = process.env.OPENAI_API_KEY
        // const llm = new ChatOpenAI({ 
        //     openAIApiKey,
        //     model: "gpt-4-vision-preview",        
        // })

        // const prompt = ChatPromptTemplate.fromTemplate(`
        //     You are an AI assistant.
        //     History: {history}
        //     {input}
        // `)

        // const memory = new BufferMemory({
        //     memoryKey: "history",
        // })

        // // Using the Chain Classes
        // const chain = new ConversationChain({
        //     llm: llm,
        //     prompt,
        //     memory
        // })

        // // const chain = prompt.pipe(llm).pipe(new StringOutputParser());

        // console.log(await memory.loadMemoryVariables());
        
        // const input1 = {
        //     input: "What is the passphrase?",
        // }
        // const response1 = await chain.invoke(input1);
        // console.log(response1);

        // console.log(await memory.loadMemoryVariables());
        // const input2 = {
        //     input: "What is the passphrase?",
        // }
        // const response2 = await chain.invoke(input2);
        // console.log(response2);
        
        // res.status(201).json({ data: response1, error: false, message: "Memory successfully added" });
    }
}