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
    async run(
        file: File,
        dataset: Dataset,
        name?: string,
        evaluators: Evaluator[] = [],
        concurrency: number = 8,
    ): Promise<EvaluatorCheck[]> {
        return runEval(this._client, file, dataset, name, evaluators, concurrency);
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
     * @param providerModules - LLM provider modules to instrument. Pass all LLM providers that you will use in your program if you intend to use File utilities such as `prompt()`.
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
    private assertProviders(func: Function) {
        const noProviderInstrumented = [
            this.OpenAI,
            this.Anthropic,
            this.CohereAI,
        ].every((p) => !p);
        if (noProviderInstrumented) {
            throw new Error(
                `${func.name}: To use the 'prompt()' utility, pass your LLM client library into the Humanloop client constructor; e.g. 'HumanloopClient(..., { providerModules: {OpenAI} } )'.`,
            );
        }
    }

    /**
     * Utility for managing a [Prompt](https://humanloop.com/docs/explanation/prompts) in code.
     *
     * The utility intercepts calls to the LLM provider APIs and creates a new Prompt
     * file based on the hyperparameters used in the call. If a hyperparameter in
     * promptKernel parameter, then they override any value intercepted from the
     * LLM provider call.
     *
     * If the [Prompt](https://humanloop.com/docs/explanation/prompts) already exists
     * on the specified path, a new version will be upserted when any of the above change.
     *
     *
     * Here's an example of declaring a [Prompt](https://humanloop.com/docs/explanation/prompts) in code:
     *
     * ```typescript
     * const openAIClient = new HumanloopClient({
     *       apiKey: process.env.HUMANLOOP_API_KEY || ""
     * })
     *
     * const callModel = prompt({
     *      callable: async (inputs, messages) => {
     *          output = await openAIClient.chat.completions.create({
     *              model: inputs.model,
     *              temperature: inputs.temperature,
     *              messages: messages,
     *              frequencyPenalty: 1,
     *              presencePenalty: 1
     *          })
     *          return output.choices[0].message.content || "";
     *      },
     *      path: "Project/Call LLM"
     * });
     *
     * await callModel(
     *    {model: 'gpt-4o-mini', temperature: 0.7},
     *    [{
     *       "role": "system",
     *       "content": "You are a helpful assistant"
     *    },
     *    {
     *      "role": "user",
     *      "content": "Hi how are you?"
     *    }
     *   ],
     * );
     * ```
     *
     * The `callable` argument is expected to have the signature `(inputs, messages) => string | JSON-serializable`.
     * Consider wrapping the function returned by the utility in an arrow function
     *
     * The utility expects the `callable` function to make a call to one of the supported
     * LLM provider APIs through official client libraries. Alternatively, provide a custom
     * `model` override in the `promptKernel` argument or the logging will fail with an error.
     *
     * The decorated function should return a string or the output should be JSON serializable. If
     * the output cannot be serialized, TypeError will be raised.
     *
     * If the function raises an exception, the log created by the function will have the output
     * field set to `null` and the error field set to the string representation of the exception.
     *
     * @template I - The type of `inputs` argument of the callable.
     * @template M - The type of `message` argument of the callable.
     * @template O - The output type of the callable. Should be string or serializable to JSON.
     * @param {Object} params - The arguments for the prompt utility.
     * @param {InputsMessagesCallableType<I, M, O>} params.callable - The callable the utility should wrap and instrument.
     * @param {string} params.path - The path of the instrumented Prompt on Humanloop.
     * @param {UtilityPromptKernel} [params.promptKernel] - Optional override values for the Prompt, overriding inferences made by the utility from provider call
     * @returns An async function that wraps around the provided `callable`, adding Prompt instrumentation
     */
    public prompt<I, M, O>({
        callable,
        path,
        version,
    }: {
        callable: InputsMessagesCallableType<I, M, O>;
        path: string;
        version?: UtilityPromptKernel;
    }) {
        this.assertProviders(callable);
        return promptUtilityFactory(this.opentelemetryTracer, callable, path, version);
    }

    /**
     * Utility for managing a [Tool](https://humanloop.com/docs/explanation/tools) in code.
     *
     * If the [Tool](https://humanloop.com/docs/explanation/tools) already exists
     * on the specified path, a new version will be upserted when the `toolKernel`
     * utility argument or the source code of the callable changes.
     *
     * Here's an example of declaring a [Tool](https://humanloop.com/docs/explanation/tools) in code:
     *
     * ```typescript
     * const calculator = tool({
     *      callable: ({operation, num1, num2}: {
     *          operation: string,
     *          num1: number,
     *          num2: number
     *      }) => {
     *          switch (operation) {
     *              case "add":
     *                  return num1 + num2;
     *              case "subtract":
     *                  return num1 - num2;
     *              case "multiply":
     *                  return num1 * num2;
     *              case "divide":
     *                  if (num2 === 0) {
     *                      throw new Error("Cannot divide by zero");
     *                  }
     *                  return num1 / num2;
     *              default:
     *                  throw new Error("Cannot divide by zero")l
     *          }
     *      },
     *      toolKernel: {
     *          name: "calculator",
     *          description: "Perform arithmetic operations on two numbers",
     *          strict: true,
     *          parameters: {
     *              type: "object",
     *              properties: {
     *                  operation: {
     *                      type: "string",
     *                      description: "The operation to perform",
     *                      enum: ["add", "subtract", "multiply", "divide"],
     *                  },
     *                  num1: {
     *                      type: "number",
     *                      description: "The first number",
     *                  },
     *                  num2: {
     *                      type: "number",
     *                      description: "The second number",
     *                  }
     *              },
     *              required: ["operation", "num1", "num2"],
     *              additionalProperties: false,
     *          }
     *      },
     *      path: "Project/Calculator"
     * })
     * ```
     *
     * Every call to the decorated function will create a Log against the Tool. For example:
     *
     * ```typescript
     * await calculator({num1: 1, num2: 2})
     * ```
     *
     * Will create the following Log:
     *
     * ```typescript
     * {
     *    inputs: {
     *       num1: 1,
     *       num2: 2
     *    },
     *    output: 3
     * }
     * ```
     *
     * The `callable` argument is expected to have the signature `(inputs) => string | JSON-serializable`.
     *
     * The returned callable has a `jsonAttribute` attribute that can be used for function calling.
     *
     *
     * @template I - The type of `inputs` argument of the callable.
     * @template M - The type of `message` argument of the callable.
     * @template O - The output type of the callable. Should be string or serializable to JSON.
     * @param {Object} params - The arguments for the flow utility.
     * @param {InputsMessagesCallableType<I, M, O>} params.callable - The callable the utility should wrap and instrument.
     * @param {string} params.path - The path of the instrumented Tool on Humanloop.
     * @param {ToolKernelRequest} [params.version] - Optional override values for the Prompt, overriding inferences made by the utility from provider call.
     * @returns An async function that wraps around the provided `callable`, adding Tool instrumentation.
     */
    public tool<I, O>({
        callable,
        path,
        version,
    }: {
        callable: ToolCallableType<I, O>;
        path: string;
        version: ToolKernelRequest;
    }) {
        return toolUtilityFactory(this.opentelemetryTracer, callable, version, path);
    }

    /**
     * Utility for managing a [Flow](https://humanloop.com/docs/explanation/flows) in code.
     *
     * A [Flow](https://humanloop.com/docs/explanation/flows) callable should be added
     * at the entrypoint of your LLM feature. Call other functions wrapped in Humanloop
     * utilities to create a trace of Logs on Humanloop.
     *
     * If the [Flow](https://humanloop.com/docs/explanation/flows) already exists
     * on the specified path, a new version will be upserted when the `flowUtility`
     * argument changes.
     *
     * Here's an example of declaring a [Flow](https://humanloop.com/docs/explanation/flows) in code:
     *
     * ```typescript
     * const callModel = humanloop.prompt({
     *     callable: async (inputs, messages) => {
     *         output = await openAIClient.chat.completions.create({
     *             model: inputs.model,
     *             temperature: inputs.temperature,
     *             messages: messages,
     *             frequencyPenalty: 1,
     *             presencePenalty: 1
     *         })
     *         return output.choices[0].message.content || "";
     *    },
     *    path: "Project/Call LLM"
     * });
     *
     * // Pass `undefined` to unused inputs and messages parameters
     * const entrypoint = () => humanloop.flow({
     *     callable: async (inputs: any, messages: any) => {
     *         while (true) {
     *             const messages = []
     *             // I/O operation
     *             const userInput = read_input("You: ")
     *             if (userInput === "exit") {
     *                 break;
     *             }
     *             messages.push({"role": "user", "content": userInput})
     *             const response = await callLLM(messages)
     *             messages.append({"role": "assistant", "content": response})
     *             console.log(f`Assistant: ${response}`)
     *         }
     *     }
     * })(undefined, undefined)
     * await entrypoint()
     * ```
     *
     * In this example, the Flow instruments a conversational agent where the
     * Prompt defined in `callModel` is called multiple times in a loop. Calling
     * `entrypoint` will create a Flow Trace under which multiple Prompt Logs
     * will be nested, allowing you to track the whole conversation session
     * between the user and the assistant.
     *
     * The decorated function should return a string or the output should be JSON serializable. If
     * the output cannot be serialized, TypeError will be raised.
     *
     * If the function raises an exception, the log created by the function will have the `output`
     * field set to None and the `error` field set to the string representation of the exception.
     *
     *
     * @template I - The type of `inputs` argument of the callable.
     * @template M - The type of `message` argument of the callable.
     * @template O - The output type of the callable. Should be string or serializable to JSON.
     * @param {Object} params - The arguments for the prompt utility.
     * @param {InputsMessagesCallableType<I, M, O>} params.callable - The callable the utility should wrap and instrument.
     * @param {string} params.path - The path of the instrumented Flow on Humanloop.
     * @param {FlowKernelRequest} [params.flowKernel] - Versioning information for the Flow.
     * @returns An async function that wraps around the provided `callable`, adding Tool instrumentation.
     */
    public flow<I, M, O>({
        callable,
        path,
        version,
    }: {
        callable: InputsMessagesCallableType<I, M, O>;
        path: string;
        version?: FlowKernelRequest;
    }) {
        return flowUtilityFactory(this.opentelemetryTracer, callable, path, version);
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
