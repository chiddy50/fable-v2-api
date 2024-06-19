// userRouter.ts
import express, { Router, Request, Response } from "express";
import { userServiceFactory } from "../factories/UserServiceFactory";
import { middelwareServiceFactory } from "../factories/MiddleServiceFactory";

const UserController: Router = express.Router();
UserController.post("/", userServiceFactory.register);

export default UserController;
