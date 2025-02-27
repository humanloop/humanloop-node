import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-base";
import { log } from "console";
import { getEvaluationContext } from "eval_utils";

import { HumanloopClient } from "../humanloop.client";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
} from "./constants";
import { readFromOpenTelemetrySpan, writeToOpenTelemetrySpan } from "./helpers";

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

    private hrTimeToISODate(hrTime: [number, number]): string {
        // Convert high resolution time to ISO date
        const [seconds, nanoseconds] = hrTime;
        const totalMilliseconds = seconds * 1e3 + nanoseconds / 1e6;
        const date = new Date(totalMilliseconds);
        return date.toISOString();
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

        const response = await fetch("http://0.0.0.0:80/v5/import/otel", {
            method: "POST",
            headers: {
                "X-API-KEY": "hl_sk_66c1dcc77e0499cb08cd785a9469dbf3cb733296cb6a7989",
            },
            body: this.spanToJson(span),
        });
        if (response.status != 200) {
            // TODO: Handle error
        } else {
            if (
                evaluationContext !== undefined &&
                evaluationContext.path === filePath
            ) {
                const responseBody = await response.json();
                const logId = responseBody["log_id"];
                evaluationContext.callback(logId);
            }
        }
        // console.log("RECV", await response.json());
    }

    private spanToJson(span: ReadableSpan) {
        return JSON.stringify({
            attributes: span.attributes,
            start_time: this.hrTimeToISODate(span.startTime),
            end_time: this.hrTimeToISODate(span.endTime),
            name: span.name,
        });
    }

    public getExportedSpans(): ReadableSpan[] {
        return this.exportedSpans;
    }
}
