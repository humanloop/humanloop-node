# Reference

## Prompts

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">log</a>({ ...params }) -> Humanloop.CreatePromptLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Log to a Prompt.

You can use query parameters `version_id`, or `environment`, to target
an existing version of the Prompt. Otherwise, the default deployed version will be chosen.

Instead of targeting an existing version explicitly, you can instead pass in
Prompt details in the request body. In this case, we will check if the details correspond
to an existing version of the Prompt. If they do not, we will create a new version. This is helpful
in the case where you are storing or deriving your Prompt details in code.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
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

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.PromptLogRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">updateLog</a>(id, logId, { ...params }) -> Humanloop.LogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a Log.

Update the details of a Log with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.updateLog("id", "log_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**logId:** `string` — Unique identifier for the Log.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.PromptLogUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">callStream</a>({ ...params }) -> core.Stream<Humanloop.PromptCallStreamResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Call a Prompt.

Calling a Prompt calls the model provider before logging
the request, responses and metadata to Humanloop.

You can use query parameters `version_id`, or `environment`, to target
an existing version of the Prompt. Otherwise the default deployed version will be chosen.

Instead of targeting an existing version explicitly, you can instead pass in
Prompt details in the request body. In this case, we will check if the details correspond
to an existing version of the Prompt. If they do not, we will create a new version. This is helpful
in the case where you are storing or deriving your Prompt details in code.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.prompts.callStream({});
for await (const item of response) {
    console.log(item);
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.PromptsCallStreamRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">call</a>({ ...params }) -> Humanloop.PromptCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Call a Prompt.

Calling a Prompt calls the model provider before logging
the request, responses and metadata to Humanloop.

You can use query parameters `version_id`, or `environment`, to target
an existing version of the Prompt. Otherwise the default deployed version will be chosen.

Instead of targeting an existing version explicitly, you can instead pass in
Prompt details in the request body. In this case, we will check if the details correspond
to an existing version of the Prompt. If they do not, we will create a new version. This is helpful
in the case where you are storing or deriving your Prompt details in code.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.call({
    path: "persona",
    prompt: {
        model: "gpt-4",
        template: [
            {
                role: "system",
                content: "You are stockbot. Return latest prices.",
            },
        ],
        tools: [
            {
                name: "get_stock_price",
                description: "Get current stock price",
                parameters: {
                    type: "object",
                    properties: {
                        ticker_symbol: {
                            type: "string",
                            name: "Ticker Symbol",
                            description: "Ticker symbol of the stock",
                        },
                    },
                    required: [],
                },
            },
        ],
    },
    messages: [
        {
            role: "user",
            content: "latest apple",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.PromptsCallRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.PromptResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all Prompts.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
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

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListPromptsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">upsert</a>({ ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a Prompt or update it with a new version if it already exists.

Prompts are identified by the `ID` or their `path`. The parameters (i.e. the prompt template, temperature, model etc.) determine the versions of the Prompt.

You can provide `version_name` and `version_description` to identify and describe your versions.
Version names must be unique within a Prompt - attempting to create a version with a name
that already exists will result in a 409 Conflict error.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.upsert({
    path: "Personal Projects/Coding Assistant",
    model: "gpt-4o",
    endpoint: "chat",
    template: [
        {
            content: "You are a helpful coding assistant specialising in {{language}}",
            role: "system",
        },
    ],
    provider: "openai",
    maxTokens: -1,
    temperature: 0.7,
    versionName: "coding-assistant-v1",
    versionDescription: "Initial version",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.PromptRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">get</a>(id, { ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Prompt with the given ID.

By default, the deployed version of the Prompt is returned. Use the query parameters
`version_id` or `environment` to target a specific version of the Prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.get("pr_30gco7dx6JDq4200GVOHa");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.GetPromptsIdGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Prompt with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.delete("pr_30gco7dx6JDq4200GVOHa");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">move</a>(id, { ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move the Prompt to a different path or change the name.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.move("pr_30gco7dx6JDq4200GVOHa", {
    path: "new directory/new name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdatePromptRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">populate</a>(id, { ...params }) -> Humanloop.PopulateTemplateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Prompt with the given ID, including the populated template.

By default, the deployed version of the Prompt is returned. Use the query parameters
`version_id` or `environment` to target a specific version of the Prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.populate("id", {
    body: {
        key: "value",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.PopulatePromptsIdPopulatePostRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">listVersions</a>(id, { ...params }) -> Humanloop.ListPrompts</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all the versions of a Prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.listVersions("pr_30gco7dx6JDq4200GVOHa");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ListVersionsPromptsIdVersionsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">deletePromptVersion</a>(id, versionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a version of the Prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.deletePromptVersion("id", "version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Prompt.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">patchPromptVersion</a>(id, versionId, { ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the name or description of the Prompt version.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.patchPromptVersion("id", "version_id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Prompt.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateVersionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">setDeployment</a>(id, environmentId, { ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deploy Prompt to an Environment.

Set the deployed version for the specified Environment. This Prompt
will be used for calls made to the Prompt in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.setDeployment("id", "environment_id", {
    versionId: "version_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to deploy the Version to.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.SetDeploymentPromptsIdEnvironmentsEnvironmentIdPostRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">removeDeployment</a>(id, environmentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove deployed Prompt from the Environment.

Remove the deployed version for the specified Environment. This Prompt
will no longer be used for calls made to the Prompt in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.removeDeployment("id", "environment_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to remove the deployment from.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">listEnvironments</a>(id) -> Humanloop.FileEnvironmentResponse[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Environments and their deployed versions for the Prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.listEnvironments("pr_30gco7dx6JDq4200GVOHa");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">updateMonitoring</a>(id, { ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Activate and deactivate Evaluators for monitoring the Prompt.

An activated Evaluator will automatically be run on all new Logs
within the Prompt for monitoring purposes.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.prompts.updateMonitoring("pr_30gco7dx6JDq4200GVOHa", {
    activate: [
        {
            evaluatorVersionId: "evv_1abc4308abd",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.EvaluatorActivationDeactivationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Prompts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Tools

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">log</a>({ ...params }) -> Humanloop.CreateToolLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Log to a Tool.

You can use query parameters `version_id`, or `environment`, to target
an existing version of the Tool. Otherwise the default deployed version will be chosen.

Instead of targeting an existing version explicitly, you can instead pass in
Tool details in the request body. In this case, we will check if the details correspond
to an existing version of the Tool, if not we will create a new version. This is helpful
in the case where you are storing or deriving your Tool details in code.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.log({
    path: "math-tool",
    tool: {
        function: {
            name: "multiply",
            description: "Multiply two numbers",
            parameters: {
                type: "object",
                properties: {
                    a: {
                        type: "number",
                    },
                    b: {
                        type: "number",
                    },
                },
                required: ["a", "b"],
            },
        },
    },
    inputs: {
        a: 5,
        b: 7,
    },
    output: "35",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ToolLogRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">update</a>(id, logId, { ...params }) -> Humanloop.LogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a Log.

Update the details of a Log with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.update("id", "log_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Prompt.

</dd>
</dl>

<dl>
<dd>

**logId:** `string` — Unique identifier for the Log.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ToolLogUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.ToolResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all Tools.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.tools.list({
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.tools.list({
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListToolsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">upsert</a>({ ...params }) -> Humanloop.ToolResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a Tool or update it with a new version if it already exists.

Tools are identified by the `ID` or their `path`. The name, description and parameters determine the versions of the Tool.

You can provide `version_name` and `version_description` to identify and describe your versions.
Version names must be unique within a Tool - attempting to create a version with a name
that already exists will result in a 409 Conflict error.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.upsert({
    path: "math-tool",
    function: {
        name: "multiply",
        description: "Multiply two numbers",
        parameters: {
            type: "object",
            properties: {
                a: {
                    type: "number",
                },
                b: {
                    type: "number",
                },
            },
            required: ["a", "b"],
        },
    },
    versionName: "math-tool-v1",
    versionDescription: "Simple math tool that multiplies two numbers",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ToolRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">get</a>(id, { ...params }) -> Humanloop.ToolResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Tool with the given ID.

By default, the deployed version of the Tool is returned. Use the query parameters
`version_id` or `environment` to target a specific version of the Tool.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.get("tl_789ghi");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.GetToolsIdGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Tool with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.delete("tl_789ghi");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">move</a>(id, { ...params }) -> Humanloop.ToolResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move the Tool to a different path or change the name.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.move("tl_789ghi", {
    path: "new directory/new name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateToolRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">listVersions</a>(id, { ...params }) -> Humanloop.ListTools</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all the versions of a Tool.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.listVersions("tl_789ghi");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for the Tool.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ListVersionsToolsIdVersionsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">deleteToolVersion</a>(id, versionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a version of the Tool.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.deleteToolVersion("id", "version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Tool.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">updateToolVersion</a>(id, versionId, { ...params }) -> Humanloop.ToolResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the name or description of the Tool version.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.updateToolVersion("id", "version_id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Tool.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateVersionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">setDeployment</a>(id, environmentId, { ...params }) -> Humanloop.ToolResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deploy Tool to an Environment.

Set the deployed version for the specified Environment. This Prompt
will be used for calls made to the Tool in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.setDeployment("tl_789ghi", "staging", {
    versionId: "tv_012jkl",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to deploy the Version to.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.SetDeploymentToolsIdEnvironmentsEnvironmentIdPostRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">removeDeployment</a>(id, environmentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove deployed Tool from the Environment.

Remove the deployed version for the specified Environment. This Tool
will no longer be used for calls made to the Tool in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.removeDeployment("tl_789ghi", "staging");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to remove the deployment from.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">listEnvironments</a>(id) -> Humanloop.FileEnvironmentResponse[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Environments and their deployed versions for the Tool.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.listEnvironments("tl_789ghi");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Tool.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">updateMonitoring</a>(id, { ...params }) -> Humanloop.ToolResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Activate and deactivate Evaluators for monitoring the Tool.

An activated Evaluator will automatically be run on all new Logs
within the Tool for monitoring purposes.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.updateMonitoring("tl_789ghi", {
    activate: [
        {
            evaluatorVersionId: "evv_1abc4308abd",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.EvaluatorActivationDeactivationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Datasets

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.DatasetResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Datasets.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.datasets.list({
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.datasets.list({
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListDatasetsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">upsert</a>({ ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a Dataset or update it with a new version if it already exists.

Datasets are identified by the `ID` or their `path`. The datapoints determine the versions of the Dataset.

By default, the new Dataset version will be set to the list of Datapoints provided in
the request. You can also create a new version by adding or removing Datapoints from an existing version
by specifying `action` as `add` or `remove` respectively. In this case, you may specify
the `version_id` or `environment` query parameters to identify the existing version to base
the new version on. If neither is provided, the latest created version will be used.

You can provide `version_name` and `version_description` to identify and describe your versions.
Version names must be unique within a Dataset - attempting to create a version with a name
that already exists will result in a 409 Conflict error.

Humanloop also deduplicates Datapoints. If you try to add a Datapoint that already
exists, it will be ignored. If you intentionally want to add a duplicate Datapoint,
you can add a unique identifier to the Datapoint's inputs such as `{_dedupe_id: <unique ID>}`.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.upsert({
    path: "test-questions",
    datapoints: [
        {
            inputs: {
                question: "What is the capital of France?",
            },
            target: {
                answer: "Paris",
            },
        },
        {
            inputs: {
                question: "Who wrote Hamlet?",
            },
            target: {
                answer: "William Shakespeare",
            },
        },
    ],
    action: "set",
    versionName: "test-questions-v1",
    versionDescription: "Add two new questions and answers",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.DatasetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">get</a>(id, { ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Dataset with the given ID.

Unless `include_datapoints` is set to `true`, the response will not include
the Datapoints.
Use the List Datapoints endpoint (`GET /{id}/datapoints`) to efficiently
retrieve Datapoints for a large Dataset.

By default, the deployed version of the Dataset is returned. Use the query parameters
`version_id` or `environment` to target a specific version of the Dataset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.get("ds_b0baF1ca7652", {
    versionId: "dsv_6L78pqrdFi2xa",
    includeDatapoints: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.GetDatasetsIdGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Dataset with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.delete("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">move</a>(id, { ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move the Dataset to a different path or change the name.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.move("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateDatasetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">listDatapoints</a>(id, { ...params }) -> core.Page<Humanloop.DatapointResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Datapoints for the Dataset with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.datasets.listDatapoints("ds_b0baF1ca7652", {
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.datasets.listDatapoints("ds_b0baF1ca7652", {
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ListDatapointsDatasetsIdDatapointsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">listVersions</a>(id, { ...params }) -> Humanloop.ListDatasets</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of the versions for a Dataset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.listVersions("ds_b0baF1ca7652");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ListVersionsDatasetsIdVersionsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">deleteDatasetVersion</a>(id, versionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a version of the Dataset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.deleteDatasetVersion("id", "version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Dataset.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">updateDatasetVersion</a>(id, versionId, { ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the name or description of the Dataset version.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.updateDatasetVersion("id", "version_id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Dataset.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateVersionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">uploadCsv</a>(file, id, { ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add Datapoints from a CSV file to a Dataset.

This will create a new version of the Dataset with the Datapoints from the CSV file.

If either `version_id` or `environment` is provided, the new version will be based on the specified version,
with the Datapoints from the CSV file added to the existing Datapoints in the version.
If neither `version_id` nor `environment` is provided, the new version will be based on the version
of the Dataset that is deployed to the default Environment.

You can optionally provide a name and description for the new version using `version_name`
and `version_description` parameters.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.uploadCsv(fs.createReadStream("/path/to/your/file"), "id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**file:** `File | fs.ReadStream | Blob`

</dd>
</dl>

<dl>
<dd>

**id:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.BodyUploadCsvDatasetsIdDatapointsCsvPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">setDeployment</a>(id, environmentId, { ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deploy Dataset to Environment.

Set the deployed version for the specified Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.setDeployment("ds_b0baF1ca7652", "staging", {
    versionId: "dsv_6L78pqrdFi2xa",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to deploy the Version to.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.SetDeploymentDatasetsIdEnvironmentsEnvironmentIdPostRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">removeDeployment</a>(id, environmentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove deployed Dataset from Environment.

Remove the deployed version for the specified Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.removeDeployment("ds_b0baF1ca7652", "staging");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to remove the deployment from.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">listEnvironments</a>(id) -> Humanloop.FileEnvironmentResponse[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Environments and their deployed versions for the Dataset.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.datasets.listEnvironments("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Dataset.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Datasets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Evaluators

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">log</a>({ ...params }) -> Humanloop.CreateEvaluatorLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit Evaluator judgment for an existing Log.

Creates a new Log. The evaluated Log will be set as the parent of the created Log.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.log({
    parentId: "parent_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.CreateEvaluatorLogRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.EvaluatorResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all Evaluators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.evaluators.list({
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.evaluators.list({
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListEvaluatorsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">upsert</a>({ ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an Evaluator or update it with a new version if it already exists.

Evaluators are identified by the `ID` or their `path`. The spec provided determines the version of the Evaluator.

You can provide `version_name` and `version_description` to identify and describe your versions.
Version names must be unique within an Evaluator - attempting to create a version with a name
that already exists will result in a 409 Conflict error.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.upsert({
    path: "Shared Evaluators/Accuracy Evaluator",
    spec: {
        argumentsType: "target_required",
        returnType: "number",
        evaluatorType: "python",
        code: "def evaluate(answer, target):\n    return 0.5",
    },
    versionName: "simple-evaluator",
    versionDescription: "Simple evaluator that returns 0.5",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.EvaluatorRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">get</a>(id, { ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Evaluator with the given ID.

By default, the deployed version of the Evaluator is returned. Use the query parameters
`version_id` or `environment` to target a specific version of the Evaluator.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.get("ev_890bcd");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.GetEvaluatorsIdGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Evaluator with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.delete("ev_890bcd");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">move</a>(id, { ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move the Evaluator to a different path or change the name.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.move("ev_890bcd", {
    path: "new directory/new name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateEvaluatorRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">listVersions</a>(id, { ...params }) -> Humanloop.ListEvaluators</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all the versions of an Evaluator.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.listVersions("ev_890bcd");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for the Evaluator.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ListVersionsEvaluatorsIdVersionsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">deleteEvaluatorVersion</a>(id, versionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a version of the Evaluator.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.deleteEvaluatorVersion("id", "version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Evaluator.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">updateEvaluatorVersion</a>(id, versionId, { ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the name or description of the Evaluator version.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.updateEvaluatorVersion("id", "version_id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Evaluator.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateVersionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">setDeployment</a>(id, environmentId, { ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deploy Evaluator to an Environment.

Set the deployed version for the specified Environment. This Evaluator
will be used for calls made to the Evaluator in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.setDeployment("ev_890bcd", "staging", {
    versionId: "evv_012def",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to deploy the Version to.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.SetDeploymentEvaluatorsIdEnvironmentsEnvironmentIdPostRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">removeDeployment</a>(id, environmentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove deployed Evaluator from the Environment.

Remove the deployed version for the specified Environment. This Evaluator
will no longer be used for calls made to the Evaluator in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.removeDeployment("ev_890bcd", "staging");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to remove the deployment from.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">listEnvironments</a>(id) -> Humanloop.FileEnvironmentResponse[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Environments and their deployed versions for the Evaluator.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.listEnvironments("ev_890bcd");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluator.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">updateMonitoring</a>(id, { ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Activate and deactivate Evaluators for monitoring the Evaluator.

An activated Evaluator will automatically be run on all new Logs
within the Evaluator for monitoring purposes.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluators.updateMonitoring("id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.EvaluatorActivationDeactivationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluators.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Flows

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">log</a>({ ...params }) -> Humanloop.CreateFlowLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Log to a Flow.

You can use query parameters `version_id`, or `environment`, to target
an existing version of the Flow. Otherwise, the default deployed version will be chosen.

If you create the Flow Log with a `log_status` of `incomplete`, you should later update it to `complete`
in order to trigger Evaluators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.log({
    id: "fl_6o701g4jmcanPVHxdqD0O",
    flow: {
        attributes: {
            prompt: {
                template: "You are a helpful assistant helping with medical anamnesis",
                model: "gpt-4o",
                temperature: 0.8,
            },
            tool: {
                name: "retrieval_tool_v3",
                description: "Retrieval tool for MedQA.",
                source_code: "def retrieval_tool(question: str) -> str:\n    pass\n",
            },
        },
    },
    inputs: {
        question:
            "Patient with a history of diabetes and hypertension presents with chest pain and shortness of breath.",
    },
    output: "The patient is likely experiencing a myocardial infarction. Immediate medical attention is required.",
    logStatus: "incomplete",
    startTime: "2024-07-08T22:40:35",
    endTime: "2024-07-08T22:40:39",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.FlowLogRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">updateLog</a>(logId, { ...params }) -> Humanloop.FlowLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the status, inputs, output of a Flow Log.

Marking a Flow Log as complete will trigger any monitoring Evaluators to run.
Inputs and output (or error) must be provided in order to mark it as complete.

The end_time log attribute will be set to match the time the log is marked as complete.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.updateLog("medqa_experiment_0001", {
    inputs: {
        question:
            "Patient with a history of diabetes and normal tension presents with chest pain and shortness of breath.",
    },
    output: "The patient is likely experiencing a myocardial infarction. Immediate medical attention is required.",
    logStatus: "complete",
    error: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**logId:** `string` — Unique identifier of the Flow Log.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateFlowLogRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">get</a>(id, { ...params }) -> Humanloop.FlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Flow with the given ID.

By default, the deployed version of the Flow is returned. Use the query parameters
`version_id` or `environment` to target a specific version of the Flow.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.get("fl_6o701g4jmcanPVHxdqD0O");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.GetFlowsIdGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Flow with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.delete("fl_6o701g4jmcanPVHxdqD0O");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">move</a>(id, { ...params }) -> Humanloop.FlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Move the Flow to a different path or change the name.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.move("fl_6o701g4jmcanPVHxdqD0O", {
    path: "new directory/new name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateFlowRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.FlowResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of Flows.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.flows.list({
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.flows.list({
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListFlowsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">upsert</a>({ ...params }) -> Humanloop.FlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create or update a Flow.

Flows can also be identified by the `ID` or their `path`.

You can provide `version_name` and `version_description` to identify and describe your versions.
Version names must be unique within a Flow - attempting to create a version with a name
that already exists will result in a 409 Conflict error.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.upsert({
    path: "Personal Projects/MedQA Flow",
    attributes: {
        prompt: {
            template: "You are a helpful medical assistant helping with medical anamnesis. Answer {{question}}",
            model: "gpt-4o",
            temperature: 0.8,
        },
        tool: {
            name: "retrieval_tool_v3",
            description: "Retrieval tool for MedQA.",
            source_code: "def retrieval_tool(question: str) -> str:\n    pass\n",
        },
        version_name: "medqa-flow-v1",
        version_description: "Initial version",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.FlowRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">listVersions</a>(id, { ...params }) -> Humanloop.ListFlows</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of all the versions of a Flow.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.listVersions("fl_6o701g4jmcanPVHxdqD0O");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.ListVersionsFlowsIdVersionsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">deleteFlowVersion</a>(id, versionId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a version of the Flow.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.deleteFlowVersion("id", "version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Flow.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">updateFlowVersion</a>(id, versionId, { ...params }) -> Humanloop.FlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the name or description of the Flow version.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.updateFlowVersion("id", "version_id", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — Unique identifier for the specific version of the Flow.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateVersionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">setDeployment</a>(id, environmentId, { ...params }) -> Humanloop.FlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deploy Flow to an Environment.

Set the deployed version for the specified Environment. This Flow
will be used for calls made to the Flow in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.setDeployment("fl_6o701g4jmcanPVHxdqD0O", "staging", {
    versionId: "flv_6o701g4jmcanPVHxdqD0O",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to deploy the Version to.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.SetDeploymentFlowsIdEnvironmentsEnvironmentIdPostRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">removeDeployment</a>(id, environmentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove deployed Flow from the Environment.

Remove the deployed version for the specified Environment. This Flow
will no longer be used for calls made to the Flow in this Environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.removeDeployment("fl_6o701g4jmcanPVHxdqD0O", "staging");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**environmentId:** `string` — Unique identifier for the Environment to remove the deployment from.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">listEnvironments</a>(id) -> Humanloop.FileEnvironmentResponse[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Environments and their deployed versions for the Flow.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.listEnvironments("fl_6o701g4jmcanPVHxdqD0O");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Flow.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.flows.<a href="/src/api/resources/flows/client/Client.ts">updateMonitoring</a>(id, { ...params }) -> Humanloop.FlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Activate and deactivate Evaluators for monitoring the Flow.

An activated Evaluator will automatically be run on all new "completed" Logs
within the Flow for monitoring purposes.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.flows.updateMonitoring("fl_6o701g4jmcanPVHxdqD0O", {
    activate: [
        {
            evaluatorVersionId: "evv_1abc4308abd",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.EvaluatorActivationDeactivationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Flows.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Directories

<details><summary><code>client.directories.<a href="/src/api/resources/directories/client/Client.ts">list</a>() -> Humanloop.DirectoryResponse[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all Directories.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.directories.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Directories.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.directories.<a href="/src/api/resources/directories/client/Client.ts">create</a>({ ...params }) -> Humanloop.DirectoryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a Directory.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.directories.create();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.CreateDirectoryRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Directories.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.directories.<a href="/src/api/resources/directories/client/Client.ts">get</a>(id) -> Humanloop.DirectoryWithParentsAndChildrenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fetches a directory by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.directories.get("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — String ID of directory. Starts with `dir_`.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Directories.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.directories.<a href="/src/api/resources/directories/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Directory with the given ID.

The Directory must be empty (i.e. contain no Directories or Files).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.directories.delete("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Directory. Starts with `dir_`.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Directories.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.directories.<a href="/src/api/resources/directories/client/Client.ts">update</a>(id, { ...params }) -> Humanloop.DirectoryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the Directory with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.directories.update("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Directory. Starts with `dir_`.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateDirectoryRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Directories.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Files

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">listFiles</a>({ ...params }) -> Humanloop.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseFlowResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a paginated list of files.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.listFiles();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListFilesFilesGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.files.<a href="/src/api/resources/files/client/Client.ts">retrieveByPath</a>({ ...params }) -> Humanloop.RetrieveByPathFilesRetrieveByPathPostResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a File by path.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.files.retrieveByPath({
    path: "path",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.BodyRetrieveByPathFilesRetrieveByPathPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Files.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Evaluations

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.EvaluationResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of Evaluations for the specified File.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.evaluations.list({
    fileId: "pr_30gco7dx6JDq4200GVOHa",
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.evaluations.list({
    fileId: "pr_30gco7dx6JDq4200GVOHa",
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListEvaluationsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">create</a>({ ...params }) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an Evaluation.

Create a new Evaluation by specifying the File to evaluate, and a name
for the Evaluation.
You can then add Runs to this Evaluation using the `POST /evaluations/{id}/runs` endpoint.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.create({
    evaluators: [
        {
            versionId: "version_id",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.CreateEvaluationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">addEvaluators</a>(id, { ...params }) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add Evaluators to an Evaluation.

The Evaluators will be run on the Logs generated for the Evaluation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.addEvaluators("id", {
    evaluators: [
        {
            versionId: "version_id",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.AddEvaluatorsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">removeEvaluator</a>(id, evaluatorVersionId) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove an Evaluator from an Evaluation.

The Evaluator will no longer be run on the Logs in the Evaluation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.removeEvaluator("id", "evaluator_version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**evaluatorVersionId:** `string` — Unique identifier for Evaluator Version.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">get</a>(id) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get an Evaluation.

This includes the Evaluators associated with the Evaluation and metadata about the Evaluation,
such as its name.

To get the Runs associated with the Evaluation, use the `GET /evaluations/{id}/runs` endpoint.
To retrieve stats for the Evaluation, use the `GET /evaluations/{id}/stats` endpoint.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.get("ev_567yza");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an Evaluation.

The Runs and Evaluators in the Evaluation will not be deleted.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.delete("ev_567yza");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">listRunsForEvaluation</a>(id) -> Humanloop.EvaluationRunsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Runs for an Evaluation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.listRunsForEvaluation("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">createRun</a>(id, { ...params }) -> Humanloop.EvaluationRunResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an Evaluation Run.

Optionally specify the Dataset and version to be evaluated.

Humanloop will automatically start generating Logs and running Evaluators where
`orchestrated=true`. If you are generating Logs yourself, you can set `orchestrated=false`
and then generate and submit the required Logs via the API.

If `dataset` and `version` are provided, you can set `use_existing_logs=True` to reuse existing Logs,
avoiding generating new Logs unnecessarily. Logs that are associated with the specified Version and have `source_datapoint_id`
referencing a datapoint in the specified Dataset will be associated with the Run.

To keep updated on the progress of the Run, you can poll the Run using
the `GET /evaluations/{id}/runs` endpoint and check its status.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.createRun("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.CreateRunRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">addExistingRun</a>(id, runId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add an existing Run to the specified Evaluation.

This is useful if you want to compare the Runs in this Evaluation with an existing Run
that exists within another Evaluation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.addExistingRun("id", "run_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**runId:** `string` — Unique identifier for Run.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">removeRun</a>(id, runId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a Run from an Evaluation.

The Logs and Versions used in the Run will not be deleted.
If this Run is used in any other Evaluations, it will still be available in those Evaluations.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.removeRun("id", "run_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**runId:** `string` — Unique identifier for Run.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">updateEvaluationRun</a>(id, runId, { ...params }) -> Humanloop.EvaluationRunResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an Evaluation Run.

Specify `control=true` to use this Run as the control Run for the Evaluation.
You can cancel a running/pending Run, or mark a Run that uses external or human Evaluators as completed.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.updateEvaluationRun("id", "run_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**runId:** `string` — Unique identifier for Run.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.UpdateEvaluationRunRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">addLogsToRun</a>(id, runId, { ...params }) -> Humanloop.EvaluationRunResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add the specified Logs to a Run.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.addLogsToRun("id", "run_id", {
    logIds: ["log_ids"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**runId:** `string` — Unique identifier for Run.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.AddLogsToRunRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">getStats</a>(id) -> Humanloop.EvaluationStats</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get Evaluation Stats.

Retrieve aggregate stats for the specified Evaluation. This includes the number of generated Logs for each Run and the
corresponding Evaluator statistics (such as the mean and percentiles).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.getStats("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Evaluation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">getLogs</a>(id, { ...params }) -> Humanloop.PaginatedDataEvaluationLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the Logs associated to a specific Evaluation.

This returns the Logs associated to all Runs within with the Evaluation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.evaluations.getLogs("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — String ID of evaluation. Starts with `ev_` or `evr_`.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.GetLogsEvaluationsIdLogsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Evaluations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Logs

<details><summary><code>client.logs.<a href="/src/api/resources/logs/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.LogResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Logs for the given filter criteria.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.logs.list({
    fileId: "file_123abc",
    size: 1,
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
const page = await client.logs.list({
    fileId: "file_123abc",
    size: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.ListLogsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Logs.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.logs.<a href="/src/api/resources/logs/client/Client.ts">delete</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete Logs with the given IDs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.logs.delete({
    id: "prv_Wu6zx1lAWJRqOyL8nWuZk",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Humanloop.LogsDeleteRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Logs.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.logs.<a href="/src/api/resources/logs/client/Client.ts">get</a>(id) -> Humanloop.LogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Log with the given ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.logs.get("prv_Wu6zx1lAWJRqOyL8nWuZk");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique identifier for Log.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Logs.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
