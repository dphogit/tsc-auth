import express from "express";
import Routes from "./routes";

export default class Server {
  constructor(app: express.Application) {
    this.config(app); // Middleware Configuration
    new Routes(app); // Route Configuration
  }

  public config(app: express.Application): void {
    // Add middleware here
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  }
}
