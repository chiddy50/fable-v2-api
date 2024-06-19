import { Auth, IAuth } from "../shared/AuthService";

const secret = (process.env.AUTH_SECRET as string) || "test";

export const authService: IAuth = new Auth(secret);
