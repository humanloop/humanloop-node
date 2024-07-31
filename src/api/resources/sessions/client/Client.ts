/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Humanloop from "../../../index";
import urlJoin from "url-join";
import * as serializers from "../../../../serialization/index";
import * as errors from "../../../../errors/index";

export declare namespace Sessions {
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
 * Sessions are groups of Logs that track sequences of LLM actions.
 *
 * Sessions enable you to trace through related Logs across different Files. For
 * example, a Session can contain a Prompt Log recording an LLM generation, a Tool
 * Log recording a retrieval step, and Evaluator Logs measuring the quality of the
 * generated text.
 *
 * Logs within a Session may be nested within each other. When Evaluators are run
 * for monitoring, the Evaluator Logs are added to the Session that the evaluated
 * Log is in, nested within the evaluated Log.
 *
 *
 */
export class Sessions {
    constructor(protected readonly _options: Sessions.Options) {}

    /**
     * Retrieve the Session with the given ID.
     *
     * @param {string} id - Unique identifier for Session.
     * @param {Sessions.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.sessions.get("sesh_123abc")
     */
    public async get(id: string, requestOptions?: Sessions.RequestOptions): Promise<Humanloop.SessionResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `sessions/${encodeURIComponent(id)}`
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta4",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.SessionResponse.parseOrThrow(_response.body, {
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
                        })
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
     * Delete the Session with the given ID.
     *
     * @param {string} id - Unique identifier for Session.
     * @param {Sessions.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.sessions.delete("sesh_123abc")
     */
    public async delete(id: string, requestOptions?: Sessions.RequestOptions): Promise<void> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `sessions/${encodeURIComponent(id)}`
            ),
            method: "DELETE",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta4",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
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
                        })
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
     * Get a list of Sessions.
     *
     * @param {Humanloop.ListSessionsGetRequest} request
     * @param {Sessions.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.sessions.list({
     *         size: 1,
     *         fileId: "pr_123abc"
     *     })
     */
    public async list(
        request: Humanloop.ListSessionsGetRequest = {},
        requestOptions?: Sessions.RequestOptions
    ): Promise<core.Page<Humanloop.SessionResponse>> {
        const list = async (request: Humanloop.ListSessionsGetRequest): Promise<Humanloop.PaginatedSessionResponse> => {
            const { fileId, versionId, page, size } = request;
            const _queryParams: Record<string, string | string[] | object | object[]> = {};
            if (fileId != null) {
                _queryParams["file_id"] = fileId;
            }
            if (versionId != null) {
                _queryParams["version_id"] = versionId;
            }
            if (page != null) {
                _queryParams["page"] = page.toString();
            }
            if (size != null) {
                _queryParams["size"] = size.toString();
            }
            const _response = await (this._options.fetcher ?? core.fetcher)({
                url: urlJoin(
                    (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                    "sessions"
                ),
                method: "GET",
                headers: {
                    "X-Fern-Language": "JavaScript",
                    "X-Fern-SDK-Name": "humanloop",
                    "X-Fern-SDK-Version": "0.8.0-beta4",
                    "X-Fern-Runtime": core.RUNTIME.type,
                    "X-Fern-Runtime-Version": core.RUNTIME.version,
                    ...(await this._getCustomAuthorizationHeaders()),
                },
                contentType: "application/json",
                queryParameters: _queryParams,
                timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
                maxRetries: requestOptions?.maxRetries,
                abortSignal: requestOptions?.abortSignal,
            });
            if (_response.ok) {
                return serializers.PaginatedSessionResponse.parseOrThrow(_response.body, {
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
                            })
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
        return new core.Pageable<Humanloop.PaginatedSessionResponse, Humanloop.SessionResponse>({
            response: await list(request),
            hasNextPage: (response) => (response?.records ?? []).length > 0,
            getItems: (response) => response?.records ?? [],
            loadPage: (_response) => {
                _offset += 1;
                return list(core.setObjectProperty(request, "page", _offset));
            },
        });
    }

    protected async _getCustomAuthorizationHeaders() {
        const apiKeyValue = (await core.Supplier.get(this._options.apiKey)) ?? process?.env["HUMANLOOP_API_KEY"];
        return { "X-API-KEY": apiKeyValue };
    }
}
