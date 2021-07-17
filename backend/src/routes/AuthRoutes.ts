import { Router } from "express";

import AuthController from "../controller/AuthController";
import { validateRegister } from "../middleware/validation";

class AuthRoutes {
  router: Router;
  controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post("/register", validateRegister, this.controller.register);
    this.router.post("/login", this.controller.authenticateLocal);
    this.router.post(
      "/logout",
      this.controller.isAuthenticated,
      this.controller.logout
    );
  }
}

export default new AuthRoutes().router;
