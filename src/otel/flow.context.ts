export interface FlowContext {
    traceId?: string; // Optional string for trace ID
    traceParentId?: string | null; // Optional number or null for trace parent ID
    isFlowLog?: boolean; // Optional boolean to indicate if it's a flow log
}
