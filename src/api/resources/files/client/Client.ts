/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as Humanloop from "../../../index";
import urlJoin from "url-join";
import * as serializers from "../../../../serialization/index";
import * as errors from "../../../../errors/index";

export declare namespace Files {
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

export class Files {
    constructor(protected readonly _options: Files.Options) {}

    /**
     * Get a paginated list of files.
     *
     * @param {Humanloop.FilesListRequest} request
     * @param {Files.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Humanloop.UnprocessableEntityError}
     *
     * @example
     *     await client.files.list()
     */
    public async list(
        request: Humanloop.FilesListRequest = {},
        requestOptions?: Files.RequestOptions,
    ): Promise<Humanloop.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseFlowResponse> {
        const { page, size, name, type: type_, environment, sortBy, order } = request;
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (page != null) {
            _queryParams["page"] = page.toString();
        }

        if (size != null) {
            _queryParams["size"] = size.toString();
        }

        if (name != null) {
            _queryParams["name"] = name;
        }

        if (type_ != null) {
            if (Array.isArray(type_)) {
                _queryParams["type"] = type_.map((item) => item);
            } else {
                _queryParams["type"] = type_;
            }
        }

        if (environment != null) {
            _queryParams["environment"] = environment;
        }

        if (sortBy != null) {
            _queryParams["sort_by"] = sortBy;
        }

        if (order != null) {
            _queryParams["order"] = order;
        }

        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.HumanloopEnvironment.Default,
                "files",
            ),
            method: "GET",
            headers: {
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "humanloop",
                "X-Fern-SDK-Version": "0.8.9-beta1",
                "User-Agent": "humanloop/0.8.9-beta1",
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
            return serializers.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseFlowResponse.parseOrThrow(
                _response.body,
                {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                    breadcrumbsPrefix: ["response"],
                },
            );
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
