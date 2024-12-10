import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-base";
import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import { readFromOpenTelemetrySpan, isHumanloopSpan } from "./helpers";
import { HumanloopClient } from "humanloop.client";
import { FlowKernelRequest, PromptKernelRequest, ToolKernelRequest } from "api";
import { HUMANLOOP_FILE_KEY, HUMANLOOP_FILE_TYPE_KEY, HUMANLOOP_LOG_KEY, HUMANLOOP_PATH_KEY } from "./constants";

/**
 * Converts a high-resolution time tuple to a JavaScript Date object.
 *
 * @param hrTime - A tuple containing the high-resolution time, where the first element is the number of seconds
 * and the second element is the number of nanoseconds.
 * @returns A Date object representing the high-resolution time.
 */
function hrTimeToDate(hrTime: [number, number]): Date {
    const [seconds, nanoseconds] = hrTime;
    const secondsTotal = seconds + nanoseconds / 1e9;
    return new Date(secondsTotal * 1000);
}

export class HumanloopSpanExporter implements SpanExporter {
    private readonly client: HumanloopClient;
    private readonly spanIdToUploadedLogId: Map<string, string | null>;
    private shutdownFlag: boolean;
    private readonly uploadPromises: Promise<void>[];
    private readonly exportedSpans: ReadableSpan[];

    constructor(client: HumanloopClient) {
        this.client = client;
        this.spanIdToUploadedLogId = new Map();
        this.shutdownFlag = false;
        this.uploadPromises = [];
        this.exportedSpans = [];
    }

    export(spans: ReadableSpan[]): ExportResult {
        if (this.shutdownFlag) {
            return {
                code: ExportResultCode.FAILED,
                error: new Error("Exporter is shutting down"),
            };
        }

        for (const span of spans) {
            if (isHumanloopSpan(span)) {
                this.uploadPromises.push(this.exportSpanDispatch(span));
            }
        }

        this.exportedSpans.push(...spans);

        return {
            code: ExportResultCode.SUCCESS,
        };
    }

    async shutdown(): Promise<void> {
        this.shutdownFlag = true;
        await Promise.all(this.uploadPromises);
    }

    async forceFlush(): Promise<void> {
        await this.shutdown();
    }

    private async exportSpanDispatch(span: ReadableSpan): Promise<void> {
        const fileType = span.attributes[HUMANLOOP_FILE_TYPE_KEY];
        const parentSpanId = span.parentSpanId;

        while (parentSpanId && !this.spanIdToUploadedLogId.has(parentSpanId)) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        try {
            switch (fileType) {
                case "prompt":
                    await this.exportPrompt(span);
                    break;
                case "tool":
                    await this.exportTool(span);
                    break;
                case "flow":
                    await this.exportFlow(span);
                    break;
                default:
                    throw new Error(`Unknown span type: ${fileType}`);
            }
        } catch (error) {
            console.error(`Failed to export span: ${error}`);
        }
    }

    public getExportedSpans(): ReadableSpan[] {
        return this.exportedSpans;
    }

    private async exportPrompt(span: ReadableSpan): Promise<void> {
        const fileObject = readFromOpenTelemetrySpan(span, HUMANLOOP_FILE_KEY);
        const logObject = readFromOpenTelemetrySpan(span, HUMANLOOP_LOG_KEY) as { [key: string]: unknown };
        logObject.startTime = hrTimeToDate(span.startTime);
        logObject.endTime = hrTimeToDate(span.endTime);
        logObject.createdAt = hrTimeToDate(span.endTime);
        const path = span.attributes[HUMANLOOP_PATH_KEY] as string;

        const spanParentId = span.parentSpanId;
        const traceParentId =
            spanParentId !== undefined ? (this.spanIdToUploadedLogId.get(spanParentId) as string) : undefined;

        const prompt: PromptKernelRequest = (fileObject.prompt || {}) as unknown as PromptKernelRequest;

        try {
            const response = await this.client.prompts.log({
                path: path,
                prompt,
                traceParentId,
                ...logObject,
            });
            this.spanIdToUploadedLogId.set(span.spanContext().spanId, response.id);
        } catch (error) {
            console.error(`Error exporting prompt: ${error}`);
        }
    }

    private async exportTool(span: ReadableSpan): Promise<void> {
        const fileObject = readFromOpenTelemetrySpan(span, HUMANLOOP_FILE_KEY);
        const logObject = readFromOpenTelemetrySpan(span, HUMANLOOP_LOG_KEY) as { [key: string]: unknown };
        logObject.startTime = hrTimeToDate(span.startTime);
        logObject.endTime = hrTimeToDate(span.endTime);
        logObject.createdAt = hrTimeToDate(span.endTime);
        const path = span.attributes[HUMANLOOP_PATH_KEY] as string;

        const spanParentId = span.parentSpanId;
        const traceParentId = spanParentId ? (this.spanIdToUploadedLogId.get(spanParentId) as string) : undefined;

        try {
            const response = await this.client.tools.log({
                path: path,
                tool: fileObject.tool as ToolKernelRequest,
                traceParentId,
                ...logObject,
            });
            this.spanIdToUploadedLogId.set(span.spanContext().spanId, response.id);
        } catch (error) {
            console.error(`Error exporting tool: ${error}`);
        }
    }

    private async exportFlow(span: ReadableSpan): Promise<void> {
        const fileObject = readFromOpenTelemetrySpan(span, HUMANLOOP_FILE_KEY);
        const logObject = readFromOpenTelemetrySpan(span, HUMANLOOP_LOG_KEY) as { [key: string]: unknown };
        logObject.startTime = hrTimeToDate(span.startTime);
        logObject.endTime = hrTimeToDate(span.endTime);
        logObject.createdAt = hrTimeToDate(span.endTime);

        const spanParentId = span.parentSpanId;
        const traceParentId = spanParentId ? (this.spanIdToUploadedLogId.get(spanParentId) as string) : undefined;
        const path = span.attributes[HUMANLOOP_PATH_KEY] as string;

        try {
            const response = await this.client.flows.log({
                path: path as string,
                flow: (fileObject.flow as unknown as FlowKernelRequest) || { attributes: {} },
                traceParentId,
                traceStatus: "complete",
                ...logObject,
            });
            this.spanIdToUploadedLogId.set(span.spanContext().spanId, response.id);
        } catch (error) {
            console.error(`Error exporting flow: ${JSON.stringify(error)} ${span.spanContext().spanId}`);
        }
    }
}
