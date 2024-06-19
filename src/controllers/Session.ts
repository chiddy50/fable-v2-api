import express, { Router, Request, Response } from "express";
import { sessionServiceFactory } from "../factories/SessionServiceFactory";
import { middelwareServiceFactory } from "../factories/MiddleServiceFactory";

const SessionController: Router = express.Router();
SessionController.post(
    "/", 
    middelwareServiceFactory.verfyToken,
    sessionServiceFactory.create
);

SessionController.get(
    "/", 
    middelwareServiceFactory.verfyToken,
    sessionServiceFactory.getAll
);

SessionController.post(
    "/:id/memory", 
    middelwareServiceFactory.verfyToken,
    sessionServiceFactory.addMemoryToSession
);

SessionController.get(
    "/:id/memories", 
    middelwareServiceFactory.verfyToken,
    sessionServiceFactory.getSessionMemories
);

SessionController.get(
    "/:id/summaries", 
    middelwareServiceFactory.verfyToken,
    sessionServiceFactory.getSessionSummary
);


SessionController.delete(
    "/:id", 
    middelwareServiceFactory.verfyToken,
    sessionServiceFactory.removeSession
);



export default SessionController;