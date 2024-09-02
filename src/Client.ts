/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "./environments";
import * as core from "./core";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Tools } from "./api/resources/tools/client/Client";
import { Datasets } from "./api/resources/datasets/client/Client";
import { Files } from "./api/resources/files/client/Client";
import { Evaluations } from "./api/resources/evaluations/client/Client";
import { Evaluators } from "./api/resources/evaluators/client/Client";
import { Logs } from "./api/resources/logs/client/Client";
import { Sessions } from "./api/resources/sessions/client/Client";

export declare namespace HumanloopClient {
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

export class HumanloopClient {
    constructor(protected readonly _options: HumanloopClient.Options) {}

    protected _prompts: Prompts | undefined;

    public get prompts(): Prompts {
        return (this._prompts ??= new Prompts(this._options));
    }

    protected _tools: Tools | undefined;

    public get tools(): Tools {
        return (this._tools ??= new Tools(this._options));
    }

    protected _datasets: Datasets | undefined;

    public get datasets(): Datasets {
        return (this._datasets ??= new Datasets(this._options));
    }

    protected _files: Files | undefined;

    public get files(): Files {
        return (this._files ??= new Files(this._options));
    }

    protected _evaluations: Evaluations | undefined;

    public get evaluations(): Evaluations {
        return (this._evaluations ??= new Evaluations(this._options));
    }

    protected _evaluators: Evaluators | undefined;

    public get evaluators(): Evaluators {
        return (this._evaluators ??= new Evaluators(this._options));
    }

    protected _logs: Logs | undefined;

    public get logs(): Logs {
        return (this._logs ??= new Logs(this._options));
    }

    protected _sessions: Sessions | undefined;

    public get sessions(): Sessions {
        return (this._sessions ??= new Sessions(this._options));
    }
}
