// NOTE: Machine-translated from https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/trace/v1/trace.proto
import { InstrumentationScope, KeyValue } from "./common";
import { Resource } from "./resource";

export interface TracesData {
    resourceSpans: ResourceSpans[];
}

export interface ResourceSpans {
    resource?: Resource;
    scopeSpans: ScopeSpans[];
    schemaUrl?: string;
}

export interface ScopeSpans {
    scope?: InstrumentationScope;
    spans: Span[];
    schemaUrl?: string;
}

export interface Span {
    traceId: string;
    spanId: string;
    traceState: string;
    parentSpanId?: string;
    flags?: number;
    name: string;
    kind: SpanKind;
    startTimeUnixNano: number;
    endTimeUnixNano: number;
    attributes: KeyValue[];
    droppedAttributesCount: number;
    events: Event[];
    droppedEventsCount: number;
    links: Link[];
    droppedLinksCount: number;
    status?: Status;
}

export enum SpanKind {
    INTERNAL = 0,
    SERVER = 1,
    CLIENT = 2,
    PRODUCER = 3,
    CONSUMER = 4,
}

export interface Event {
    timeUnixNano: number;
    name: string;
    attributes: KeyValue[];
    droppedAttributesCount: number;
}

export interface Link {
    traceId: string;
    spanId: string;
    traceState: string;
    attributes: KeyValue[];
    droppedAttributesCount: number;
    flags?: number;
}

export interface Status {
    message: string;
    code: StatusCode;
}

export enum StatusCode {
    UNSET = 0,
    OK = 1,
    ERROR = 2,
}

export enum SpanFlags {
    DO_NOT_USE = 0,
    TRACE_FLAGS_MASK = 0x000000ff,
    CONTEXT_HAS_IS_REMOTE_MASK = 0x00000100,
    CONTEXT_IS_REMOTE_MASK = 0x00000200,
}
