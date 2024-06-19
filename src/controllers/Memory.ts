import express, { Router, Request, Response } from "express";
import { memoryServiceFactory } from "../factories/MemoryServiceFactory";
import { middelwareServiceFactory } from "../factories/MiddleServiceFactory";

const MemoryController: Router = express.Router();

MemoryController.post(
    "/", 
    middelwareServiceFactory.verfyToken,
    memoryServiceFactory.create
);

MemoryController.get(
    "/", 
    middelwareServiceFactory.verfyToken,
    memoryServiceFactory.getMemories
);


MemoryController.put(
    "/:id/update", 
    middelwareServiceFactory.verfyToken,
    memoryServiceFactory.updateMetaData
);

MemoryController.post(
    "/test", 
    memoryServiceFactory.test
);



export default MemoryController;