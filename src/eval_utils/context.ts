import { FlowLogRequest, PromptLogRequest } from "../api";
import { DatapointResponse } from "../api";
import { Humanloop } from "../index";

type EvaluationContextState = {
    fileId?: string;
    path?: string;
    uploadCallback: (logId: string, datapoint: DatapointResponse) => void;
};

type EvaluationContextKey = {
    inputs: Record<string, unknown> | undefined;
    messages: Humanloop.ChatMessage[] | undefined;
};

type EvaluationContextValue = {
    runId: string;
    sourceDatapointId: string;
    uploadCallback: (logId: string) => void;
};

class EvaluationContext {
    private state?: EvaluationContextState;
    private static instance: EvaluationContext;
    private inputMappings: Map<EvaluationContextKey, EvaluationContextValue[]> =
        new Map();

    private constructor() {}

    public static getInstance(): EvaluationContext {
        if (!EvaluationContext.instance) {
            EvaluationContext.instance = new EvaluationContext();
        }
        return EvaluationContext.instance;
    }

    public setState(state: EvaluationContextState): void {
        this.state = state;
    }

    public getState(): Omit<EvaluationContextState, "uploadCallback"> | undefined {
        return this.state === undefined
            ? this.state
            : {
                  fileId: this.state.fileId,
                  path: this.state.path,
              };
    }

    public addDatapoint(datapoint: DatapointResponse, runId: string): void {
        if (this.state === undefined) {
            throw new Error("EvaluationContext state is not set");
        }
        const key = { inputs: datapoint.inputs, messages: datapoint.messages };

        if (!this.inputMappings.has(key)) {
            this.inputMappings.set(key, []);
        }
        this.inputMappings.get(key)!.push({
            runId,
            sourceDatapointId: datapoint.id,
            uploadCallback: (logId: string) =>
                this.state!.uploadCallback(logId, datapoint),
        });
    }

    public getDatapoint(key: EvaluationContextKey): EvaluationContextValue {
        const mappings = this.inputMappings.get(key);
        if (!mappings || mappings.length === 0) {
            throw new Error(`No input mappings found for: ${JSON.stringify(key)}`);
        }
        return mappings.pop()!;
    }

    public peekDatapoint(key: EvaluationContextKey): boolean {
        const mappings = this.inputMappings.get(key);
        return mappings !== undefined && mappings.length > 0;
    }

    public isEvaluatedFile(args: FlowLogRequest | PromptLogRequest) {
        return (
            this.state && this.state.fileId === args.id && this.state.path === args.path
        );
    }
}

export const evaluationContext = EvaluationContext.getInstance();
