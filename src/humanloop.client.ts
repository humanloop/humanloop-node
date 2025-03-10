import { NodeTracerProvider, Tracer } from "@opentelemetry/sdk-trace-node";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";
import { Evaluators } from "api/resources/evaluators/client/Client";

import { HumanloopClient as BaseHumanloopClient } from "./Client";
import { ChatMessage } from "./api";
import { Evaluations as BaseEvaluations } from "./api/resources/evaluations/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Tools } from "./api/resources/tools/client/Client";
import { ToolKernelRequest } from "./api/types/ToolKernelRequest";
import { flowUtilityFactory } from "./decorators/flow";
import { promptDecoratorFactory } from "./decorators/prompt";
import { toolUtilityFactory } from "./decorators/tool";
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
    async run<I, O>({
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
        return runEval<I, O>(
            this._client,
            file,
            dataset,
            name,
            evaluators,
            concurrency,
        );
    }
}

export class HumanloopClient extends BaseHumanloopClient {
    protected readonly _evaluations: ExtendedEvaluations;
    protected readonly _prompts_overloaded: Prompts;
    protected readonly _flows_overloaded: Flows;
    protected readonly _tools_overloaded: Tools;
    protected readonly _evaluators_overloaded: Evaluators;

    protected readonly OpenAI?: any;
    protected readonly Anthropic?: any;
    protected readonly CohereAI?: any;

    protected readonly opentelemetryTracerProvider: NodeTracerProvider;
    protected readonly opentelemetryTracer: Tracer;

    /**
     * Constructs a new instance of the Humanloop client.
     *
     * @param _options - The base options for the Humanloop client.
     * @param providerModules - LLM provider modules to instrument. Allows prompt decorator to spy on LLM provider calls and log them to Humanloop.
     *
     * Pass LLM provider modules as such:
     *
     * ```typescript
     * import { OpenAI } from "openai";
     * import { Anthropic } from "anthropic";
     * import { HumanloopClient } from "humanloop";
     *
     * const humanloop = new HumanloopClient({apiKey: process.env.HUMANLOOP_KEY}, { OpenAI, Anthropic });
     *
     * const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});
     * const anthropic = new Anthropic({apiKey: process.env.ANTHROPIC_KEY});
     * ```
     */
    constructor(
        _options: BaseHumanloopClient.Options,
        providers?: {
            OpenAI?: any;
            Anthropic?: any;
            CohereAI?: any;
        },
    ) {
        super(_options);

        const { OpenAI, Anthropic, CohereAI } = providers ?? {};

        this.OpenAI = OpenAI;
        this.Anthropic = Anthropic;
        this.CohereAI = CohereAI;

        this._prompts_overloaded = overloadLog(super.prompts);
        this._prompts_overloaded = overloadCall(this._prompts_overloaded);

        this._tools_overloaded = overloadLog(super.tools);

        this._flows_overloaded = overloadLog(super.flows);

        this._evaluators_overloaded = overloadLog(super.evaluators);

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

    public options(): BaseHumanloopClient.Options {
        return this._options;
    }

    // Check if user has passed the LLM provider instrumentors
    private assertProviders(func: Function) {
        const noProviderInstrumented = [
            this.OpenAI,
            this.Anthropic,
            this.CohereAI,
        ].every((p) => !p);
        if (noProviderInstrumented) {
            throw new HumanloopRuntimeError(
                `${RED}To use the @prompt decorator, pass your LLM client library into the Humanloop client constructor. For example:\n\n
import { OpenAI } from "openai";
import { HumanloopClient } from "humanloop";

const humanloop = new HumanloopClient({apiKey: process.env.HUMANLOOP_KEY}, { OpenAI });
// Create the the OpenAI client after the client is initialized
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
     * import { HumanloopClient } from "humanloop";
     *
     * const humanloop = new HumanloopClient({apiKey: process.env.HUMANLOOP_KEY}, { OpenAI });
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
     *
     *     const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
     *     const anthropicResponse = await anthropicClient.messages.create({
     *       model: "claude-3-5-sonnet-20240620",
     *       temperature: 0.5,
     *     });
     *     const anthropicContent = anthropicResponse.content;
     *
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
        callable: I extends Record<string, unknown> & { messages?: ChatMessage[] }
            ? (args: I) => O
            : () => O;
        path: string;
    }): I extends Record<string, unknown>
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
        callable: I extends Record<string, unknown> ? (args: I) => O : () => O;
        path: string;
        version: ToolKernelRequest;
    }): I extends Record<string, unknown>
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
        callable: I extends Record<string, unknown> & { messages?: ChatMessage[] }
            ? ((args: I) => O) | (() => O)
            : never;
        path: string;
        attributes?: Record<string, unknown>;
    }): I extends Record<string, unknown> & { messages?: ChatMessage[] }
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

    public get evaluators(): Evaluators {
        return this._evaluators_overloaded;
    }
}
