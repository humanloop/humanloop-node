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

import { EvaluatorArgumentsType } from './evaluator-arguments-type';
import { EvaluatorReturnTypeEnum } from './evaluator-return-type-enum';
import { EvaluatorType } from './evaluator-type';
import { ModelConfigResponse } from './model-config-response';
import { ProjectResponse } from './project-response';

/**
 * 
 * @export
 * @interface EvaluatorResponse
 */
export interface EvaluatorResponse {
    /**
     * The description of the evaluator.
     * @type {string}
     * @memberof EvaluatorResponse
     */
    'description': string;
    /**
     * The name of the evaluator.
     * @type {string}
     * @memberof EvaluatorResponse
     */
    'name': string;
    /**
     * Whether this evaluator is target-free or target-required.
     * @type {EvaluatorArgumentsType}
     * @memberof EvaluatorResponse
     */
    'arguments_type': EvaluatorArgumentsType;
    /**
     * The type of the return value of the evaluator.
     * @type {EvaluatorReturnTypeEnum}
     * @memberof EvaluatorResponse
     */
    'return_type': EvaluatorReturnTypeEnum;
    /**
     * The code for the evaluator. This code will be executed in a sandboxed environment.
     * @type {string}
     * @memberof EvaluatorResponse
     */
    'code'?: string;
    /**
     * The model config defining the LLM evaluator.
     * @type {ModelConfigResponse}
     * @memberof EvaluatorResponse
     */
    'model_config'?: ModelConfigResponse;
    /**
     * The type of the evaluator.
     * @type {EvaluatorType}
     * @memberof EvaluatorResponse
     */
    'type': EvaluatorType;
    /**
     * Unique ID for the evaluator. Starts with `evfn_`.
     * @type {string}
     * @memberof EvaluatorResponse
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof EvaluatorResponse
     */
    'created_at': string;
    /**
     * 
     * @type {string}
     * @memberof EvaluatorResponse
     */
    'updated_at': string;
    /**
     * The project where the evaluator logs are stored.
     * @type {ProjectResponse}
     * @memberof EvaluatorResponse
     */
    'logging_project'?: ProjectResponse;
}

