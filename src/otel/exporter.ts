import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-base";

import { HumanloopRuntimeError } from "../error";
import { getEvaluationContext } from "../evals";
import { HumanloopClient } from "../humanloop.client";
import { SDK_VERSION } from "../version";
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
import { TracesData } from "./proto/trace";

export class HumanloopSpanExporter implements SpanExporter {
    private readonly client: HumanloopClient;
    private shutdownFlag: boolean;
    private readonly uploadPromises: Promise<void>[];

    constructor(client: HumanloopClient) {
        this.client = client;
        this.shutdownFlag = false;
        this.uploadPromises = [];
    }

    export(spans: ReadableSpan[]): ExportResult {
        if (this.shutdownFlag) {
            console.warn(
                "[HumanloopSpanExporter] Shutting down, not accepting new spans",
            );
            return {
                code: ExportResultCode.FAILED,
                error: new Error("Exporter is shutting down"),
            };
        }

        for (const span of spans) {
            const fileType = span.attributes[HUMANLOOP_FILE_TYPE_KEY];
            if (!fileType) {
                throw new Error("Internal error: Span does not have type set");
            }

            let logArgs = {};
            let evalCallback: ((log_id: string) => Promise<void>) | null = null;
            try {
                logArgs = readFromOpenTelemetrySpan(span, HUMANLOOP_LOG_KEY);
                const path = readFromOpenTelemetrySpan(
                    span,
                    HUMANLOOP_PATH_KEY,
                ) as unknown as string;
                const evaluationContext = getEvaluationContext();
                if (evaluationContext) {
                    [logArgs, evalCallback] = evaluationContext.logArgsWithContext({
                        logArgs,
                        forOtel: true,
                        path,
                    });
                    writeToOpenTelemetrySpan(span, logArgs, HUMANLOOP_LOG_KEY);
                }
            } catch (e) {
                if (!(e instanceof Error)) {
                    evalCallback = null;
                }
            }

            this.uploadPromises.push(this.exportSpan(span, evalCallback));
        }

        return { code: ExportResultCode.SUCCESS };
    }

    async shutdown(): Promise<void> {
        this.shutdownFlag = true;
        await Promise.all(this.uploadPromises);
    }

    async forceFlush(): Promise<void> {
        await this.shutdown();
    }

    private async exportSpan(
        span: ReadableSpan,
        evalContextCallback: ((log_id: string) => Promise<void>) | null,
    ): Promise<void> {
        const response = await fetch(
            `${this.client.options().baseUrl}/import/otel/v1/traces`,
            {
                method: "POST",
                headers: {
                    "X-API-KEY": this.client.options().apiKey!.toString(),
                    "X-Fern-Language": "Typescript",
                    "X-Fern-SDK-Name": "humanloop",
                    "X-Fern-SDK-Version": SDK_VERSION,
                },
                body: JSON.stringify(this.spanToPayload(span)),
            },
        );

        if (response.status !== 200) {
            throw new HumanloopRuntimeError(
                `Failed to upload OTEL span to Humanloop: ${JSON.stringify(await response.json())} ${response.status}`,
            );
        }
        if (response.status === 200 && evalContextCallback) {
            const responseBody = await response.json();
            const logId = responseBody.records[0];
            await evalContextCallback(logId);
        }
    }

    private spanToPayload(span: ReadableSpan): TracesData {
        return {
            resourceSpans: [
                {
                    scopeSpans: [
                        {
                            scope: {
                                name: isLLMProviderCall(span)
                                    ? "humanloop.sdk.provider"
                                    : "humanloop.sdk.decorator",
                            },
                            spans: [
                                {
                                    traceId: span.spanContext().traceId,
                                    spanId: span.spanContext().spanId,
                                    traceState:
                                        span.spanContext().traceState?.serialize() ||
                                        "",
                                    name: span.name,
                                    kind: span.kind,
                                    startTimeUnixNano: this.hrTimeToNanoseconds(
                                        span.startTime,
                                    ),
                                    endTimeUnixNano: this.hrTimeToNanoseconds(
                                        span.endTime,
                                    ),
                                    attributes: Object.entries(span.attributes)
                                        .filter(([_, value]) => value !== undefined)
                                        .map(([key, value]) => ({
                                            key,
                                            value: { stringValue: value!.toString() },
                                        })),
                                    droppedAttributesCount: span.droppedAttributesCount,
                                    events: [],
                                    links: span.links.map((link) => ({
                                        traceId: link.context.traceId,
                                        spanId: link.context.spanId,
                                        traceState:
                                            link.context.traceState?.serialize() || "",
                                        attributes: link.attributes
                                            ? Object.entries(link.attributes)
                                                  .filter(
                                                      ([_, value]) =>
                                                          value !== undefined,
                                                  )
                                                  .map(([key, value]) => ({
                                                      key,
                                                      value: {
                                                          stringValue:
                                                              value!.toString(),
                                                      },
                                                  }))
                                            : [],
                                        droppedAttributesCount:
                                            link.droppedAttributesCount || 0,
                                    })),
                                    droppedEventsCount: span.droppedEventsCount,
                                    droppedLinksCount: span.droppedLinksCount,
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }

    private hrTimeToNanoseconds(hrTime: [number, number]): number {
        const [seconds, nanoseconds] = hrTime;
        return seconds * 1e9 + nanoseconds;
    }
}
