import { Router } from "express";

import UserController from "../controller/UserController";
import AuthController from "../controller/AuthController";

class UserRoutes {
  router: Router;
  userController: UserController;
  authController: AuthController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      "/:id",
      this.authController.authenticateJWT,
      this.userController.userDetails
    );
  }
}

export default new UserRoutes().router;
