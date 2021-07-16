import { Router } from "express";

import AuthController from "../controller/AuthController";

class AuthRoutes {
  router: Router;
  controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post("/register", this.controller.register);
    this.router.post("/authenticate", this.controller.authenticate);
    this.router.post("/logout", this.controller.logout);
  }
}

export default new AuthRoutes().router;
