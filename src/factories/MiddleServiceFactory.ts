import { MiddlewareService } from "../shared/MiddlewareService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import { userRepository } from "./RepositoryFactory";

export const middelwareServiceFactory = new MiddlewareService(authService, errorService, userRepository);
