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

import { FinetuneConfig } from './finetune-config';
import { ModelProviders } from './model-providers';

/**
 * Configuration and hyper-parameters for the fine-tuning process
 * @export
 * @interface FinetuningConfigProperty
 */
export interface FinetuningConfigProperty {
    /**
     * Provider specific hyper-parameter settings that along with your base model will configure the fine-tuning process with the provider.
     * @type {object}
     * @memberof FinetuningConfigProperty
     */
    'parameters'?: object;
    /**
     * The company who is hosting the target model.This is used only if an existing experiment_id or model_config_id are not provided.
     * @type {ModelProviders}
     * @memberof FinetuningConfigProperty
     */
    'provider'?: ModelProviders;
    /**
     * Unique reference to the model the fine-tuning was based on.
     * @type {string}
     * @memberof FinetuningConfigProperty
     */
    'base_model': string;
}

