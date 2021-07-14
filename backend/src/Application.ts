import express from "express";
import { Connection, createConnection } from "typeorm";

import Server from "./Server";

class Application {
  app: express.Application;
  server: Server;

  constructor() {
    this.app = express();
    this.server = new Server(this.app);
  }

  public start(port: number) {
    createConnection()
      .then((cn: Connection) => {
        console.log("Postgres connection: " + cn.name);
        this.app.listen(port, () => console.log("App running on port " + port));
      })
      .catch((err) => console.log(err));
  }
}
export default Application;
