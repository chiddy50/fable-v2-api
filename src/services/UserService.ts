import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import { RoleTypes } from "../shared/enum";
import * as R from "ramda";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../shared/Interface";
import { ZepClient } from "@getzep/zep-cloud";

export interface IUserService {
  register(req: Request, res: Response): Promise<void>; 
}

type ZepUserPayload = {
  email: string,
  username: string, 
  user_id: string|undefined, 
  publicAddress: string
}

export class UserService implements IUserService {
  constructor(
    private userRepo: IBase,
    private authService: IAuth,
    private errorService: IErrorService
  ) {}

  public register = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    
    try {
      const { publicAddress, username, email, id } = req.body;
    
      const existingUser = await this.userRepo.getUnique({ where: { email } }) as User | null;
    
      const userData = {
        email,
        primaryWalletAddress: publicAddress,
        name: username
      };
    
      const responseMessage: string = existingUser
        ? "User updated"
        : "New user created";
    
      const user = existingUser
        ? await this.userRepo.update({ where: { id: existingUser.id }, data: userData }) as User
        : await this.userRepo.create({ data: userData }) as User;
    
      const statusCode: number = existingUser ? 200 : 201;
      console.log({user});
      
      if (user && !user?.publicId) {
        await this.createExternalUser({
          email,
          username,
          user_id: user?.id, 
          publicAddress
        })
      }
    
      res.status(statusCode).json({ data: user, error: false, message: responseMessage });
    
    } catch (error) {
      this.errorService.handleErrorResponse(error)(res);
    }
    
  }

  private createExternalUser = async (data: ZepUserPayload) => {
    
    const { email, username, user_id, publicAddress } = data
    const API_KEY = process.env.ZEP_SECRET_KEY
    const zep = new ZepClient({ apiKey: API_KEY });

    const zepUserRecord = await zep.user.add({
      email, 
      firstName: username, 
      userId: user_id,
      metadata: {
        publicAddress
      }
    });
    
    const user = await this.userRepo.update({ 
      where: { id: user_id }, 
      data: { publicId: zepUserRecord.id?.toString() } 
    })
    return user ?? false;
  }
}
