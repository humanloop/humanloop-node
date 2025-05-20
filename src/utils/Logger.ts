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

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Helper class for colored console output with log level filtering
 */
export default class Logger {
    private static currentLevel: number = 1; // Default to 'warn'
    private static readonly levels: Record<LogLevel, number> = {
        'error': 0,
        'warn': 1,
        'info': 2,
        'debug': 3
    };

    /**
     * Set the log level for filtering
     */
    static setLevel(level: LogLevel): void {
        this.currentLevel = this.levels[level] || 1;
    }

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
        if (this.currentLevel >= 1) {
            console.warn(`${Colors.YELLOW}${Logger.toString(message)}${Colors.RESET}`);
        }
    }

    /**
     * Log an info message in cyan
     */
    static info(message: any): void {
        if (this.currentLevel >= 2) {
            console.info(`${Colors.CYAN}${Logger.toString(message)}${Colors.RESET}`);
        }
    }

    /**
     * Log a success message in green
     */
    static success(message: any): void {
        if (this.currentLevel >= 2) { // Success is info level
            console.log(`${Colors.GREEN}${Logger.toString(message)}${Colors.RESET}`);
        }
    }

    /**
     * Log an error message in red
     */
    static error(message: any): void {
        if (this.currentLevel >= 0) {
            console.error(`${Colors.RED}${Logger.toString(message)}${Colors.RESET}`);
        }
    }

    /**
     * Log a plain message without any color (at info level)
     */
    static log(message: any): void {
        if (this.currentLevel >= 2) {
            console.log(Logger.toString(message));
        }
    }

    /**
     * Log a debug message (for detailed information)
     */
    static debug(message: any): void {
        if (this.currentLevel >= 3) {
            console.debug(Logger.toString(message));
        }
    }

    /**
     * Log a message with custom color (at info level)
     */
    static withColor(message: any, color: keyof typeof Colors): void {
        if (this.currentLevel >= 2) {
            console.log(`${Colors[color]}${Logger.toString(message)}${Colors.RESET}`);
        }
    }
}