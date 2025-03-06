import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-base";
import { log } from "console";

import { getEvaluationContext } from "../eval_utils";
import { HumanloopClient } from "../humanloop.client";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
} from "./constants";
import {
    isLLMProviderCall,
    readFromOpenTelemetrySpan,
    writeToOpenTelemetrySpan,
} from "./helpers";
import { Span as ProtoBufferSpan } from "./proto/trace";
import { TracesData } from "./proto/trace";

export class HumanloopSpanExporter implements SpanExporter {
    private readonly client: HumanloopClient;
    private shutdownFlag: boolean;
    private readonly uploadPromises: Promise<void>[];
    private readonly exportedSpans: ReadableSpan[];

    constructor(client: HumanloopClient) {
        this.client = client;
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
            this.uploadPromises.push(this.exportSpanDispatch(span));
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

    private hrTimeToNanoseconds(hrTime: [number, number]): number {
        // Convert high resolution time to nanoseconds
        const [seconds, nanoseconds] = hrTime;
        return seconds * 1e9 + nanoseconds;
    }

    private async exportSpanDispatch(span: ReadableSpan): Promise<void> {
        const fileType = span.attributes[HUMANLOOP_FILE_TYPE_KEY];
        const filePath = span.attributes[HUMANLOOP_PATH_KEY] as string;
        let logArgs = {};
        try {
            logArgs = readFromOpenTelemetrySpan(span, HUMANLOOP_LOG_KEY);
        } catch (e) {}

        const evaluationContext = getEvaluationContext();
        if (evaluationContext !== undefined) {
            if (evaluationContext.path === filePath) {
                logArgs = {
                    ...logArgs,
                    source_datapoint_id: evaluationContext.sourceDatapointId,
                    run_id: evaluationContext.runId,
                };
            }
        }

        writeToOpenTelemetrySpan(span, logArgs, HUMANLOOP_LOG_KEY);

        const payload: TracesData = {
            resourceSpans: [
                {
                    scopeSpans: [
                        {
                            scope: {
                                name: isLLMProviderCall(span)
                                    ? "humanloop.sdk.provider"
                                    : "humanloop.sdk.decorator",
                            },
                            spans: [this.spanToProto(span)],
                        },
                    ],
                },
            ],
        };
        const response = await fetch("http://0.0.0.0:80/v5/import/otel/v1/traces", {
            method: "POST",
            headers: {
                "X-API-KEY": "hl_sk_66c1dcc77e0499cb08cd785a9469dbf3cb733296cb6a7989",
            },
            body: JSON.stringify(payload),
        });
        if (response.status != 200) {
            // TODO: Handle error
        } else {
            if (
                evaluationContext !== undefined &&
                evaluationContext.path === filePath
            ) {
                if (evaluationContext.logging_counter > 0) {
                    console.warn(
                        `Evaluated callable should only log once against file ${filePath}. ` +
                            `Will not add additional logs to Evaluation. ` +
                            `Do you have multiple logging statements in the body of the function?`,
                    );
                }
                const responseBody = await response.json();
                const logId = responseBody["log_id"];
                evaluationContext.logging_counter += 1;
                await evaluationContext.callback(logId);
            }
        }
        // console.log("RECV", await response.json());
    }

    private spanToProto(span: ReadableSpan): ProtoBufferSpan {
        return {
            traceId: span.spanContext().traceId,
            spanId: span.spanContext().spanId,
            traceState:
                span.spanContext().traceState !== undefined
                    ? span.spanContext().traceState!.serialize()
                    : "",
            name: span.name,
            kind: span.kind,
            startTimeUnixNano: this.hrTimeToNanoseconds(span.startTime),
            endTimeUnixNano: this.hrTimeToNanoseconds(span.endTime),
            attributes: Object.entries(span.attributes)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => ({
                    key,
                    value: {
                        // We filtered out undefined values, so we can safely cast to string
                        stringValue: value!.toString(),
                    },
                })),
            droppedAttributesCount: span.droppedAttributesCount,
            events: [],
            links: span.links.map((link) => ({
                traceId: link.context.traceId,
                spanId: link.context.spanId,
                traceState: link.context.traceState!.serialize(),
                attributes:
                    link.attributes !== undefined
                        ? Object.entries(link.attributes)
                              .filter(([_, value]) => value !== undefined)
                              .map(([key, value]) => ({
                                  key,
                                  value: {
                                      stringValue: value!.toString(),
                                  },
                              }))
                        : [],
                droppedAttributesCount: link.droppedAttributesCount || 0,
            })),
            droppedEventsCount: span.droppedEventsCount,
            droppedLinksCount: span.droppedLinksCount,
        };
    }

    public getExportedSpans(): ReadableSpan[] {
        return this.exportedSpans;
    }
}
