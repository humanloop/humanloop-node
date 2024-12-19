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
import { InputsMessagesCallableType, ToolCallableType } from "./utilities/types";

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

    /**
     * Constructs a new instance of the Humanloop client.
     *
     * @param _options - The base options for the Humanloop client.
     * @param providerModules - Provider clients to instrument by File utilities.
     */
    constructor(
        _options: BaseHumanloopClient.Options,
        providerModules?: {
            OpenAI?: any;
            Anthropic?: any;
            CohereAI?: any;
        },
    ) {
        super(_options);

        this.OpenAI = providerModules?.OpenAI;
        this.Anthropic = providerModules?.Anthropic;
        this.CohereAI = providerModules?.CohereAI;

        this._prompts_overloaded = overloadLog(super.prompts);

        this._flows_overloaded = overloadLog(super.flows);

        this._evaluations = new ExtendedEvaluations(_options, this);

        this.opentelemetryTracerProvider = new NodeTracerProvider({
            spanProcessors: [
                new HumanloopSpanProcessor(new HumanloopSpanExporter(this)),
            ],
        });

        if (providerModules?.OpenAI) {
            const instrumentor = new OpenAIInstrumentation({
                enrichTokens: true,
            });
            instrumentor.manuallyInstrument(providerModules?.OpenAI);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        if (providerModules?.Anthropic) {
            const instrumentor = new AnthropicInstrumentation();
            instrumentor.manuallyInstrument(providerModules?.Anthropic);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        if (providerModules?.CohereAI) {
            const instrumentor = new CohereInstrumentation();
            instrumentor.manuallyInstrument(providerModules?.CohereAI);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        this.opentelemetryTracerProvider.register();

        this.opentelemetryTracer =
            this.opentelemetryTracerProvider.getTracer("humanloop.sdk");
    }

    // Check if user has passed the LLM provider instrumentors
    private _assertProviders(func: Function) {
        const noProviderInstrumented = [
            this.OpenAI,
            this.Anthropic,
            this.CohereAI,
        ].every((p) => !p);
        if (noProviderInstrumented) {
            throw new Error(
                `${func.name}: You must pass at least one LLM client library in the Humanloop client constructor. Otherwise the prompt() utility will not work properly.`,
            );
        }
    }

    /**
     * Utility for managing a Prompt
     *
     * @template I - The input type for the callable.
     * @template M - The message type for the callable.
     * @template O - The output type for the callable.
     * @param {Object} params - The parameters for the prompt.
     * @param {InputsMessagesCallableType<I, M, O>} params.callable - The callable to be used for the prompt.
     * @param {string} params.path - The path to be used for the prompt.
     * @param {UtilityPromptKernel} [params.promptKernel] - Optional prompt kernel to be used.
     * @returns {ReturnType<typeof promptUtilityFactory>} The result of the prompt utility factory.
     */
    public prompt<I, M, O>({
        callable,
        promptKernel,
        path,
    }: {
        callable: InputsMessagesCallableType<I, M, O>;
        path: string;
        promptKernel?: UtilityPromptKernel;
    }) {
        this._assertProviders(callable);
        return promptUtilityFactory(
            this.opentelemetryTracer,
            callable,
            path,
            promptKernel,
        );
    }

    public tool<I, O>({
        callable,
        path,
        toolKernel,
    }: {
        callable: ToolCallableType<I, O>;
        path: string;
        toolKernel: ToolKernelRequest;
    }) {
        return toolUtilityFactory(this.opentelemetryTracer, callable, toolKernel, path);
    }

    public flow<I, M, O>({
        callable,
        flowKernel,
        path,
    }: {
        callable: InputsMessagesCallableType<I, M, O>;
        path: string;
        flowKernel?: FlowKernelRequest;
    }) {
        return flowUtilityFactory(this.opentelemetryTracer, callable, path, flowKernel);
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
