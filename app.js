import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/Error.js";
config({
  path: "./config/config.env",
});
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
import user from "./routes/userRoutes.js";
app.use("/api", user);

export default app;
app.use(ErrorMiddleware);
