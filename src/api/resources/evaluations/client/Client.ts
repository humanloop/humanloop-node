/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Humanloop from "../../../index";
import urlJoin from "url-join";
import * as serializers from "../../../../serialization/index";
import * as errors from "../../../../errors/index";

export declare namespace Evaluations {
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
 * Evaluations help you measure the performance of your Prompts, Tools and LLM Evaluators.
 *
 * An Evaluation consists of a Dataset, Evaluatees (i.e. Versions to evaluate), and Evaluators.
 * When an Evaluation is created, Humanloop will start generating Logs, iterating through Datapoints in the Dataset,
 * for each Evaluatee. The Evaluators will then be run on these Logs.
 *
 * Aggregate stats can be viewed in the Humanloop app or retrieved with the **Get Evaluation Stats** endpoint.
 *
 * Note that when an Evaluation is created, Humanloop will attempt to reuse any existing Logs for each Datapoint-Evaluatee
 * pair. This means that you can create multiple Evaluations without generating new Logs unnecessarily.
 *
 *
 */
export class Evaluations {
    constructor(protected readonly _options: Evaluations.Options) {}

    /**
     * List all Evaluations for the specified `file_id`.
     *
     * Retrieve a list of Evaluations that evaluate versions of the specified File.
     *
     * @param {Humanloop.ListEvaluationsGetRequest} request
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.list({
     *         fileId: "pr_30gco7dx6JDq4200GVOHa",
     *         size: 1
     *     })
     */
    public async list(
        request: Humanloop.ListEvaluationsGetRequest,
        requestOptions?: Evaluations.RequestOptions
    ): Promise<core.Page<Humanloop.EvaluationResponse>> {
        const list = async (
            request: Humanloop.ListEvaluationsGetRequest
        ): Promise<Humanloop.PaginatedEvaluationResponse> => {
            const { fileId, page, size } = request;
            const _queryParams: Record<string, string | string[] | object | object[]> = {};
            _queryParams["file_id"] = fileId;
            if (page != null) {
                _queryParams["page"] = page.toString();
            }
            if (size != null) {
                _queryParams["size"] = size.toString();
            }
            const _response = await (this._options.fetcher ?? core.fetcher)({
                url: urlJoin(
                    (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                    "evaluations"
                ),
                method: "GET",
                headers: {
                    "X-Fern-Language": "JavaScript",
                    "X-Fern-SDK-Name": "humanloop",
                    "X-Fern-SDK-Version": "0.8.0-beta6",
                    "User-Agent": "humanloop/0.8.0-beta6",
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
                return serializers.PaginatedEvaluationResponse.parseOrThrow(_response.body, {
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
        return new core.Pageable<Humanloop.PaginatedEvaluationResponse, Humanloop.EvaluationResponse>({
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
     * Create an Evaluation.
     *
     * Create a new Evaluation by specifying the Dataset, versions to be
     * evaluated (Evaluatees), and which Evaluators to provide judgments.
     *
     * Humanloop will automatically start generating Logs and running Evaluators where
     * `orchestrated=true`. If you own the runtime for the Evaluatee or Evaluator, you
     * can set `orchestrated=false` and then generate and submit the required logs using
     * your runtime.
     *
     * To keep updated on the progress of the Evaluation, you can poll the Evaluation using
     * the GET /evaluations/{id} endpoint and check its status.
     *
     * @param {Humanloop.CreateEvaluationRequest} request
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.create({
     *         dataset: {
     *             versionId: "dsv_6L78pqrdFi2xa"
     *         },
     *         evaluatees: [{
     *                 versionId: "prv_7ZlQREDScH0xkhUwtXruN",
     *                 orchestrated: false
     *             }],
     *         evaluators: [{
     *                 versionId: "evv_012def",
     *                 orchestrated: false
     *             }]
     *     })
     */
    public async create(
        request: Humanloop.CreateEvaluationRequest,
        requestOptions?: Evaluations.RequestOptions
    ): Promise<Humanloop.EvaluationResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                "evaluations"
            ),
            method: "POST",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            requestType: "json",
            body: serializers.CreateEvaluationRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.EvaluationResponse.parseOrThrow(_response.body, {
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
     * Get an Evaluation.
     *
     * @param {string} id - Unique identifier for Evaluation.
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.get("ev_567yza")
     */
    public async get(id: string, requestOptions?: Evaluations.RequestOptions): Promise<Humanloop.EvaluationResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `evaluations/${encodeURIComponent(id)}`
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
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
            return serializers.EvaluationResponse.parseOrThrow(_response.body, {
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
     * Delete an Evaluation.
     *
     * Remove an Evaluation from Humanloop. The Logs and Versions used in the Evaluation
     * will not be deleted.
     *
     * @param {string} id - Unique identifier for Evaluation.
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.delete("ev_567yza")
     */
    public async delete(id: string, requestOptions?: Evaluations.RequestOptions): Promise<void> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `evaluations/${encodeURIComponent(id)}`
            ),
            method: "DELETE",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
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
     * Update an Evaluation.
     *
     * Update the setup of an Evaluation by specifying the Dataset, versions to be
     * evaluated (Evaluatees), and which Evaluators to provide judgments.
     *
     * @param {string} id - Unique identifier for Evaluation.
     * @param {Humanloop.CreateEvaluationRequest} request
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.updateSetup("ev_567yza", {
     *         dataset: {
     *             versionId: "dsv_6L78pqrdFi2xa"
     *         },
     *         evaluatees: [{
     *                 versionId: "prv_7ZlQREDScH0xkhUwtXruN",
     *                 orchestrated: false
     *             }],
     *         evaluators: [{
     *                 versionId: "evv_012def",
     *                 orchestrated: false
     *             }]
     *     })
     */
    public async updateSetup(
        id: string,
        request: Humanloop.CreateEvaluationRequest,
        requestOptions?: Evaluations.RequestOptions
    ): Promise<Humanloop.EvaluationResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `evaluations/${encodeURIComponent(id)}`
            ),
            method: "PATCH",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            requestType: "json",
            body: serializers.CreateEvaluationRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.EvaluationResponse.parseOrThrow(_response.body, {
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
     * Update the status of an Evaluation.
     *
     * Can be used to cancel a running Evaluation, or mark an Evaluation that uses
     * external or human evaluators as completed.
     *
     * @param {string} id - Unique identifier for Evaluation.
     * @param {Humanloop.BodyUpdateStatusEvaluationsIdStatusPatch} request
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.updateStatus("id", {
     *         status: Humanloop.EvaluationStatus.Pending
     *     })
     */
    public async updateStatus(
        id: string,
        request: Humanloop.BodyUpdateStatusEvaluationsIdStatusPatch,
        requestOptions?: Evaluations.RequestOptions
    ): Promise<Humanloop.EvaluationResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `evaluations/${encodeURIComponent(id)}/status`
            ),
            method: "PATCH",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            requestType: "json",
            body: serializers.BodyUpdateStatusEvaluationsIdStatusPatch.jsonOrThrow(request, {
                unrecognizedObjectKeys: "strip",
            }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.EvaluationResponse.parseOrThrow(_response.body, {
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
     * Get Evaluation Stats.
     *
     * Retrieve aggregate stats for the specified Evaluation.
     * This includes the number of generated Logs for each evaluated version and the
     * corresponding Evaluator statistics (such as the mean and percentiles).
     *
     * @param {string} id - Unique identifier for Evaluation.
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.getStats("id")
     */
    public async getStats(id: string, requestOptions?: Evaluations.RequestOptions): Promise<Humanloop.EvaluationStats> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `evaluations/${encodeURIComponent(id)}/stats`
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
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
            return serializers.EvaluationStats.parseOrThrow(_response.body, {
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
     * Get the Logs associated to a specific Evaluation.
     *
     * Each Datapoint in your Dataset will have a corresponding Log for each File version evaluated.
     * e.g. If you have 50 Datapoints and are evaluating 2 Prompts, there will be 100 Logs associated with the Evaluation.
     *
     * @param {string} id - String ID of evaluation. Starts with `ev_` or `evr_`.
     * @param {Humanloop.GetLogsEvaluationsIdLogsGetRequest} request
     * @param {Evaluations.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.evaluations.getLogs("id")
     */
    public async getLogs(
        id: string,
        request: Humanloop.GetLogsEvaluationsIdLogsGetRequest = {},
        requestOptions?: Evaluations.RequestOptions
    ): Promise<Humanloop.PaginatedDataEvaluationReportLogResponse> {
        const { page, size } = request;
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (page != null) {
            _queryParams["page"] = page.toString();
        }

        if (size != null) {
            _queryParams["size"] = size.toString();
        }

        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `evaluations/${encodeURIComponent(id)}/logs`
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.0-beta6",
                "User-Agent": "humanloop/0.8.0-beta6",
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
            return serializers.PaginatedDataEvaluationReportLogResponse.parseOrThrow(_response.body, {
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

    protected async _getCustomAuthorizationHeaders() {
        const apiKeyValue = (await core.Supplier.get(this._options.apiKey)) ?? process?.env["HUMANLOOP_API_KEY"];
        return { "X-API-KEY": apiKeyValue };
    }
}
