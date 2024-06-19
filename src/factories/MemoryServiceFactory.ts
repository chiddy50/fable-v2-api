import { MemoryService } from "../services/MemoryService";
import { authService } from "./AuthServiceFactory";
import { errorService } from "./ErrorServiceFactory";
import {
  memoryRepository,
  sessionRepository,
} from "./RepositoryFactory";

export const memoryServiceFactory = new MemoryService(
  memoryRepository,
  sessionRepository,
  authService,
  errorService
);
