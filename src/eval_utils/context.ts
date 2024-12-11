export interface EvaluationContext {
    /** Context Log to Humanloop.
     * Per datapoint state that is set when an Evaluation is run.
     */

    /** Required for associating a Log with the Evaluation Run. */
    source_datapoint_id: string;

    /** Overloaded .log method call. */
    upload_callback: (log: string) => void;

    /** ID of the evaluated File. */
    file_id: string;

    /** Path of the evaluated File. */
    path: string;

    /** Required for associating a Log with the Evaluation Run. */
    run_id: string;
}

export const EVALUATION_CONTEXT_VARIABLE_NAME = "__EVALUATION_CONTEXT";
