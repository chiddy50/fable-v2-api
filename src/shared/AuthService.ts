import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";
import { IJwtPayload } from "./Interface";

export interface IAuth {
  hash(payload: string): Promise<string>;
  compare(hash: string, payload: string): Promise<boolean>;
  encrypt(payload: IJwtPayload): Promise<string>;
  decrypt(token: string): Promise<IJwtPayload>;
}

export class Auth implements IAuth {
  private secret: Buffer;
  constructor(secret: string) {
    this.secret = Buffer.from(secret, "utf-8");
  }

  public hash = async (payload: string): Promise<string> => {
    const hashed = await bcrpyt.hash(payload, 10);
    return hashed;
  };

  public compare = async (hash: string, payload: string): Promise<boolean> => {
    const matched = await bcrpyt.compare(hash, payload);
    return matched;
  };

  public encrypt = async (payload: IJwtPayload): Promise<string> => {
    const token = jwt.sign(payload, this.secret, { expiresIn: "1h" });
    return token;
  };

  public decrypt = async (token: string): Promise<IJwtPayload> => {
    try {
      const decoded: IJwtPayload = jwt.verify(
        token,
        this.secret
      ) as IJwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  };
}
