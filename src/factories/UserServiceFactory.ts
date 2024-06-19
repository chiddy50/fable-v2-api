import { UserService } from "../services/UserService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  userRepository,
} from "./RepositoryFactory";

export const userServiceFactory = new UserService(
  userRepository,
  authService,
  errorService
);
