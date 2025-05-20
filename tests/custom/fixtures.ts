import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a temporary directory for tests
 * @param prefix Optional prefix for the directory name
 * @returns Path to the created directory and a cleanup function
 */
export function createTempDir(prefix = "test") {
    const tempDir = path.join(process.cwd(), "test-tmp", `${prefix}-${uuidv4()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const cleanup = () => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    };

    return { tempDir, cleanup };
}
