import express, { Application, Request, Response, NextFunction } from "express";
import passport from "passport";
import session from "express-session";

import { localStrategySetup, sessionSetup } from "./config/passport";
import Routes from "./routes";

const SESSION_SECRET = <string>process.env.SESSION_SECRET;

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
    app.use(this.notFoundHandler);
    app.use(this.errorHandler);
  }

  private config(app: Application): void {
    // Add middleware here
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    localStrategySetup();
    sessionSetup();
  }

  private errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    res.status(500).json({
      status: "error",
      data: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }

  private notFoundHandler(_req: Request, res: Response) {
    res.status(404).json({
      status: "failed",
      data: {
        reason: "Request endpoint was not found.",
      },
    });
  }
}
