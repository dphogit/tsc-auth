import { Router } from "express";

import UserController from "../controller/UserController";

class UserRoutes {
  router: Router;
  controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get("/:id", this.controller.userDetails);
  }
}

export default new UserRoutes().router;
