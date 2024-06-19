import { Response } from "express";

export interface IErrorService {
  handleErrorResponse(error: any): (res: Response) => Promise<void>;
}

export class ErrorService implements IErrorService {
  public handleErrorResponse(error: any): (res: Response) => Promise<void> {
    return async (res: Response) => {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else if (typeof error === "string") {
        res.status(400).json({ message: error });
      } else {
        res.status(400).json({ message: "Unable to process request" });
      }
    };
  }
}
