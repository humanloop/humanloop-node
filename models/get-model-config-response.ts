/*
Humanloop API

The Humanloop API allows you to interact with Humanloop from your product or service.

You can do this through HTTP requests from any language or via our official Python or TypeScript SDK.

To install the official [Python SDK](https://pypi.org/project/humanloop/), run the following command:

```bash
pip install humanloop
```

To install the official [TypeScript SDK](https://www.npmjs.com/package/humanloop), run the following command:

```bash
npm i humanloop
```

---

Guides and further details about key concepts can be found in [our docs](https://docs.humanloop.com/).

The version of the OpenAPI document: 4.0.1


NOTE: This file is auto generated by Konfig (https://konfigthis.com).
*/
import type * as buffer from "buffer"

import { ConfigResponse } from './config-response';
import { ModelConfigEvaluatorAggregateResponse } from './model-config-evaluator-aggregate-response';
import { ProjectModelConfigFeedbackStatsResponse } from './project-model-config-feedback-stats-response';

/**
 * A selected model configuration.  If the model configuration was selected in the context of an experiment, the response will include a trial_id to associate a subsequent log() call.
 * @export
 * @interface GetModelConfigResponse
 */
export interface GetModelConfigResponse {
    /**
     * String ID of project the model config belongs to. Starts with `pr_`.
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'project_id': string;
    /**
     * Name of the project the model config belongs to.
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'project_name': string;
    /**
     * 
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'created_at': string;
    /**
     * 
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'updated_at': string;
    /**
     * 
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'last_used': string;
    /**
     * Feedback statistics for the project model config.
     * @type {Array<ProjectModelConfigFeedbackStatsResponse>}
     * @memberof GetModelConfigResponse
     */
    'feedback_stats'?: Array<ProjectModelConfigFeedbackStatsResponse>;
    /**
     * Number of datapoints associated with this project model config.
     * @type {number}
     * @memberof GetModelConfigResponse
     */
    'num_datapoints'?: number;
    /**
     * The ID of the experiment the model config has been registered to. Only populated when registering a model config to an experiment.
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'experiment_id'?: string;
    /**
     * Aggregates of evaluators for the model config.
     * @type {Array<ModelConfigEvaluatorAggregateResponse>}
     * @memberof GetModelConfigResponse
     */
    'evaluation_aggregates'?: Array<ModelConfigEvaluatorAggregateResponse>;
    /**
     * 
     * @type {ConfigResponse}
     * @memberof GetModelConfigResponse
     */
    'config': ConfigResponse;
    /**
     * ID of trial to reference in subsequent log calls.
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'trial_id'?: string;
    /**
     * ID of environment to reference in subsequent log calls.
     * @type {string}
     * @memberof GetModelConfigResponse
     */
    'environment_id'?: string;
}

