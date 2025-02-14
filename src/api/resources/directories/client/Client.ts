/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Humanloop from "../../../index";
import urlJoin from "url-join";
import * as serializers from "../../../../serialization/index";
import * as errors from "../../../../errors/index";

export declare namespace Directories {
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

export class Directories {
    constructor(protected readonly _options: Directories.Options) {}

    /**
     * Retrieve a list of all Directories.
     *
     * @param {Directories.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.directories.list()
     */
    public async list(requestOptions?: Directories.RequestOptions): Promise<Humanloop.DirectoryResponse[]> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                "directories",
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.14b1",
                "User-Agent": "humanloop/0.8.14b1",
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
            return serializers.directories.list.Response.parseOrThrow(_response.body, {
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

    /**
     * Creates a Directory.
     *
     * @param {Humanloop.CreateDirectoryRequest} request
     * @param {Directories.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.directories.create()
     */
    public async create(
        request: Humanloop.CreateDirectoryRequest = {},
        requestOptions?: Directories.RequestOptions,
    ): Promise<Humanloop.DirectoryResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                "directories",
            ),
            method: "POST",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.14b1",
                "User-Agent": "humanloop/0.8.14b1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            requestType: "json",
            body: serializers.CreateDirectoryRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.DirectoryResponse.parseOrThrow(_response.body, {
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

    /**
     * Fetches a directory by ID.
     *
     * @param {string} id - String ID of directory. Starts with `dir_`.
     * @param {Directories.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.directories.get("id")
     */
    public async get(
        id: string,
        requestOptions?: Directories.RequestOptions,
    ): Promise<Humanloop.DirectoryWithParentsAndChildrenResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `directories/${encodeURIComponent(id)}`,
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.14b1",
                "User-Agent": "humanloop/0.8.14b1",
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
            return serializers.DirectoryWithParentsAndChildrenResponse.parseOrThrow(_response.body, {
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

    /**
     * Delete the Directory with the given ID.
     *
     * The Directory must be empty (i.e. contain no Directories or Files).
     *
     * @param {string} id - Unique identifier for Directory. Starts with `dir_`.
     * @param {Directories.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.directories.delete("id")
     */
    public async delete(id: string, requestOptions?: Directories.RequestOptions): Promise<void> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `directories/${encodeURIComponent(id)}`,
            ),
            method: "DELETE",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.14b1",
                "User-Agent": "humanloop/0.8.14b1",
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
     * Update the Directory with the given ID.
     *
     * @param {string} id - Unique identifier for Directory. Starts with `dir_`.
     * @param {Humanloop.UpdateDirectoryRequest} request
     * @param {Directories.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.directories.update("id")
     */
    public async update(
        id: string,
        request: Humanloop.UpdateDirectoryRequest = {},
        requestOptions?: Directories.RequestOptions,
    ): Promise<Humanloop.DirectoryResponse> {
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                `directories/${encodeURIComponent(id)}`,
            ),
            method: "PATCH",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.14b1",
                "User-Agent": "humanloop/0.8.14b1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
            },
            contentType: "application/json",
            requestType: "json",
            body: serializers.UpdateDirectoryRequest.jsonOrThrow(request, { unrecognizedObjectKeys: "strip" }),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return serializers.DirectoryResponse.parseOrThrow(_response.body, {
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
