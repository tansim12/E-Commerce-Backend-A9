import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

const normalMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://e-commerce-a9.vercel.app",
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};
export default normalMiddleware;
