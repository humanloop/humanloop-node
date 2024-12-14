import { NodeTracerProvider, Tracer } from "@opentelemetry/sdk-trace-node";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

import { HumanloopClient as BaseHumanloopClient } from "./Client";
import { Evaluations as BaseEvaluations } from "./api/resources/evaluations/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { FlowKernelRequest } from "./api/types/FlowKernelRequest";
import { ToolKernelRequest } from "./api/types/ToolKernelRequest";
import { overloadLog, runEval } from "./eval_utils/run";
import { Dataset, Evaluator, EvaluatorCheck, File } from "./eval_utils/types";
import { HumanloopSpanExporter } from "./otel/exporter";
import { HumanloopSpanProcessor } from "./otel/processor";
import { flowUtilityFactory } from "./utilities/flow";
import { UtilityPromptKernel, promptUtilityFactory } from "./utilities/prompt";
import { toolUtilityFactory } from "./utilities/tool";

class ExtendedEvaluations extends BaseEvaluations {
    protected readonly _client: HumanloopClient;

    constructor(options: BaseHumanloopClient.Options, client: HumanloopClient) {
        super(options);
        this._client = client;
    }

    async run(
        file: File,
        dataset: Dataset,
        name?: string,
        evaluators: Evaluator[] = [],
        workers: number = 8,
    ): Promise<EvaluatorCheck[]> {
        return runEval(this._client, file, dataset, name, evaluators, workers);
    }
}

export class HumanloopClient extends BaseHumanloopClient {
    protected readonly _evaluations: ExtendedEvaluations;
    protected readonly _prompts_overloaded: Prompts;
    protected readonly _flows_overloaded: Flows;

    protected readonly OpenAI?: any;
    protected readonly Anthropic?: any;
    protected readonly CohereAI?: any;

    protected readonly opentelemetryTracerProvider: NodeTracerProvider;
    protected readonly opentelemetryTracer: Tracer;

    constructor(
        _options: BaseHumanloopClient.Options,
        OpenAI?: any,
        Anthropic?: any,
        CohereAI?: any,
    ) {
        super(_options);

        this.OpenAI = OpenAI;
        this.Anthropic = Anthropic;
        this.CohereAI = CohereAI;

        this._prompts_overloaded = overloadLog(super.prompts);

        this._flows_overloaded = overloadLog(super.flows);

        this._evaluations = new ExtendedEvaluations(_options, this);

        this.opentelemetryTracerProvider = new NodeTracerProvider({
            spanProcessors: [
                new HumanloopSpanProcessor(new HumanloopSpanExporter(this)),
            ],
        });

        if (OpenAI) {
            const instrumentor = new OpenAIInstrumentation({
                enrichTokens: true,
            });
            instrumentor.manuallyInstrument(OpenAI);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        if (Anthropic) {
            const instrumentor = new AnthropicInstrumentation();
            instrumentor.manuallyInstrument(Anthropic);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        if (CohereAI) {
            const instrumentor = new CohereInstrumentation();
            instrumentor.manuallyInstrument(CohereAI);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        this.opentelemetryTracerProvider.register();

        this.opentelemetryTracer =
            this.opentelemetryTracerProvider.getTracer("humanloop.sdk");
    }

    private _checkProviders() {
        const noProviderInstrumented = [
            this.OpenAI,
            this.Anthropic,
            this.CohereAI,
        ].every((p) => !p);
        if (noProviderInstrumented) {
            throw new Error(
                "Using File utilities without passing any provider in the " +
                    "HumanloopClient constructor. Did you forget to pass them?",
            );
        }
    }

    public prompt<T extends (...args: any[]) => any>(promptUtilityArguments: {
        callable: T;
        promptKernel?: UtilityPromptKernel;
        path?: string;
    }) {
        this._checkProviders();
        return promptUtilityFactory(
            this.opentelemetryTracer,
            promptUtilityArguments.callable,
            promptUtilityArguments.promptKernel,
            promptUtilityArguments.path,
        );
    }

    public tool<T extends (...args: any[]) => any>(toolUtilityArguments: {
        callable: T;
        toolKernel: ToolKernelRequest;
        path?: string;
    }) {
        this._checkProviders();
        return toolUtilityFactory(
            this.opentelemetryTracer,
            toolUtilityArguments.callable,
            toolUtilityArguments.toolKernel,
            toolUtilityArguments.path,
        );
    }

    public flow<T extends (...args: any[]) => any>(flowUtilityArguments: {
        callable: T;
        flowKernel?: FlowKernelRequest;
        path?: string;
    }) {
        this._checkProviders();
        return flowUtilityFactory(
            this.opentelemetryTracer,
            flowUtilityArguments.callable,
            flowUtilityArguments.flowKernel,
            flowUtilityArguments.path,
        );
    }

    public get evaluations(): ExtendedEvaluations {
        return this._evaluations;
    }

    // @ts-ignore
    public get prompts(): Prompts {
        return this._prompts_overloaded;
    }

    // @ts-ignore
    public get flows(): Flows {
        return this._flows_overloaded;
    }
}
