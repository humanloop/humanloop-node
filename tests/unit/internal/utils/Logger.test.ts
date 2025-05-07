import Logger from "../../../../src/utils/Logger";

describe("Logger", () => {
    let consoleSpy: {
        log: jest.SpyInstance;
        info: jest.SpyInstance;
        warn: jest.SpyInstance;
        debug: jest.SpyInstance;
    };

    beforeEach(() => {
        // Spy on all console methods
        consoleSpy = {
            log: jest.spyOn(console, "log"),
            info: jest.spyOn(console, "info"),
            warn: jest.spyOn(console, "warn"),
            debug: jest.spyOn(console, "debug"),
        };
        // Reset log level before each test
        Logger.setLevel("warn");
    });

    afterEach(() => {
        // Restore all spies
        Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
    });

    describe("log levels", () => {
        it("should respect log level settings", () => {
            Logger.setLevel("warn");
            Logger.debug("debug message");
            Logger.info("info message");
            Logger.warn("warn message");

            expect(consoleSpy.debug).not.toHaveBeenCalled();
            expect(consoleSpy.info).not.toHaveBeenCalled();
            expect(consoleSpy.warn).toHaveBeenCalledWith(
                expect.stringContaining("warn"),
            );
        });

        it("should show all messages when level is set to debug", () => {
            Logger.setLevel("debug");
            Logger.debug("debug message");
            Logger.info("info message");
            Logger.warn("warn message");

            expect(consoleSpy.debug).toHaveBeenCalledWith(
                expect.stringContaining("debug"),
            );
            expect(consoleSpy.info).toHaveBeenCalledWith(
                expect.stringContaining("info"),
            );
            expect(consoleSpy.warn).toHaveBeenCalledWith(
                expect.stringContaining("warn"),
            );
        });
    });

    describe("message formatting", () => {
        it("should handle different input types", () => {
            Logger.setLevel("info");

            Logger.info(undefined);
            Logger.info(null);
            Logger.info({ key: "value" });

            expect(consoleSpy.info).toHaveBeenCalledWith(
                expect.stringContaining("undefined"),
            );
            expect(consoleSpy.info).toHaveBeenCalledWith(
                expect.stringContaining("null"),
            );
            expect(consoleSpy.info).toHaveBeenCalledWith(
                expect.stringContaining("[object Object]"),
            );
        });
    });
});
