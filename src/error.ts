export class HumanloopRuntimeError extends Error {
    /**
     * SDK custom code handles exceptions by populating Logs' `error` field.
     *
     * This exception signals an error severe enough to crash the execution
     * e.g. illegal use of decorators.
     */

    constructor(message?: string) {
        super(message);
    }

    toString(): string {
        if (this.message === undefined) {
            return super.toString();
        }
        return this.message;
    }
}
