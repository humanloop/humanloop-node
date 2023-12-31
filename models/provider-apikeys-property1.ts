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

import { ProviderApiKeys } from './provider-api-keys';

/**
 * API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization. Ensure you provide an API key for the provider for the model config you are evaluating, or have one saved to your organization.
 * @export
 * @interface ProviderAPIKeysProperty1
 */
export interface ProviderAPIKeysProperty1 {
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'openai'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'ai21'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'mock'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'anthropic'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'cohere'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'openai_azure'?: string;
    /**
     * 
     * @type {string}
     * @memberof ProviderAPIKeysProperty1
     */
    'openai_azure_endpoint'?: string;
}

