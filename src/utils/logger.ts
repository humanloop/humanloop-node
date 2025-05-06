/**
 * Logger utility for consistent colored console output across the Humanloop SDK.
 */

// ANSI escape codes for colors
export const Colors = {
    YELLOW: "\x1b[93m",
    CYAN: "\x1b[96m",
    GREEN: "\x1b[92m",
    RED: "\x1b[91m",
    RESET: "\x1b[0m",
} as const;

/**
 * Helper class for colored console output
 */
export class Logger {
    /**
     * Safely converts any value to a string, handling undefined/null
     */
    private static toString(value: any): string {
        if (value === undefined) return "undefined";
        if (value === null) return "null";
        return String(value);
    }

    /**
     * Log a warning message in yellow
     */
    static warn(message: any): void {
        console.warn(`${Colors.YELLOW}${Logger.toString(message)}${Colors.RESET}`);
    }

    /**
     * Log an info message in cyan
     */
    static info(message: any): void {
        console.info(`${Colors.CYAN}${Logger.toString(message)}${Colors.RESET}`);
    }

    /**
     * Log a success message in green
     */
    static success(message: any): void {
        console.log(`${Colors.GREEN}${Logger.toString(message)}${Colors.RESET}`);
    }

    /**
     * Log an error message in red
     */
    static error(message: any): void {
        console.error(`${Colors.RED}${Logger.toString(message)}${Colors.RESET}`);
    }

    /**
     * Log a plain message without any color
     */
    static log(message: any): void {
        console.log(Logger.toString(message));
    }

    /**
     * Log a message with custom color
     */
    static withColor(message: any, color: keyof typeof Colors): void {
        console.log(`${Colors[color]}${Logger.toString(message)}${Colors.RESET}`);
    }
}
