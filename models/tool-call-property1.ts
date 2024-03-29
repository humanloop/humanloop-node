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

import { FunctionTool } from './function-tool';

/**
 * NB: Deprecated in favour of tool_calls. A tool call requested by the assistant.
 * @export
 * @interface ToolCallProperty1
 */
export interface ToolCallProperty1 {
    /**
     * 
     * @type {string}
     * @memberof ToolCallProperty1
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof ToolCallProperty1
     */
    'arguments'?: string;
}

