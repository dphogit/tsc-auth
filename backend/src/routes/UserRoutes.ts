import { Router } from "express";

import upload from "../config/multer";
import UserController from "../controller/UserController";
import AuthController from "../controller/AuthController";
import { validateEditprofile } from "../middleware/Validation";

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
    this.router.put(
      "/:id",
      this.authController.authenticateJWT,
      upload.single("photo"),
      validateEditprofile,
      this.userController.editProfile
    );
  }
}

export default new UserRoutes().router;
