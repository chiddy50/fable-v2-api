// app.ts
import express from "express";
import UserController from "./controllers/User";
import SessionController from "./controllers/Session";
import dotenv from "dotenv";
import cors from 'cors';
import MemoryController from "./controllers/Memory";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json());

app.use("/users", UserController);
app.use("/sessions", SessionController);
app.use("/memories", MemoryController);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
