import { Application } from "express";

import UserRouter from "./UserRoutes";

const API = "/api/v1";

class Routes {
  constructor(app: Application) {
    app.use(`${API}/user`, UserRouter);
  }
}

export default Routes;
