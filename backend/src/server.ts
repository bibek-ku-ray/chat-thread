import { assertDatabaseConnection } from "./db/db.ts";
import { createApp } from "./app.ts";
import { env } from "./config/env.ts";
import { logger } from "./lib/logger.ts";
import http from "node:http";

async function bootstrap() {
  try {
    await assertDatabaseConnection();

    const app = createApp();
    const server = http.createServer(app);

    const port = Number(env.PORT) || 8081;

    server.listen(port, () => {
      console.log("server running");
      logger.info(`Server is now listening on http://localhost:${port}`);
    });
  } catch (err) {
    logger.error("Failed to start the server", `${(err as Error).message}`);
    process.exit(1);
  }
}

bootstrap();
