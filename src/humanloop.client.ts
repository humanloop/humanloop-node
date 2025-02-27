import { NodeTracerProvider, Tracer } from "@opentelemetry/sdk-trace-node";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";
import { ChatMessage } from "api";
import { Tools } from "api/resources/tools/client/Client";
import { runEval } from "eval_utils/run";
import { overloadCall, overloadLog } from "overload";

import { HumanloopClient as BaseHumanloopClient } from "./Client";
import { Evaluations as BaseEvaluations } from "./api/resources/evaluations/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { FlowKernelRequest } from "./api/types/FlowKernelRequest";
import { ToolKernelRequest } from "./api/types/ToolKernelRequest";
import { Dataset, Evaluator, EvaluatorCheck, File } from "./eval_utils/types";
import { HumanloopSpanExporter } from "./otel/exporter";
import { HumanloopSpanProcessor } from "./otel/processor";
import { flowUtilityFactory } from "./utilities/flow";
import { promptDecoratorFactory } from "./utilities/prompt";
import { toolUtilityFactory } from "./utilities/tool";

class ExtendedEvaluations extends BaseEvaluations {
    protected readonly _client: HumanloopClient;

    constructor(options: BaseHumanloopClient.Options, client: HumanloopClient) {
        super(options);
        this._client = client;
    }

    /**
     * Evaluate a File's performance.
     *
     * The utility takes a callable function that will be run over the dataset. The function's inputs and outputs are transformed into a Log of the evaluated File. The Log is the passed to the Evaluators to produce metrics.
     *
     * Running the file again with the same Dataset and Evaluators will create a new Run in the Evaluation. The new Run will be compared to the previous Runs, allowing you to iterate on your File.
     *
     * ```typescript
     * async function trueOrFalse(query: string): Promise<boolean> {
     *   const response = await openAIClient.chat.completions.create({
     *     model: "gpt-4o-mini",
     *     temperature: 0,
     *     messages: [
     *       { role: "system", content: "You are a helpful assistant. You must evaluate queries and decide if their sentiment is closer to boolean true or boolean false. Output only 'true' or 'false' and nothing else" },
     *       { role: "user", content: query }
     *     ]
     *   });
     *   return response.choices[0].message.content === 'true';
     * }
     *
     * humanloop.evaluations.run({
     *   type: "flow",
     *   callable: trueOrFalse,
     *   path: "Project/True or False"
     * },
     * {
     *   path: "Project/Fuzzy Logic 101",
     *   datapoints: [
     *     { inputs: { query: "This is 100%" }, target: { output: true } },
     *     { inputs: { query: "I don't think so" }, target: { output: false } },
     *     { inputs: { query: "That doesn't go around here" }, target: { output: false } },
     *     { inputs: { query: "Great work bot!" }, target: { output: true } },
     *     { inputs: { query: "I agree" }, target: { output: true } }
     *   ]
     * },
     * "Accuracy Evaluation",
     * evaluators: [
     *   {
     *     callable: (log, datapoint) => log.output === datapoint.target.output,
     *     path: "Project/Accuracy Evaluator"
     *   }
     * ]
     * );
     * ```
     *
     * @param file - The file to evaluate.
     * @param file.type - The type of file being evaluated e.g. "flow".
     * @param file.version - The version of the file being evaluated.
     * @param file.callable - The callable to run over the dataset. Can also be a File-utility wrapped callable.
     * @param dataset - The dataset used in evaluation. Can be an online dataset or local data can be provided as an array of datapoints.
     * @param dataset.path - The path of the dataset to use in evaluation. If the Dataset is stored on Humanloop, you only need to provide the path.
     * @param dataset.datapoints - The datapoints to map your function over to produce the outputs required by the evaluation. The datapoints will be uploaded to Humanloop and create a new version of the Dataset.
     * @param name - The name of the evaluation.
     * @param evaluators - List of evaluators to be. Can be ran on Humanloop if specified only by path, or locally if a callable is provided.
     * @param concurrency - Number of datapoints to process in parallel.
     */
    async run({
        file,
        dataset,
        name,
        evaluators = [],
        concurrency = 8,
    }: {
        file: File;
        dataset: Dataset;
        name?: string;
        evaluators: Evaluator[];
        concurrency?: number;
    }): Promise<EvaluatorCheck[]> {
        return runEval(this._client, file, dataset, name, evaluators, concurrency);
    }
}

export class HumanloopClient extends BaseHumanloopClient {
    protected readonly _evaluations: ExtendedEvaluations;
    protected readonly _prompts_overloaded: Prompts;
    protected readonly _flows_overloaded: Flows;
    protected readonly _tools_overloaded: Tools;

    protected readonly OpenAI?: any;
    protected readonly Anthropic?: any;
    protected readonly CohereAI?: any;

    protected readonly opentelemetryTracerProvider: NodeTracerProvider;
    protected readonly opentelemetryTracer: Tracer;

    /**
     * Constructs a new instance of the Humanloop client.
     *
     * @param _options - The base options for the Humanloop client.
     * @param providerModules - LLM provider modules to instrument. Pass all LLM providers that you will use in your program if you intend to use File utilities such as `prompt()`.
     */
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
        this._prompts_overloaded = overloadCall(this._prompts_overloaded);

        this._tools_overloaded = overloadLog(super.tools);

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

    // Check if user has passed the LLM provider instrumentors
    private assertProviders(func: Function) {
        const noProviderInstrumented = [
            this.OpenAI,
            this.Anthropic,
            this.CohereAI,
        ].every((p) => !p);
        if (noProviderInstrumented) {
            throw new Error(
                `${func.name}: To use the 'prompt()' decorator, pass your LLM client library into the Humanloop client constructor`,
            );
        }
    }

    public prompt<I, O>(args: {
        callable: O extends undefined
            ? never
            : I extends Record<string, unknown>
              ? (args: I) => O
              : () => O;
        path: string;
        template?: string;
    }): O extends undefined
        ? never
        : I extends Record<string, unknown>
          ? (
                args: I,
            ) => O extends Promise<infer R>
                ? Promise<R | undefined>
                : Promise<O | undefined>
          : () => O extends Promise<infer R>
                ? Promise<R | undefined>
                : Promise<O | undefined> {
        this.assertProviders(args.callable);
        // @ts-ignore
        return promptDecoratorFactory(args.path, args.callable, args.template);
    }

    public tool<I, O>(args: {
        callable: O extends undefined
            ? never
            : I extends Record<string, unknown>
              ? (args: I) => O
              : () => O;
        path: string;
        version: ToolKernelRequest;
    }): O extends undefined
        ? never
        : I extends Record<string, unknown>
          ? (
                args: I,
            ) => O extends Promise<infer R>
                ? Promise<R | undefined>
                : Promise<O | undefined>
          : () => O extends Promise<infer R>
                ? Promise<R | undefined>
                : Promise<O | undefined> {
        // @ts-ignore
        return toolUtilityFactory(
            this.opentelemetryTracer,
            args.callable,
            args.version,
            args.path,
        );
    }

    public flow<I, O>({
        callable,
        path,
        attributes,
    }: {
        callable: O extends undefined
            ? never
            : I extends Record<string, unknown> & { messages?: ChatMessage[] }
              ? never
              : ((args: I) => O) | (() => O);
        path: string;
        attributes?: Record<string, unknown>;
    }): O extends undefined
        ? never
        : I extends Record<string, unknown> & { messages?: ChatMessage[] }
          ? (
                args: I,
            ) => O extends Promise<infer R>
                ? Promise<R | undefined>
                : Promise<O | undefined>
          : () => O extends Promise<infer R>
                ? Promise<R | undefined>
                : Promise<O | undefined> {
        // @ts-ignore
        return flowUtilityFactory(
            this,
            this.opentelemetryTracer,
            callable,
            path,
            attributes,
        );
    }

    public get evaluations(): ExtendedEvaluations {
        return this._evaluations;
    }

    public get prompts(): Prompts {
        return this._prompts_overloaded;
    }

    public get flows(): Flows {
        return this._flows_overloaded;
    }

    public get tools(): Tools {
        return this._tools_overloaded;
    }
}
