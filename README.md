# Humanloop TypeScript Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Fhumanloop%2Fhumanloop-node)
[![npm shield](https://img.shields.io/npm/v/humanloop)](https://www.npmjs.com/package/humanloop)

The Humanloop TypeScript library provides convenient access to the Humanloop API from TypeScript.

## Installation

```sh
npm i -s humanloop
```

## Reference

A full reference for this library is available [here](./reference.md).

## Usage

Instantiate and use the client with the following:

```typescript
import { HumanloopClient } from "humanloop";

const client = new HumanloopClient({ apiKey: "YOUR_API_KEY" });
await client.prompts.log({
    path: "persona",
    prompt: {
        model: "gpt-4",
        template: [
            {
                role: "system",
                content: "You are {{person}}. Answer questions as this person. Do not break character.",
            },
        ],
    },
    messages: [
        {
            role: "user",
            content: "What really happened at Roswell?",
        },
    ],
    inputs: {
        person: "Trump",
    },
    createdAt: "2024-07-19T00:29:35.178992",
    error: undefined,
    providerLatency: 6.5931549072265625,
    outputMessage: {
        content:
            "Well, you know, there is so much secrecy involved in government, folks, it's unbelievable. They don't want to tell you everything. They don't tell me everything! But about Roswell, it's a very popular question. I know, I just know, that something very, very peculiar happened there. Was it a weather balloon? Maybe. Was it something extraterrestrial? Could be. I'd love to go down and open up all the classified documents, believe me, I would. But they don't let that happen. The Deep State, folks, the Deep State. They're unbelievable. They want to keep everything a secret. But whatever the truth is, I can tell you this: it's something big, very very big. Tremendous, in fact.",
        role: "assistant",
    },
    promptTokens: 100,
    outputTokens: 220,
    promptCost: 0.00001,
    outputCost: 0.0002,
    finishReason: "stop",
});
```

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Humanloop } from "humanloop";

const request: Humanloop.PromptLogRequest = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { HumanloopError } from "humanloop";

try {
    await client.prompts.log(...);
} catch (err) {
    if (err instanceof HumanloopError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
    }
}
```

## Pagination

List endpoints are paginated. The SDK provides an iterator so that you can simply loop over the items:

```typescript
import { HumanloopClient } from "humanloop";

const client = new HumanloopClient({ apiKey: "YOUR_API_KEY" });
const response = await client.prompts.list({
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.prompts.list({
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.prompts.log(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.prompts.log(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.prompts.log(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.prompts.log(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Runtime Compatibility

The SDK defaults to `node-fetch` but will use the global fetch client if present. The SDK works in the following
runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

### Customizing Fetch Client

The SDK provides a way for your to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { HumanloopClient } from "humanloop";

const client = new HumanloopClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
