import { Application } from "express";

import AuthRouter from "./AuthRoutes";

const API = "/api/v1";

class Routes {
  constructor(app: Application) {
    app.use(`${API}/auth`, AuthRouter);
  }
}

export default Routes;
