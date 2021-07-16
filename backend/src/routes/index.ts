import { Application } from "express";

import AuthRouter from "./AuthRoutes";
import UserRouter from "./UserRoutes";

const API = "/api/v1";

class Routes {
  constructor(app: Application) {
    app.use(`${API}/auth`, AuthRouter);
    app.use(`${API}/user`, UserRouter);
  }
}

export default Routes;
