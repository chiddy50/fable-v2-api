import { SessionService } from "../services/SessionService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  sessionRepository,
  memoryRepository,
} from "./RepositoryFactory";

export const sessionServiceFactory = new SessionService(
  sessionRepository,
  memoryRepository,
  authService,
  errorService
);
