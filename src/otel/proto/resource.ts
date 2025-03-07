// NOTE: Machine-translated from https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/resource/v1/resource.proto
import { KeyValue } from "./common";

export interface Resource {
    /**
     * Set of attributes that describe the resource.
     * Attribute keys MUST be unique.
     */
    attributes: KeyValue[];

    /**
     * Number of dropped attributes. If the value is 0, then no attributes were dropped.
     */
    droppedAttributesCount: number;
}
