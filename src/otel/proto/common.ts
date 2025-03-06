// NOTE: Machine-translated from https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/common/v1/common.proto

export type AnyValue = {
    stringValue?: string;
    boolValue?: boolean;
    intValue?: number;
    doubleValue?: number;
    arrayValue?: ArrayValue;
    kvlistValue?: KeyValueList;
    bytesValue?: Uint8Array;
};

export type ArrayValue = {
    values: AnyValue[];
};

export type KeyValueList = {
    values: KeyValue[];
};

export type KeyValue = {
    key: string;
    value: AnyValue;
};

export type InstrumentationScope = {
    name: string;
    // NOTE: deviation from spec - marking last three fields as optional
    version?: string;
    attributes?: KeyValue[];
    droppedAttributesCount?: number;
};
