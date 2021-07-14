import { Router } from "express";

import UserController from "../controller/UserController";

class HelloRoutes {
  router: Router;
  controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post("/register", this.controller.registerUser);
  }
}

export default new HelloRoutes().router;
