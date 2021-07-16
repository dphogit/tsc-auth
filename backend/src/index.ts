import "dotenv/config";

import Application from "./Application";

const app = new Application();

const PORT = parseInt(<string>process.env.SERVER_PORT) || 4000;

app.start(PORT);
