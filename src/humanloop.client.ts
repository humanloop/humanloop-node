import { NodeTracerProvider, Tracer } from "@opentelemetry/sdk-trace-node";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

import { HumanloopClient as BaseHumanloopClient } from "./Client";
import { FlowKernelRequest } from "./api/types/FlowKernelRequest";
import { ToolKernelRequest } from "./api/types/ToolKernelRequest";
import { HumanloopSpanExporter } from "./otel/exporter";
import { moduleIsInstalled } from "./otel/helpers";
import { HumanloopSpanProcessor } from "./otel/processor";
import { flowUtilityFactory } from "./utilities/flow";
import { UtilityPromptKernel, promptUtilityFactory } from "./utilities/prompt";
import { toolUtilityFactory } from "./utilities/tool";

export class HumanloopClient extends BaseHumanloopClient {
    protected readonly opentelemetryTracerProvider: NodeTracerProvider;
    protected readonly opentelemetryTracer: Tracer;

    constructor(_options: BaseHumanloopClient.Options) {
        super(_options);

        this.opentelemetryTracerProvider = new NodeTracerProvider({
            spanProcessors: [
                new HumanloopSpanProcessor(new HumanloopSpanExporter(this)),
            ],
        });

        if (moduleIsInstalled("openai")) {
            const openai = require("openai").default;
            const instrumentor = new OpenAIInstrumentation({
                enrichTokens: true,
            });
            instrumentor.manuallyInstrument(openai);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        if (moduleIsInstalled("@anthropic-ai/sdk")) {
            const anthropic = require("@anthropic-ai/sdk");
            const instrumentor = new AnthropicInstrumentation();
            instrumentor.manuallyInstrument(anthropic);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        if (moduleIsInstalled("cohere-ai")) {
            const cohere = require("cohere-ai");
            const instrumentor = new CohereInstrumentation();
            instrumentor.manuallyInstrument(cohere);
            instrumentor.setTracerProvider(this.opentelemetryTracerProvider);
            instrumentor.enable();
        }

        this.opentelemetryTracerProvider.register();

        this.opentelemetryTracer =
            this.opentelemetryTracerProvider.getTracer("humanloop.sdk");
    }

    public prompt<T extends (...args: any[]) => any>(promptUtilityArguments: {
        callable: T;
        promptKernel?: UtilityPromptKernel;
        path?: string;
    }) {
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
        return flowUtilityFactory(
            this.opentelemetryTracer,
            flowUtilityArguments.callable,
            flowUtilityArguments.flowKernel,
            flowUtilityArguments.path,
        );
    }
}
