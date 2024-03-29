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


/**
 * @type ToolCallProperty
 * NB: Deprecated with new tool_choice. Controls how the model uses tools. The following options are supported: \'none\' forces the model to not call a tool; the default when no tools are provided as part of the model config. \'auto\' the model can decide to call one of the provided tools; the default when tools are provided as part of the model config. Providing {\'name\': <TOOL_NAME>} forces the model to use the provided tool of the same name.
 * @export
 */
export type ToolCallProperty = string | any;


