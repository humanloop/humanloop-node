import { Tracer } from "@opentelemetry/api";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

import { HumanloopClient as BaseHumanloopClient } from "./Client";
import { ChatMessage } from "./api";
import { Evaluations as BaseEvaluations } from "./api/resources/evaluations/client/Client";
import { Evaluators } from "./api/resources/evaluators/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Tools } from "./api/resources/tools/client/Client";
import { ToolKernelRequest } from "./api/types/ToolKernelRequest";
import { flowUtilityFactory } from "./decorators/flow";
import { promptDecoratorFactory } from "./decorators/prompt";
import { toolUtilityFactory } from "./decorators/tool";
import { HumanloopEnvironment } from "./environments";
import { HumanloopRuntimeError } from "./error";
import { runEval } from "./evals/run";
import {
    Dataset,
    EvaluatorCheck,
    File,
    LocalEvaluator,
    OnlineEvaluator,
} from "./evals/types";
import { HumanloopSpanExporter } from "./otel/exporter";
import { HumanloopSpanProcessor } from "./otel/processor";
import { overloadCall, overloadLog } from "./overload";
import { SyncClient } from "./sync";
import { SDK_VERSION } from "./version";

const RED = "\x1b[91m";
const RESET = "\x1b[0m";

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
    async run<I extends Record<string, unknown> & { messages?: any[] }, O>({
        file,
        dataset,
        name,
        evaluators = [],
        concurrency = 8,
    }: {
        file: File<I, O>;
        dataset: Dataset;
        name?: string;
        evaluators: (
            | OnlineEvaluator
            | {
                  [R in "text" | "boolean" | "number"]: {
                      [A in "target_required" | "target_free"]: LocalEvaluator<R, A>;
                  }["target_required" | "target_free"];
              }["text" | "boolean" | "number"]
        )[];
        concurrency?: number;
    }): Promise<EvaluatorCheck[]> {
        return runEval(this._client, file, dataset, name, evaluators, concurrency);
    }
}

class HumanloopTracerSingleton {
    private static instance: HumanloopTracerSingleton;
    private readonly tracerProvider: NodeTracerProvider;
    public readonly tracer: Tracer;

    private constructor(config: {
        hlClientApiKey: string;
        hlClientBaseUrl: string;
        instrumentProviders?: {
            OpenAI?: any;
            Anthropic?: any;
            CohereAI?: any;
        };
    }) {
        this.tracerProvider = new NodeTracerProvider({
            resource: resourceFromAttributes({
                "service.name": "humanloop-typescript-sdk",
                "service.version": SDK_VERSION,
            }),
            spanProcessors: [
                new HumanloopSpanProcessor(
                    new HumanloopSpanExporter({
                        hlClientHeaders: {
                            "X-API-KEY": config.hlClientApiKey,
                            "X-Fern-Language": "Typescript",
                            "X-Fern-SDK-Name": "humanloop",
                            "X-Fern-SDK-Version": SDK_VERSION,
                        },
                        hlClientBaseUrl: config.hlClientBaseUrl,
                    }),
                ),
            ],
        });
        if (config.instrumentProviders?.OpenAI) {
            const openaiInstrumentation = new OpenAIInstrumentation({
                enrichTokens: true,
            });
            openaiInstrumentation.manuallyInstrument(config.instrumentProviders.OpenAI);
            openaiInstrumentation.setTracerProvider(this.tracerProvider);
            openaiInstrumentation.enable();
        }
        if (config.instrumentProviders?.Anthropic) {
            const anthropicInstrumentation = new AnthropicInstrumentation();
            anthropicInstrumentation.manuallyInstrument(
                config.instrumentProviders.Anthropic,
            );
            anthropicInstrumentation.setTracerProvider(this.tracerProvider);
            anthropicInstrumentation.enable();
        }
        if (config.instrumentProviders?.CohereAI) {
            const cohereInstrumentation = new CohereInstrumentation();
            cohereInstrumentation.manuallyInstrument(
                config.instrumentProviders.CohereAI,
            );
            cohereInstrumentation.setTracerProvider(this.tracerProvider);
            cohereInstrumentation.enable();
        }

        this.tracer = this.tracerProvider.getTracer("humanloop.sdk");
    }

    public static getInstance(config: {
        hlClientApiKey: string;
        hlClientBaseUrl: string;
        instrumentProviders?: {
            OpenAI?: any;
            Anthropic?: any;
            CohereAI?: any;
        };
    }): HumanloopTracerSingleton {
        if (!HumanloopTracerSingleton.instance) {
            HumanloopTracerSingleton.instance = new HumanloopTracerSingleton(config);
        }
        return HumanloopTracerSingleton.instance;
    }
}

export interface HumanloopClientOptions extends BaseHumanloopClient.Options {
    /**
     * Whether to use local files for prompts and agents
     */
    useLocalFiles?: boolean;

    /**
     * Base directory where local prompt and agent files are stored (default: "humanloop").
     * This is relative to the current working directory. For example:
     * - "humanloop" will look for files in "./humanloop/"
     * - "data/humanloop" will look for files in "./data/humanloop/"
     * When using paths in the API, they must be relative to this directory. For example,
     * if localFilesDirectory="humanloop" and you have a file at "humanloop/samples/test.prompt",
     * you would reference it as "samples/test" in your code.
     */
    localFilesDirectory?: string;

    /**
     * Maximum number of files to cache when useLocalFiles is true (default: DEFAULT_CACHE_SIZE).
     * This parameter has no effect if useLocalFiles is false.
     */
    cacheSize?: number;

    /**
     * LLM provider modules to instrument. Allows the prompt decorator to spy on provider calls and log them to Humanloop
     */
    instrumentProviders?: {
        OpenAI?: any;
        Anthropic?: any;
        CohereAI?: any;
    };
}

export class HumanloopClient extends BaseHumanloopClient {
    protected readonly _evaluations: ExtendedEvaluations;
    protected readonly _prompts_overloaded: Prompts;
    protected readonly _flows_overloaded: Flows;
    protected readonly _tools_overloaded: Tools;
    protected readonly _evaluators_overloaded: Evaluators;
    protected readonly instrumentProviders: {
        OpenAI?: any;
        Anthropic?: any;
        CohereAI?: any;
    };
    protected readonly _syncClient: SyncClient;
    protected readonly useLocalFiles: boolean;

    protected get opentelemetryTracer(): Tracer {
        return HumanloopTracerSingleton.getInstance({
            hlClientApiKey: this.options().apiKey!.toString(),
            hlClientBaseUrl:
                this.options().baseUrl?.toString() ||
                HumanloopEnvironment.Default.toString(),
            instrumentProviders: this.instrumentProviders,
        }).tracer;
    }

    /**
     * Constructs a new instance of the Humanloop client.
     *
     * @param _options - The base options for the Humanloop client.
     * @param _options.instrumentProviders - LLM provider modules to instrument. Allows the prompt decorator to spy on provider calls and log them to Humanloop
     *
     * Pass LLM provider modules as such:
     *
     * ```typescript
     * import { OpenAI } from "openai";
     * import { Anthropic } from "anthropic";
     * import { HumanloopClient } from "humanloop";
     *
     * const humanloop = new HumanloopClient({
     *     apiKey: process.env.HUMANLOOP_KEY,
     *     instrumentProviders: { OpenAI, Anthropic },
     * });
     *
     * const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});
     * const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_KEY});
     * ```
     */
    constructor(options: HumanloopClientOptions = {}) {
        super(options);

        this.useLocalFiles = options.useLocalFiles || false;

        // Warn user if cacheSize is non-default but useLocalFiles is false
        if (!this.useLocalFiles && options.cacheSize !== undefined) {
            console.warn(
                `The specified cacheSize=${options.cacheSize} will have no effect because useLocalFiles=false. ` +
                    `File caching is only active when local files are enabled.`,
            );
        }

        this._syncClient = new SyncClient(this, {
            baseDir: options.localFilesDirectory || "humanloop",
            cacheSize: options.cacheSize,
        });

        this.instrumentProviders = options.instrumentProviders || {};

        this._prompts_overloaded = overloadLog(super.prompts);
        this._prompts_overloaded = overloadCall(this._prompts_overloaded);

        this._tools_overloaded = overloadLog(super.tools);

        this._flows_overloaded = overloadLog(super.flows);

        this._evaluators_overloaded = overloadLog(super.evaluators);

        this._evaluations = new ExtendedEvaluations(options, this);

        // Initialize the tracer singleton
        HumanloopTracerSingleton.getInstance({
            hlClientApiKey: this.options().apiKey!.toString(),
            hlClientBaseUrl:
                this.options().baseUrl?.toString() ||
                HumanloopEnvironment.Default.toString(),
            instrumentProviders: this.instrumentProviders,
        });
    }

    public options(): BaseHumanloopClient.Options {
        return this._options;
    }

    // Check if user has passed the LLM provider instrumentors
    private assertAtLeastOneProviderModuleSet() {
        const userDidNotPassProviders = Object.values(this.instrumentProviders).every(
            (provider) => !provider,
        );
        if (userDidNotPassProviders) {
            throw new HumanloopRuntimeError(
                `${RED}To use the @prompt decorator, pass your LLM client library into the Humanloop client constructor. For example:\n\n
import { OpenAI } from "openai";
import { HumanloopClient } from "humanloop";

const humanloop = new HumanloopClient({apiKey: process.env.HUMANLOOP_KEY}, { OpenAI });
const openai = new OpenAI();
${RESET}`,
            );
        }
    }

    /**
     * Auto-instrument LLM provider calls and create [Prompt](https://humanloop.com/docs/explanation/prompts)
     * Logs on Humanloop from them.
     *
     * ```typescript
     * import { OpenAI } from "openai";
     * import { Anthropic } from "anthropic";
     * import { HumanloopClient } from "humanloop";
     *
     * const humanloop = new HumanloopClient({
     *     apiKey: process.env.HUMANLOOP_KEY,
     *     instrumentProviders: { OpenAI, Anthropic },
     * });
     * const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});
     *
     * const callOpenaiWithHumanloop = humanloop.prompt({
     *    path: "Chat Bot",
     *    callable: (args: {
     *      messages: ChatMessage[]
     *    }) => {
     *      const response = await openai.chat.completions.create({
     *        model: "gpt-4o",
     *        temperature: 0.8,
     *        frequency_penalty: 0.5,
     *        max_tokens: 200,
     *        messages: args.messages,
     *      });
     *      return response.choices[0].message.content;
     *    },
     * });
     *
     * const answer = await callOpenaiWithHumanloop({
     *   messages: [{ role: "user", content: "What is the capital of the moon?" }],
     * });
     *
     * // Calling the function above creates a new Log on Humanloop
     * // against this Prompt version:
     * {
     *     provider: "openai",
     *     model: "gpt-4o",
     *     endpoint: "chat",
     *     max_tokens: 200,
     *     temperature: 0.8,
     *     frequency_penalty: 0.5,
     * }
     * ```
     *
     * If a different model, endpoint, or hyperparameter is used, a new
     * Prompt version is created. For example:
     *
     * ```typescript
     * humanloopClient.prompt({
     *   path: "My Prompt",
     *   callable: async (messages: ChatMessage[]) => {
     *     const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
     *     const openaiResponse = await openaiClient.chat.completions.create({
     *       model: "gpt-4o-mini",
     *       temperature: 0.5,
     *     });
     *     const openaiContent = openaiResponse.choices[0].message.content;
    
     *     const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
     *     const anthropicResponse = await anthropicClient.messages.create({
     *       model: "claude-3-5-sonnet-20240620",
     *       temperature: 0.5,
     *     });
     *     const anthropicContent = anthropicResponse.content;
    
     *     return { openaiContent, anthropicContent };
     *   }
     * });
     *
     * Calling this function will create two versions of the same Prompt:
     * {
     *     provider: "openai",
     *     model: "gpt-4o-mini",
     *     endpoint: "chat",
     *     max_tokens: 200,
     *     temperature: 0.5,
     *     frequency_penalty: 0.5,
     * }
     *
     * {
     *     provider: "anthropic",
     *     model: "claude-3-5-sonnet-20240620",
     *     endpoint: "messages",
     *     temperature: 0.5,
     * }
     *
     * And one Log will be added to each version of the Prompt.
     * ```
     *
     * @param callable - The callable to wrap.
     * @param path - The path to the Prompt.
     */
    public prompt<I, O>(args: {
        callable: I extends never ? () => O : (args: I) => O;
        path: string;
    }): I extends never
        ? () => O extends Promise<infer R>
              ? Promise<R | undefined>
              : Promise<O | undefined>
        : (
              args: I,
          ) => O extends Promise<infer R>
              ? Promise<R | undefined>
              : Promise<O | undefined> {
        this.assertAtLeastOneProviderModuleSet();
        // @ts-ignore
        return promptDecoratorFactory(args.path, args.callable);
    }

    /**
     * Auto-instrument LLM provider calls and create [Tool](https://humanloop.com/docs/explanation/tools)
     * Logs on Humanloop from them.
     *
     * You must provide a `version` argument specifying the JSON Schema of the Tool's inputs and outputs,
     * along with a callable that accepts the inputs and returns the outputs.
     *
     * ```typescript
     *
     * const calculator = humanloop_client.tool({
     *     callable: (inputs: { a: number; b: number }) => inputs.a + inputs.b,
     *     path: "Andrei QA/SDK TS/Calculator",
     *     version: {
     *         function: {
     *             name: "calculator",
     *             description: "Add two numbers",
     *             parameters: {
     *                 type: "object",
     *                 properties: {
     *                     a: { type: "number", required: true },
     *                     b: { type: "number", required: true },
     *                 },
     *             },
     *         },
     *     },
     * });
     * ```
     *
     * @param callable - The callable to wrap.
     * @param path - The path to the Tool.
     * @param version - The JSON Schema of the Tool's inputs and outputs, plus the optional Humanloop fields `attributes and `setupValues`. See API reference for details.
     */
    public tool<I, O>(args: {
        callable: I extends never
            ? () => O
            : I extends Record<string, any>
              ? (args: I) => O
              : never;
        path: string;
        version: ToolKernelRequest;
    }): I extends never
        ? () => O extends Promise<infer R>
              ? Promise<R | undefined>
              : Promise<O | undefined>
        : (
              args: I,
          ) => O extends Promise<infer R>
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

    /**
     * Trace SDK logging calls through [Flows](https://humanloop.com/docs/explanation/flows).
     *
     * Use it as the entrypoint of your LLM feature. Logging calls like `prompts.call(...)`,
     * `tools.call(...)`, or other Humanloop decorators will be automatically added to the trace.
     *
     * Example:
     *
     * ```typescript
     * const callLLM = humanloop_client.prompt({
     *     path: "My Prompt",
     *     callable: (messages: ChatMessage[]) => {
     *         const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
     *         return client.chat.completions.create({
     *             model: "gpt-4o",
     *             temperature: 0.8,
     *             frequency_penalty: 0.5,
     *         max_tokens: 200,
     *         messages: messages,
     *     }).choices[0].message.content;
     * }
     *
     * const agent = humanloop_client.flow({
     *     callable: () => {
     *         while (true) {
     *             const messages: ChatMessage[] = [];
     *             const userInput = prompt("You: ");
     *             if (userInput === "exit") {
     *                 break;
     *             }
     *             messages.push({ role: "user", content: userInput });
     *             const response = callLLM(messages);
     *             messages.push({ role: "assistant", content: response });
     *             console.log(`Assistant: ${response}`);
     *         }
     *     },
     *     path: "My Flow",
     *     attributes: { version: "v1" },
     * });
     *
     * ```
     *
     * Each call to `agent` will create a trace corresponding to the conversation
     * session. Multiple Prompt Logs will be created as the LLM is called. They
     * will be added to the trace, allowing you to see the whole conversation
     * in the UI.
     *
     * If the function returns a ChatMessage-like object, the Log will
     * populate the `outputMessage` field. Otherwise, it will serialize
     * the return value and populate the `output` field.
     *
     * If an exception is raised, the output fields will be set to None
     * and the error message will be set in the Log's `error` field.
     *
     * @param path - The path to the Flow. If not provided, the function name
     *     will be used as the path and the File will be created in the root
     *     of your organization workspace.
     *
     * @param attributes - Additional fields to describe the Flow. Helpful to separate Flow versions from each other with details on how they were created or used.
     */
    public flow<I, O>({
        callable,
        path,
        attributes,
    }: {
        callable: I extends never
            ? () => O
            : I extends Record<string, any> & { messages?: ChatMessage[] }
              ? (args: I) => O
              : never;
        path: string;
        attributes?: Record<string, unknown>;
    }): I extends never
        ? () => O extends Promise<infer R>
              ? Promise<R | undefined>
              : Promise<O | undefined>
        : (
              args: I,
          ) => O extends Promise<infer R>
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

    /**
     * Pull Prompt and Agent files from Humanloop to local filesystem.
     *
     * This method will:
     * 1. Fetch Prompt and Agent files from your Humanloop workspace
     * 2. Save them to your local filesystem (directory specified by `localFilesDirectory`, default: "humanloop")
     * 3. Maintain the same directory structure as in Humanloop
     * 4. Add appropriate file extensions (`.prompt` or `.agent`)
     *
     * The path parameter can be used in two ways:
     * - If it points to a specific file (e.g. "path/to/file.prompt" or "path/to/file.agent"), only that file will be pulled
     * - If it points to a directory (e.g. "path/to/directory"), all Prompt and Agent files in that directory and its subdirectories will be pulled
     * - If no path is provided, all Prompt and Agent files will be pulled
     *
     * The operation will overwrite existing files with the latest version from Humanloop
     * but will not delete local files that don't exist in the remote workspace.
     *
     * Currently only supports syncing Prompt and Agent files. Other file types will be skipped.
     *
     * For example, with the default `localFilesDirectory="humanloop"`, files will be saved as:
     * ```
     * ./humanloop/
     * ├── my_project/
     * │   ├── prompts/
     * │   │   ├── my_prompt.prompt
     * │   │   └── nested/
     * │   │       └── another_prompt.prompt
     * │   └── agents/
     * │       └── my_agent.agent
     * └── another_project/
     *     └── prompts/
     *         └── other_prompt.prompt
     * ```
     *
     * If you specify `localFilesDirectory="data/humanloop"`, files will be saved in ./data/humanloop/ instead.
     *
     * @param path - Optional path to either a specific file (e.g. "path/to/file.prompt") or a directory (e.g. "path/to/directory").
     *              If not provided, all Prompt and Agent files will be pulled.
     * @param environment - The environment to pull the files from.
     * @returns An array containing two string arrays:
     *          - First array contains paths of successfully synced files
     *          - Second array contains paths of files that failed to sync (due to API errors, missing content,
     *            or filesystem issues)
     * @throws HumanloopRuntimeError If there's an error communicating with the API
     */
    public async pull(
        path?: string,
        environment?: string,
    ): Promise<[string[], string[]]> {
        return this._syncClient.pull(path, environment);
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

    public get evaluators(): Evaluators {
        return this._evaluators_overloaded;
    }
}
