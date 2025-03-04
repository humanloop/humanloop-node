/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Humanloop from "../../../index";
import urlJoin from "url-join";
import * as serializers from "../../../../serialization/index";
import * as errors from "../../../../errors/index";

export declare namespace Logs {
    interface Options {
        environment?: core.Supplier<environments.HumanloopEnvironment | string>;
        apiKey: core.Supplier<string>;
        fetcher?: core.FetchFunction;
    }

    interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
    }
}

/**
 * Logs contain the inputs and outputs of each time a Prompt, Tool or Evaluator is called.
 *
 * Humanloop automatically records the inputs and outputs when you Call a Prompt or Tool and saves a Log.
 * Evaluator Logs are also created when an Evaluator is run on a Log.
 *
 * You can manually create Logs through the API.
 *
 * ...
 *
 *
 *
 */
export class Logs {
    constructor(protected readonly _options: Logs.Options) {}

    /**
     * List all Logs for the given filter criteria.
     *
     * @param {Humanloop.ListLogsGetRequest} request
     * @param {Logs.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.logs.list({
     *         fileId: "file_123abc",
     *         size: 1
     *     })
     */
    public async list(
        request: Humanloop.ListLogsGetRequest,
        requestOptions?: Logs.RequestOptions,
    ): Promise<core.Page<Humanloop.LogResponse>> {
        const list = async (request: Humanloop.ListLogsGetRequest): Promise<Humanloop.PaginatedDataLogResponse> => {
            const {
                fileId,
                page,
                size,
                versionId,
                versionStatus,
                id,
                search,
                metadataSearch,
                startDate,
                endDate,
                includeParent,
                inTraceFilter,
                sample,
                includeTraceChildren,
            } = request;
            const _queryParams: Record<string, string | string[] | object | object[]> = {};
            _queryParams["file_id"] = fileId;
            if (page != null) {
                _queryParams["page"] = page.toString();
            }
            if (size != null) {
                _queryParams["size"] = size.toString();
            }
            if (versionId != null) {
                _queryParams["version_id"] = versionId;
            }
            if (versionStatus != null) {
                _queryParams["version_status"] = versionStatus;
            }
            if (id != null) {
                if (Array.isArray(id)) {
                    _queryParams["id"] = id.map((item) => item);
                } else {
                    _queryParams["id"] = id;
                }
            }
            if (search != null) {
                _queryParams["search"] = search;
            }
            if (metadataSearch != null) {
                _queryParams["metadata_search"] = metadataSearch;
            }
            if (startDate != null) {
                _queryParams["start_date"] = startDate.toISOString();
            }
            if (endDate != null) {
                _queryParams["end_date"] = endDate.toISOString();
            }
            if (includeParent != null) {
                _queryParams["include_parent"] = includeParent.toString();
            }
            if (inTraceFilter != null) {
                if (Array.isArray(inTraceFilter)) {
                    _queryParams["in_trace_filter"] = inTraceFilter.map((item) => item.toString());
                } else {
                    _queryParams["in_trace_filter"] = inTraceFilter.toString();
                }
            }
            if (sample != null) {
                _queryParams["sample"] = sample.toString();
            }
            if (includeTraceChildren != null) {
                _queryParams["include_trace_children"] = includeTraceChildren.toString();
            }
            const _response = await (this._options.fetcher ?? core.fetcher)({
                url: urlJoin(
                    (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                    "logs",
                ),
                method: "GET",
                headers: {
                    "X-Fern-Language": "JavaScript",
                    "X-Fern-SDK-Name": "humanloop",
                    "X-Fern-SDK-Version": "0.8.16",
                    "User-Agent": "humanloop/0.8.16",
                    "X-Fern-Runtime": core.RUNTIME.type,
                    "X-Fern-Runtime-Version": core.RUNTIME.version,
                    ...(await this._getCustomAuthorizationHeaders()),
                },
                contentType: "application/json",
                queryParameters: _queryParams,
                requestType: "json",
                timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
                maxRetries: requestOptions?.maxRetries,
                abortSignal: requestOptions?.abortSignal,
            });
            if (_response.ok) {
                return serializers.PaginatedDataLogResponse.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 422:
                        throw new Humanloop.UnprocessableEntityError(
                            serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                                unrecognizedObjectKeys: "passthrough",
                                allowUnrecognizedUnionMembers: true,
                                allowUnrecognizedEnumValues: true,
                                skipValidation: true,
                                breadcrumbsPrefix: ["response"],
                            }),
                        );
                    default:
                        throw new errors.HumanloopError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.HumanloopError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.HumanloopTimeoutError();
                case "unknown":
                    throw new errors.HumanloopError({
                        message: _response.error.errorMessage,
                    });
            }
        };
        let _offset = request?.page != null ? request?.page : 1;
        return new core.Pageable<Humanloop.PaginatedDataLogResponse, Humanloop.LogResponse>({
            response: await list(request),
            hasNextPage: (response) => (response?.records ?? []).length > 0,
            getItems: (response) => response?.records ?? [],
            loadPage: (_response) => {
                _offset += 1;
                return list(core.setObjectProperty(request, "page", _offset));
            },
        });
    }

    /**
     * Delete Logs with the given IDs.
     *
     * @param {Humanloop.LogsDeleteRequest} request
     * @param {Logs.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.logs.delete()
     */
    public async delete(
        request: Humanloop.LogsDeleteRequest = {},
        requestOptions?: Logs.RequestOptions,
    ): Promise<void> {
        const { id } = request;
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (id != null) {
            if (Array.isArray(id)) {
                _queryParams["id"] = id.map((item) => item);
            } else {
                _queryParams["id"] = id;
            }
        }

        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                "logs",
            ),
            method: "DELETE",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.16",
                "User-Agent": "humanloop/0.8.16",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            queryParameters: _queryParams,
            requestType: "json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new Humanloop.UnprocessableEntityError(
                        serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            skipValidation: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                    );
                default:
                    throw new errors.HumanloopError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.HumanloopError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.HumanloopTimeoutError();
            case "unknown":
                throw new errors.HumanloopError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Retrieve the Log with the given ID.
     *
     * @param {string} id - Unique identifier for Log.
     * @param {Logs.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.logs.get("prv_Wu6zx1lAWJRqOyL8nWuZk")
     */
    public async get(id: string, requestOptions?: Logs.RequestOptions): Promise<Humanloop.LogResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `logs/${encodeURIComponent(id)}`,
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.16",
                "User-Agent": "humanloop/0.8.16",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            requestType: "json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.LogResponse.parseOrThrow(_response.body, {
                unrecognizedObjectKeys: "passthrough",
                allowUnrecognizedUnionMembers: true,
                allowUnrecognizedEnumValues: true,
                skipValidation: true,
                breadcrumbsPrefix: ["response"],
            });
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new Humanloop.UnprocessableEntityError(
                        serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            skipValidation: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                    );
                default:
                    throw new errors.HumanloopError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.HumanloopError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.HumanloopTimeoutError();
            case "unknown":
                throw new errors.HumanloopError({
                    message: _response.error.errorMessage,
                });
        }
    }

    protected async _getCustomAuthorizationHeaders() {
        const apiKeyValue = (await core.Supplier.get(this._options.apiKey)) ?? process?.env["HUMANLOOP_API_KEY"];
        return { "X-API-KEY": apiKeyValue };
    }
}
