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
                role: Humanloop.ChatRole.System,
                content: "You are {{person}}. Answer questions as this person. Do not break character.",
            },
        ],
    },
    messages: [
        {
            role: Humanloop.ChatRole.User,
            content: "What really happened at Roswell?",
        },
    ],
    inputs: {
        person: "Trump",
    },
    createdAt: new Date("2024-07-19T00:29:35.178Z"),
    providerLatency: 6.5931549072265625,
    outputMessage: {
        content:
            "Well, you know, there is so much secrecy involved in government, folks, it's unbelievable. They don't want to tell you everything. They don't tell me everything! But about Roswell, it\u2019s a very popular question. I know, I just know, that something very, very peculiar happened there. Was it a weather balloon? Maybe. Was it something extraterrestrial? Could be. I'd love to go down and open up all the classified documents, believe me, I would. But they don't let that happen. The Deep State, folks, the Deep State. They\u2019re unbelievable. They want to keep everything a secret. But whatever the truth is, I can tell you this: it\u2019s something big, very very big. Tremendous, in fact.",
        role: Humanloop.ChatRole.Assistant,
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

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">call</a>({ ...params }) -> Humanloop.CallPromptsCallPostResponse</code></summary>
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
                role: Humanloop.ChatRole.System,
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
            role: Humanloop.ChatRole.User,
            content: "latest apple",
        },
    ],
    stream: false,
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

**request:** `Humanloop.PromptCallRequest`

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
await client.prompts.list({
    size: 1,
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

If you provide a commit message, then the new version will be committed;
otherwise it will be uncommitted. If you try to commit an already committed version,
an exception will be raised.

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
    endpoint: Humanloop.ModelEndpoints.Chat,
    template: [
        {
            content: "You are a helpful coding assistant specialising in {{language}}",
            role: Humanloop.ChatRole.System,
        },
    ],
    provider: Humanloop.ModelProviders.Openai,
    maxTokens: -1,
    temperature: 0.7,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    other: {},
    tools: [],
    linkedTools: [],
    commitMessage: "Initial commit",
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
await client.prompts.listVersions("pr_30gco7dx6JDq4200GVOHa", {
    status: Humanloop.VersionStatus.Committed,
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

<details><summary><code>client.prompts.<a href="/src/api/resources/prompts/client/Client.ts">commit</a>(id, versionId, { ...params }) -> Humanloop.PromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Commit a version of the Prompt with a commit message.

If the version is already committed, an exception will be raised.

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
await client.prompts.commit("pr_30gco7dx6JDq4200GVOHa", "prv_F34aba5f3asp0", {
    commitMessage: "Reiterated point about not discussing sentience",
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

**versionId:** `string` — Unique identifier for the specific version of the Prompt.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.CommitRequest`

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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.ToolResponse | undefined></code></summary>
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
await client.tools.list({
    size: 1,
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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">upsert</a>({ ...params }) -> Humanloop.ToolResponse | undefined</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a Tool or update it with a new version if it already exists.

Tools are identified by the `ID` or their `path`. The name, description and parameters determine the versions of the Tool.

If you provide a commit message, then the new version will be committed;
otherwise it will be uncommitted. If you try to commit an already committed version,
an exception will be raised.

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
    commitMessage: "Initial commit",
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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">get</a>(id, { ...params }) -> Humanloop.ToolResponse | undefined</code></summary>
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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">move</a>(id, { ...params }) -> Humanloop.ToolResponse | undefined</code></summary>
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
await client.tools.listVersions("tl_789ghi", {
    status: Humanloop.VersionStatus.Committed,
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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">commit</a>(id, versionId, { ...params }) -> Humanloop.ToolResponse | undefined</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Commit a version of the Tool with a commit message.

If the version is already committed, an exception will be raised.

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
await client.tools.commit("tl_789ghi", "tv_012jkl", {
    commitMessage: "Initial commit",
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

**versionId:** `string` — Unique identifier for the specific version of the Tool.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.CommitRequest`

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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">updateMonitoring</a>(id, { ...params }) -> Humanloop.ToolResponse | undefined</code></summary>
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

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">setDeployment</a>(id, environmentId, { ...params }) -> Humanloop.ToolResponse | undefined</code></summary>
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
await client.datasets.list({
    size: 1,
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
the new version on. If neither is provided, the default deployed version will be used.

If you provide a commit message, then the new version will be committed;
otherwise it will be uncommitted. If you try to commit an already committed version,
an exception will be raised.

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
    action: Humanloop.UpdateDatesetAction.Set,
    commitMessage: "Add two new questions and answers",
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

**request:** `Humanloop.DatasetsRequest`

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

Update the Dataset with the given ID.

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
await client.datasets.listDatapoints("ds_b0baF1ca7652", {
    size: 1,
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
await client.datasets.listVersions("ds_b0baF1ca7652", {
    status: Humanloop.VersionStatus.Committed,
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

<details><summary><code>client.datasets.<a href="/src/api/resources/datasets/client/Client.ts">commit</a>(id, versionId, { ...params }) -> Humanloop.DatasetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Commit a version of the Dataset with a commit message.

If the version is already committed, an exception will be raised.

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
await client.datasets.commit("ds_b0baF1ca7652", "dsv_6L78pqrdFi2xa", {
    commitMessage: "initial commit",
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

**versionId:** `string` — Unique identifier for the specific version of the Dataset.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.CommitRequest`

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

This will create a new committed version of the Dataset with the Datapoints from the CSV file.

If either `version_id` or `environment` is provided, the new version will be based on the specified version,
with the Datapoints from the CSV file added to the existing Datapoints in the version.
If neither `version_id` nor `environment` is provided, the new version will be based on the version
of the Dataset that is deployed to the default Environment.

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
await client.datasets.uploadCsv(fs.createReadStream("/path/to/your/file"), "id", {
    commitMessage: "commit_message",
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

## Evaluations

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.EvaluationResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all Evaluations for the specified `file_id`.

Retrieve a list of Evaluations that evaluate versions of the specified File.

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
await client.evaluations.list({
    fileId: "pr_30gco7dx6JDq4200GVOHa",
    size: 1,
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

Create a new Evaluation by specifying the Dataset, versions to be
evaluated (Evaluatees), and which Evaluators to provide judgments.

Humanloop will automatically start generating Logs and running Evaluators where
`orchestrated=true`. If you own the runtime for the Evaluatee or Evaluator, you
can set `orchestrated=false` and then generate and submit the required logs using
your runtime.

To keep updated on the progress of the Evaluation, you can poll the Evaluation using
the GET /evaluations/{id} endpoint and check its status.

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
    dataset: {
        versionId: "dsv_6L78pqrdFi2xa",
    },
    evaluatees: [
        {
            versionId: "prv_7ZlQREDScH0xkhUwtXruN",
            orchestrated: false,
        },
    ],
    evaluators: [
        {
            versionId: "evv_012def",
            orchestrated: false,
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

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">get</a>(id) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get an Evaluation.

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

Remove an Evaluation from Humanloop. The Logs and Versions used in the Evaluation
will not be deleted.

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

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">updateSetup</a>(id, { ...params }) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an Evaluation.

Update the setup of an Evaluation by specifying the Dataset, versions to be
evaluated (Evaluatees), and which Evaluators to provide judgments.

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
await client.evaluations.updateSetup("ev_567yza", {
    dataset: {
        versionId: "dsv_6L78pqrdFi2xa",
    },
    evaluatees: [
        {
            versionId: "prv_7ZlQREDScH0xkhUwtXruN",
            orchestrated: false,
        },
    ],
    evaluators: [
        {
            versionId: "evv_012def",
            orchestrated: false,
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

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">updateStatus</a>(id, { ...params }) -> Humanloop.EvaluationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the status of an Evaluation.

Can be used to cancel a running Evaluation, or mark an Evaluation that uses
external or human evaluators as completed.

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
await client.evaluations.updateStatus("id", {
    status: Humanloop.EvaluationStatus.Pending,
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

**request:** `Humanloop.BodyUpdateStatusEvaluationsIdStatusPatch`

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

Retrieve aggregate stats for the specified Evaluation.
This includes the number of generated Logs for each evaluated version and the
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

<details><summary><code>client.evaluations.<a href="/src/api/resources/evaluations/client/Client.ts">getLogs</a>(id, { ...params }) -> Humanloop.PaginatedDataEvaluationReportLogResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the Logs associated to a specific Evaluation.

Each Datapoint in your Dataset will have a corresponding Log for each File version evaluated.
e.g. If you have 50 Datapoints and are evaluating 2 Prompts, there will be 100 Logs associated with the Evaluation.

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

## Evaluators

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
await client.evaluators.list({
    size: 1,
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

If you provide a commit message, then the new version will be committed;
otherwise it will be uncommitted. If you try to commit an already committed version,
an exception will be raised.

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
        argumentsType: Humanloop.EvaluatorArgumentsType.TargetRequired,
        returnType: Humanloop.EvaluatorReturnTypeEnum.Number,
        evaluatorType: "python",
        code: "def evaluate(answer, target):\n    return 0.5",
    },
    commitMessage: "Initial commit",
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

**request:** `Humanloop.EvaluatorsRequest`

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

<details><summary><code>client.evaluators.<a href="/src/api/resources/evaluators/client/Client.ts">commit</a>(id, versionId, { ...params }) -> Humanloop.EvaluatorResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Commit a version of the Evaluator with a commit message.

If the version is already committed, an exception will be raised.

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
await client.evaluators.commit("ev_890bcd", "evv_012def", {
    commitMessage: "Initial commit",
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

**versionId:** `string` — Unique identifier for the specific version of the Evaluator.

</dd>
</dl>

<dl>
<dd>

**request:** `Humanloop.CommitRequest`

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
await client.logs.list({
    fileId: "file_123abc",
    size: 1,
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
    id: "string",
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

## Sessions

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">get</a>(id) -> Humanloop.SessionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Session with the given ID.

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
await client.sessions.get("sesh_123abc");
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

**id:** `string` — Unique identifier for Session.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">delete</a>(id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Session with the given ID.

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
await client.sessions.delete("sesh_123abc");
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

**id:** `string` — Unique identifier for Session.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.sessions.<a href="/src/api/resources/sessions/client/Client.ts">list</a>({ ...params }) -> core.Page<Humanloop.SessionResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of Sessions.

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
await client.sessions.list({
    size: 1,
    fileId: "pr_123abc",
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

**request:** `Humanloop.ListSessionsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Sessions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
