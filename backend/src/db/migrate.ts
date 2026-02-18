import fs from "node:fs"
import * as path from "node:path";
import {logger} from "../lib/logger.ts";
import {query} from "./db.ts";

const migrationDir = path.resolve(process.cwd(), "src", "migrations")

async function runMigrations() {
    logger.info(`Looking for the migrations in ${migrationDir}`)

    const files = fs
        .readdirSync(migrationDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

    if(files.length === 0) {
        logger.info("No migration file found!")
        return;
    }

    for(const file of files) {
        const fullPath = path.join(migrationDir, file)
        const sql = fs.readFileSync(fullPath, "utf-8")

        logger.info(`Running migration ${file}`);

        await query(sql)

        logger.info(`Finished migration ${file}`)
    }
}

runMigrations()
    .then(() => {
        logger.info(`All migration run successfully`)
    })
    .catch((err) => {
        logger.error(`Migration fail ${err}`)
        process.exit(1)
    })
