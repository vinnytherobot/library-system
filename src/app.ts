import express, { Request, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import routes from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
    next();
});

//Routes
app.use("/", routes);

app.use(errorHandler);

export default app;