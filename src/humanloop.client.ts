import { NodeTracerProvider, Tracer } from "@opentelemetry/sdk-trace-node";
import { HumanloopClient as BaseHumanloopClient } from "./Client";
import { HumanloopSpanProcessor } from "otel/processor";
import { HumanloopSpanExporter } from "otel/exporter";
import { instrumentProvider } from "otel";
import { UtilityPromptKernel, prompt as promptUtilityFactory } from "decorators/prompt";
import { tool as toolUtilityFactory } from "decorators/tool";
import { flow as flowUtilityFactory } from "decorators/flow";
import { ToolKernelRequest } from "api/types/ToolKernelRequest";
import { FlowKernelRequest } from "api/types/FlowKernelRequest";

export class HumanloopClient extends BaseHumanloopClient {
    protected readonly opentelemetryTracerProvider: NodeTracerProvider;
    protected readonly opentelemetryTracer: Tracer;

    constructor(
        _options: BaseHumanloopClient.Options,
        opentelemetryTracerProvider: NodeTracerProvider,
        opentelemetryTracer: Tracer
    ) {
        super(_options);

        if (opentelemetryTracerProvider) {
            this.opentelemetryTracerProvider = opentelemetryTracerProvider;
        } else {
            this.opentelemetryTracerProvider = new NodeTracerProvider({
                spanProcessors: [new HumanloopSpanProcessor(new HumanloopSpanExporter(this))],
            });
        }

        instrumentProvider(this.opentelemetryTracerProvider);

        this.opentelemetryTracerProvider.register();

        if (this.opentelemetryTracerProvider !== undefined) {
            this.opentelemetryTracer = this.opentelemetryTracerProvider.getTracer("humanloop.sdk");
        } else {
            this.opentelemetryTracer = opentelemetryTracer;
        }
    }

    public prompt<T extends (...args: any[]) => any>(func: T, promptKernel?: UtilityPromptKernel, path?: string) {
        return promptUtilityFactory(this.opentelemetryTracer, func, promptKernel, path);
    }

    public tool<T extends (...args: any[]) => any>(func: T, toolKernel: ToolKernelRequest, path?: string) {
        return toolUtilityFactory(this.opentelemetryTracer, func, toolKernel, path);
    }

    public flow<T extends (...args: any[]) => any>(func: T, flowKernel: FlowKernelRequest, path?: string) {
        return flowUtilityFactory(this.opentelemetryTracer, func, flowKernel, path);
    }
}
