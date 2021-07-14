import express from "express";
import passport from "passport";
import session from "express-session";

import { localStrategySetup, sessionSetup } from "./config/passport";
import Routes from "./routes";

const SESSION_SECRET = <string>process.env.SESSION_SECRET;

export default class Server {
  constructor(app: express.Application) {
    this.config(app); // Middleware Configuration
    new Routes(app); // Route Configuration
  }

  public config(app: express.Application): void {
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
}
