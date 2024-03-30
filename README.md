<div align="center">

[![Visit Humanloop](./header.png)](https://humanloop.com)

# [Humanloop](https://humanloop.com)<a id="humanloop"></a>

[![npm](https://img.shields.io/badge/npm-v0.6.15-blue)](https://www.npmjs.com/package/humanloop/v/0.6.15)

</div>

## Table of Contents<a id="table-of-contents"></a>

<!-- toc -->

- [Installation](#installation)
- [Streaming Support](#streaming-support)
- [Getting Started](#getting-started)
- [Reference](#reference)
  * [`humanloop.chat`](#humanloopchat)
  * [`humanloop.chatDeployed`](#humanloopchatdeployed)
  * [`humanloop.chatExperiment`](#humanloopchatexperiment)
  * [`humanloop.chatModelConfiguration`](#humanloopchatmodelconfiguration)
  * [`humanloop.complete`](#humanloopcomplete)
  * [`humanloop.completeDeployed`](#humanloopcompletedeployed)
  * [`humanloop.completeExperiment`](#humanloopcompleteexperiment)
  * [`humanloop.completeModelConfiguration`](#humanloopcompletemodelconfiguration)
  * [`humanloop.datapoints.delete`](#humanloopdatapointsdelete)
  * [`humanloop.datapoints.get`](#humanloopdatapointsget)
  * [`humanloop.datapoints.update`](#humanloopdatapointsupdate)
  * [`humanloop.datasets.create`](#humanloopdatasetscreate)
  * [`humanloop.datasets.createDatapoint`](#humanloopdatasetscreatedatapoint)
  * [`humanloop.datasets.delete`](#humanloopdatasetsdelete)
  * [`humanloop.datasets.get`](#humanloopdatasetsget)
  * [`humanloop.datasets.listAllForProject`](#humanloopdatasetslistallforproject)
  * [`humanloop.datasets.listDatapoints`](#humanloopdatasetslistdatapoints)
  * [`humanloop.datasets.update`](#humanloopdatasetsupdate)
  * [`humanloop.evaluations.addEvaluators`](#humanloopevaluationsaddevaluators)
  * [`humanloop.evaluations.create`](#humanloopevaluationscreate)
  * [`humanloop.evaluations.get`](#humanloopevaluationsget)
  * [`humanloop.evaluations.list`](#humanloopevaluationslist)
  * [`humanloop.evaluations.listAllForProject`](#humanloopevaluationslistallforproject)
  * [`humanloop.evaluations.listDatapoints`](#humanloopevaluationslistdatapoints)
  * [`humanloop.evaluations.log`](#humanloopevaluationslog)
  * [`humanloop.evaluations.result`](#humanloopevaluationsresult)
  * [`humanloop.evaluations.updateStatus`](#humanloopevaluationsupdatestatus)
  * [`humanloop.evaluators.create`](#humanloopevaluatorscreate)
  * [`humanloop.evaluators.delete`](#humanloopevaluatorsdelete)
  * [`humanloop.evaluators.get`](#humanloopevaluatorsget)
  * [`humanloop.evaluators.list`](#humanloopevaluatorslist)
  * [`humanloop.evaluators.update`](#humanloopevaluatorsupdate)
  * [`humanloop.experiments.create`](#humanloopexperimentscreate)
  * [`humanloop.experiments.delete`](#humanloopexperimentsdelete)
  * [`humanloop.experiments.list`](#humanloopexperimentslist)
  * [`humanloop.experiments.sample`](#humanloopexperimentssample)
  * [`humanloop.experiments.update`](#humanloopexperimentsupdate)
  * [`humanloop.feedback`](#humanloopfeedback)
  * [`humanloop.finetunes.create`](#humanloopfinetunescreate)
  * [`humanloop.finetunes.listAllForProject`](#humanloopfinetuneslistallforproject)
  * [`humanloop.finetunes.summary`](#humanloopfinetunessummary)
  * [`humanloop.finetunes.update`](#humanloopfinetunesupdate)
  * [`humanloop.logs.delete`](#humanlooplogsdelete)
  * [`humanloop.logs.get`](#humanlooplogsget)
  * [`humanloop.logs.list`](#humanlooplogslist)
  * [`humanloop.log`](#humanlooplog)
  * [`humanloop.logs.update`](#humanlooplogsupdate)
  * [`humanloop.logs.updateByRef`](#humanlooplogsupdatebyref)
  * [`humanloop.modelConfigs.deserialize`](#humanloopmodelconfigsdeserialize)
  * [`humanloop.modelConfigs.export`](#humanloopmodelconfigsexport)
  * [`humanloop.modelConfigs.get`](#humanloopmodelconfigsget)
  * [`humanloop.modelConfigs.register`](#humanloopmodelconfigsregister)
  * [`humanloop.modelConfigs.serialize`](#humanloopmodelconfigsserialize)
  * [`humanloop.projects.create`](#humanloopprojectscreate)
  * [`humanloop.projects.createFeedbackType`](#humanloopprojectscreatefeedbacktype)
  * [`humanloop.projects.deactivateConfig`](#humanloopprojectsdeactivateconfig)
  * [`humanloop.projects.deactivateExperiment`](#humanloopprojectsdeactivateexperiment)
  * [`humanloop.projects.delete`](#humanloopprojectsdelete)
  * [`humanloop.projects.deleteDeployedConfig`](#humanloopprojectsdeletedeployedconfig)
  * [`humanloop.projects.deployConfig`](#humanloopprojectsdeployconfig)
  * [`humanloop.projects.export`](#humanloopprojectsexport)
  * [`humanloop.projects.get`](#humanloopprojectsget)
  * [`humanloop.projects.getActiveConfig`](#humanloopprojectsgetactiveconfig)
  * [`humanloop.projects.list`](#humanloopprojectslist)
  * [`humanloop.projects.listConfigs`](#humanloopprojectslistconfigs)
  * [`humanloop.projects.listDeployedConfigs`](#humanloopprojectslistdeployedconfigs)
  * [`humanloop.projects.update`](#humanloopprojectsupdate)
  * [`humanloop.projects.updateFeedbackTypes`](#humanloopprojectsupdatefeedbacktypes)
  * [`humanloop.sessions.create`](#humanloopsessionscreate)
  * [`humanloop.sessions.get`](#humanloopsessionsget)
  * [`humanloop.sessions.list`](#humanloopsessionslist)

<!-- tocstop -->

## Installation<a id="installation"></a>

<table>
<tr>
<th width="292px"><code>npm</code></th>
<th width="293px"><code>pnpm</code></th>
<th width="292px"><code>yarn</code></th>
</tr>
<tr>
<td>

```bash
npm i humanloop
```

</td>
<td>

```bash
pnpm i humanloop
```

</td>
<td>

```bash
yarn add humanloop
```

</td>
</tr>
</table>

## Streaming Support<a id="streaming-support"></a>

This SDK supports streaming, see example usage in a NextJS application [here](https://github.com/konfig-dev/humanloop-streaming-example/blob/main/pages/api/edge-streaming.ts#L16)

## Getting Started<a id="getting-started"></a>

```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  openaiApiKey: "openaiApiKey",
  anthropicApiKey: "anthropicApiKey",
  apiKey: "API_KEY",
});

const chatResponse = await humanloop.chat({
  project: "sdk-example",
  messages: [
    {
      role: "user",
      content: "Explain asynchronous programming.",
    },
  ],
  model_config: {
    model: "gpt-3.5-turbo",
    max_tokens: -1,
    temperature: 0.7,
    chat_template: [
      {
        role: "system",
        content:
          "You are a helpful assistant who replies in the style of {{persona}}.",
      },
    ],
  },
  inputs: {
    persona: "the pirate Blackbeard",
  },
  stream: false,
});

console.log(chatResponse);

const completeResponse = await humanloop.complete({
  project: "sdk-example",
  inputs: {
    text: "Llamas that are well-socialized and trained to halter and lead after weaning and are very friendly and pleasant to be around. They are extremely curious and most will approach people easily. However, llamas that are bottle-fed or over-socialized and over-handled as youth will become extremely difficult to handle when mature, when they will begin to treat humans as they treat each other, which is characterized by bouts of spitting, kicking and neck wrestling.[33]",
  },
  model_config: {
    model: "gpt-3.5-turbo",
    max_tokens: -1,
    temperature: 0.7,
    prompt_template:
      "Summarize this for a second-grade student:\n\nText:\n{{text}}\n\nSummary:\n",
  },
  stream: false,
});

console.log(completeResponse);

const feedbackResponse = await humanloop.feedback({
  type: "rating",
  value: "good",
  data_id: "data_[...]",
  user: "user@example.com",
});

console.log(feedbackResponse);

const logResponse = await humanloop.log({
  project: "sdk-example",
  inputs: {
    text: "Llamas that are well-socialized and trained to halter and lead after weaning and are very friendly and pleasant to be around. They are extremely curious and most will approach people easily. However, llamas that are bottle-fed or over-socialized and over-handled as youth will become extremely difficult to handle when mature, when they will begin to treat humans as they treat each other, which is characterized by bouts of spitting, kicking and neck wrestling.[33]",
  },
  output:
    "Llamas can be friendly and curious if they are trained to be around people, but if they are treated too much like pets when they are young, they can become difficult to handle when they grow up. This means they might spit, kick, and wrestle with their necks.",
  source: "sdk",
  config: {
    model: "gpt-3.5-turbo",
    max_tokens: -1,
    temperature: 0.7,
    prompt_template:
      "Summarize this for a second-grade student:\n\nText:\n{{text}}\n\nSummary:\n",
    type: "model",
  },
});

console.log(logResponse);
```

## Reference<a id="reference"></a>


### `humanloop.chat`<a id="humanloopchat"></a>

Get a chat response by providing details of the model configuration in the request.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.chat({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  messages: [
    {
      role: "user",
    },
  ],
  model_config: {
    provider: "openai",
    model: "model_example",
    max_tokens: -1,
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    endpoint: "complete",
  },
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### messages: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="messages-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

The messages passed to the to provider chat endpoint.

##### model_config: [`ModelConfigChatRequest`](./models/model-config-chat-request.ts)<a id="model_config-modelconfigchatrequestmodelsmodel-config-chat-requestts"></a>

The model configuration used to create a chat response.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of generations.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### tool_choice: [`ToolChoiceProperty`](./models/tool-choice-property.ts)<a id="tool_choice-toolchoicepropertymodelstool-choice-propertyts"></a>

##### tool_call: [`ToolCallProperty`](./models/tool-call-property.ts)<a id="tool_call-toolcallpropertymodelstool-call-propertyts"></a>

##### response_format: [`ResponseFormat`](./models/response-format.ts)<a id="response_format-responseformatmodelsresponse-formatts"></a>

The format of the response. Only type json_object is currently supported for chat.

#### 🔄 Return<a id="🔄-return"></a>

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/chat` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.chatDeployed`<a id="humanloopchatdeployed"></a>

Get a chat response using the project's active deployment.

The active deployment can be a specific model configuration or an experiment.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createDeployedResponse = await humanloop.chatDeployed({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  messages: [
    {
      role: "user",
    },
  ],
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### messages: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="messages-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

The messages passed to the to provider chat endpoint.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of generations.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### tool_choice: [`ToolChoiceProperty`](./models/tool-choice-property.ts)<a id="tool_choice-toolchoicepropertymodelstool-choice-propertyts"></a>

##### tool_call: [`ToolCallProperty`](./models/tool-call-property.ts)<a id="tool_call-toolcallpropertymodelstool-call-propertyts"></a>

##### response_format: [`ResponseFormat`](./models/response-format.ts)<a id="response_format-responseformatmodelsresponse-formatts"></a>

The format of the response. Only type json_object is currently supported for chat.

##### environment: `string`<a id="environment-string"></a>

The environment name used to create a chat response. If not specified, the default environment will be used.

#### 🔄 Return<a id="🔄-return"></a>

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/chat-deployed` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.chatExperiment`<a id="humanloopchatexperiment"></a>

Get a chat response for a specific experiment.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createExperimentResponse = await humanloop.chatExperiment({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  messages: [
    {
      role: "user",
    },
  ],
  experiment_id: "experiment_id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### messages: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="messages-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

The messages passed to the to provider chat endpoint.

##### experiment_id: `string`<a id="experiment_id-string"></a>

If an experiment ID is provided a model configuration will be sampled from the experiments active model configurations.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of chat responses, where each chat response will use a model configuration sampled from the experiment.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### tool_choice: [`ToolChoiceProperty`](./models/tool-choice-property.ts)<a id="tool_choice-toolchoicepropertymodelstool-choice-propertyts"></a>

##### tool_call: [`ToolCallProperty`](./models/tool-call-property.ts)<a id="tool_call-toolcallpropertymodelstool-call-propertyts"></a>

##### response_format: [`ResponseFormat`](./models/response-format.ts)<a id="response_format-responseformatmodelsresponse-formatts"></a>

The format of the response. Only type json_object is currently supported for chat.

#### 🔄 Return<a id="🔄-return"></a>

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/chat-experiment` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.chatModelConfiguration`<a id="humanloopchatmodelconfiguration"></a>

Get chat response for a specific model configuration.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createModelConfigResponse = await humanloop.chatModelConfiguration({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  messages: [
    {
      role: "user",
    },
  ],
  model_config_id: "model_config_id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### messages: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="messages-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

The messages passed to the to provider chat endpoint.

##### model_config_id: `string`<a id="model_config_id-string"></a>

Identifies the model configuration used to create a chat response.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of generations.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### tool_choice: [`ToolChoiceProperty`](./models/tool-choice-property.ts)<a id="tool_choice-toolchoicepropertymodelstool-choice-propertyts"></a>

##### tool_call: [`ToolCallProperty`](./models/tool-call-property.ts)<a id="tool_call-toolcallpropertymodelstool-call-propertyts"></a>

##### response_format: [`ResponseFormat`](./models/response-format.ts)<a id="response_format-responseformatmodelsresponse-formatts"></a>

The format of the response. Only type json_object is currently supported for chat.

#### 🔄 Return<a id="🔄-return"></a>

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/chat-model-config` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.complete`<a id="humanloopcomplete"></a>

Create a completion by providing details of the model configuration in the request.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.complete({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  model_config: {
    provider: "openai",
    model: "model_example",
    max_tokens: -1,
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    endpoint: "complete",
    prompt_template: "{{question}}",
  },
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### model_config: [`ModelConfigCompletionRequest`](./models/model-config-completion-request.ts)<a id="model_config-modelconfigcompletionrequestmodelsmodel-config-completion-requestts"></a>

The model configuration used to generate.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of generations.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### logprobs: `number`<a id="logprobs-number"></a>

Include the log probabilities of the top n tokens in the provider_response

##### suffix: `string`<a id="suffix-string"></a>

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

#### 🔄 Return<a id="🔄-return"></a>

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/completion` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.completeDeployed`<a id="humanloopcompletedeployed"></a>

Create a completion using the project's active deployment.

The active deployment can be a specific model configuration or an experiment.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createDeployedResponse = await humanloop.completeDeployed({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of generations.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### logprobs: `number`<a id="logprobs-number"></a>

Include the log probabilities of the top n tokens in the provider_response

##### suffix: `string`<a id="suffix-string"></a>

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

##### environment: `string`<a id="environment-string"></a>

The environment name used to create a chat response. If not specified, the default environment will be used.

#### 🔄 Return<a id="🔄-return"></a>

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/completion-deployed` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.completeExperiment`<a id="humanloopcompleteexperiment"></a>

Create a completion for a specific experiment.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createExperimentResponse = await humanloop.completeExperiment({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  experiment_id: "experiment_id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### experiment_id: `string`<a id="experiment_id-string"></a>

If an experiment ID is provided a model configuration will be sampled from the experiments active model configurations.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of chat responses, where each chat response will use a model configuration sampled from the experiment.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### logprobs: `number`<a id="logprobs-number"></a>

Include the log probabilities of the top n tokens in the provider_response

##### suffix: `string`<a id="suffix-string"></a>

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

#### 🔄 Return<a id="🔄-return"></a>

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/completion-experiment` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.completeModelConfiguration`<a id="humanloopcompletemodelconfiguration"></a>

Create a completion for a specific model configuration.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createModelConfigResponse = await humanloop.completeModelConfiguration({
  save: true,
  num_samples: 1,
  stream: false,
  return_inputs: true,
  model_config_id: "model_config_id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### model_config_id: `string`<a id="model_config_id-string"></a>

Identifies the model configuration used to create a chat response.

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

##### num_samples: `number`<a id="num_samples-number"></a>

The number of generations.

##### stream: `boolean`<a id="stream-boolean"></a>

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`<a id="user-string"></a>

End-user ID passed through to provider call.

##### seed: `number`<a id="seed-number"></a>

Deprecated field: the seed is instead set as part of the request.config object.

##### return_inputs: `boolean`<a id="return_inputs-boolean"></a>

Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true.

##### logprobs: `number`<a id="logprobs-number"></a>

Include the log probabilities of the top n tokens in the provider_response

##### suffix: `string`<a id="suffix-string"></a>

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

#### 🔄 Return<a id="🔄-return"></a>

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/completion-model-config` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datapoints.delete`<a id="humanloopdatapointsdelete"></a>

Delete a list of datapoints by their IDs.

WARNING: This endpoint has been decommisioned and no longer works. Please use the v5 datasets API instead.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteResponse = await humanloop.datapoints.delete();
```

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datapoints` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datapoints.get`<a id="humanloopdatapointsget"></a>

Get a datapoint by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.datapoints.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of datapoint.

#### 🔄 Return<a id="🔄-return"></a>

[DatapointResponse](./models/datapoint-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datapoints/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datapoints.update`<a id="humanloopdatapointsupdate"></a>

Edit the input, messages and criteria fields of a datapoint.

WARNING: This endpoint has been decommisioned and no longer works. Please use the v5 datasets API instead.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.datapoints.update({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of datapoint.

#### 🔄 Return<a id="🔄-return"></a>

[DatapointResponse](./models/datapoint-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datapoints/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.create`<a id="humanloopdatasetscreate"></a>

Create a new dataset for a project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.datasets.create({
  projectId: "projectId_example",
  description: "description_example",
  name: "name_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### description: `string`<a id="description-string"></a>

The description of the dataset.

##### name: `string`<a id="name-string"></a>

The name of the dataset.

##### projectId: `string`<a id="projectid-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/datasets` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.createDatapoint`<a id="humanloopdatasetscreatedatapoint"></a>

Create a new datapoint for a dataset.

Here in the v4 API, this has the following behaviour:
* Retrieve the current latest version of the dataset.
* Construct a new version of the dataset with the new testcases added.
* Store that latest version as a committed version with an autogenerated commit
  message and return the new datapoints

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createDatapointResponse = await humanloop.datasets.createDatapoint({
  datasetId: "dataset_id_example",
  requestBody: {
    log_ids: ["log_ids_example"],
  },
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### datasetId: `string`<a id="datasetid-string"></a>

String ID of dataset. Starts with `evts_`.

##### requestBody: [`DatasetsCreateDatapointRequest`](./models/datasets-create-datapoint-request.ts)<a id="requestbody-datasetscreatedatapointrequestmodelsdatasets-create-datapoint-requestts"></a>

#### 🔄 Return<a id="🔄-return"></a>

[DatapointResponse](./models/datapoint-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datasets/{dataset_id}/datapoints` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.delete`<a id="humanloopdatasetsdelete"></a>

Delete a dataset by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteResponse = await humanloop.datasets.delete({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of dataset. Starts with `evts_`.

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datasets/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.get`<a id="humanloopdatasetsget"></a>

Get a single dataset by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.datasets.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of dataset. Starts with `evts_`.

#### 🔄 Return<a id="🔄-return"></a>

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datasets/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.listAllForProject`<a id="humanloopdatasetslistallforproject"></a>

Get all datasets for a project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listAllForProjectResponse = await humanloop.datasets.listAllForProject({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/datasets` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.listDatapoints`<a id="humanloopdatasetslistdatapoints"></a>

Get datapoints for a dataset.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listDatapointsResponse = await humanloop.datasets.listDatapoints({
  datasetId: "datasetId_example",
  page: 0,
  size: 50,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### datasetId: `string`<a id="datasetid-string"></a>

String ID of dataset. Starts with `evts_`.

##### page: `number`<a id="page-number"></a>

##### size: `number`<a id="size-number"></a>

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataDatapointResponse](./models/paginated-data-datapoint-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datasets/{dataset_id}/datapoints` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.update`<a id="humanloopdatasetsupdate"></a>

Update a testset by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.datasets.update({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of testset. Starts with `evts_`.

##### description: `string`<a id="description-string"></a>

The description of the dataset.

##### name: `string`<a id="name-string"></a>

The name of the dataset.

#### 🔄 Return<a id="🔄-return"></a>

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/datasets/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.addEvaluators`<a id="humanloopevaluationsaddevaluators"></a>

Add evaluators to an existing evaluation run.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addEvaluatorsResponse = await humanloop.evaluations.addEvaluators({
  id: "id_example",
  evaluator_ids: ["evaluator_ids_example"],
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### evaluator_ids: `string`[]<a id="evaluator_ids-string"></a>

IDs of evaluators to add to the evaluation run. IDs start with `evfn_`

##### id: `string`<a id="id-string"></a>

String ID of evaluation run. Starts with `ev_`.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations/{id}/evaluators` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.create`<a id="humanloopevaluationscreate"></a>

Create an evaluation.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.evaluations.create({
  projectId: "projectId_example",
  config_id: "config_id_example",
  evaluator_ids: ["evaluator_ids_example"],
  dataset_id: "dataset_id_example",
  max_concurrency: 5,
  hl_generated: true,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### config_id: `string`<a id="config_id-string"></a>

ID of the config to evaluate. Starts with `config_`.

##### evaluator_ids: `string`[]<a id="evaluator_ids-string"></a>

IDs of evaluators to run on the dataset. IDs start with `evfn_`

##### dataset_id: `string`<a id="dataset_id-string"></a>

ID of the dataset to use in this evaluation. Starts with `evts_`.

##### projectId: `string`<a id="projectid-string"></a>

String ID of project. Starts with `pr_`.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization. Ensure you provide an API key for the provider for the model config you are evaluating, or have one saved to your organization.

##### max_concurrency: `number`<a id="max_concurrency-number"></a>

The maximum number of concurrent generations to run. A higher value will result in faster completion of the evaluation but may place higher load on your provider rate-limits. 

##### hl_generated: `boolean`<a id="hl_generated-boolean"></a>

Whether the log generations for this evaluation should be performed by Humanloop. If `False`, the log generations should be submitted by the user via the API.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/evaluations` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.get`<a id="humanloopevaluationsget"></a>

Get evaluation by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.evaluations.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of evaluation run. Starts with `ev_`.

##### evaluatorAggregates: `boolean`<a id="evaluatoraggregates-boolean"></a>

Whether to include evaluator aggregates in the response.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.list`<a id="humanloopevaluationslist"></a>

Get the evaluations associated with a project.

Sorting and filtering are supported through query params for categorical columns
and the `created_at` timestamp.

Sorting is supported for the `dataset`, `config`, `status` and `evaluator-{evaluator_id}` columns.
Specify sorting with the `sort` query param, with values `{column}.{ordering}`.
E.g. ?sort=dataset.asc&sort=status.desc will yield a multi-column sort. First by dataset then by status.

Filtering is supported for the `id`, `dataset`, `config` and `status` columns.

Specify filtering with the `id_filter`, `dataset_filter`, `config_filter` and `status_filter` query params.

E.g. ?dataset_filter=my_dataset&dataset_filter=my_other_dataset&status_filter=running
will only show rows where the dataset is "my_dataset" or "my_other_dataset", and where the status is "running".

An additional date range filter is supported for the `created_at` column. Use the `start_date` and `end_date`
query parameters to configure this.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await humanloop.evaluations.list({
  projectId: "projectId_example",
  size: 50,
  page: 0,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

String ID of project. Starts with `pr_`.

##### id: `string`[]<a id="id-string"></a>

A list of evaluation run ids to filter on. Starts with `ev_`.

##### startDate: `string | Date`<a id="startdate-string--date"></a>

Only return evaluations created after this date.

##### endDate: `string | Date`<a id="enddate-string--date"></a>

Only return evaluations created before this date.

##### size: `number`<a id="size-number"></a>

##### page: `number`<a id="page-number"></a>

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataEvaluationResponse](./models/paginated-data-evaluation-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.listAllForProject`<a id="humanloopevaluationslistallforproject"></a>

Get all the evaluations associated with your project.

Deprecated: This is a legacy unpaginated endpoint. Use `/evaluations` instead, with appropriate
sorting, filtering and pagination options.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listAllForProjectResponse = await humanloop.evaluations.listAllForProject(
  {
    projectId: "projectId_example",
  }
);
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

String ID of project. Starts with `pr_`.

##### evaluatorAggregates: `boolean`<a id="evaluatoraggregates-boolean"></a>

Whether to include evaluator aggregates in the response.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/evaluations` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.listDatapoints`<a id="humanloopevaluationslistdatapoints"></a>

Get testcases by evaluation ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listDatapointsResponse = await humanloop.evaluations.listDatapoints({
  id: "id_example",
  page: 1,
  size: 10,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of evaluation. Starts with `ev_`.

##### page: `number`<a id="page-number"></a>

Page to fetch. Starts from 1.

##### size: `number`<a id="size-number"></a>

Number of evaluation results to retrieve.

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataEvaluationDatapointSnapshotResponse](./models/paginated-data-evaluation-datapoint-snapshot-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations/{id}/datapoints` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.log`<a id="humanloopevaluationslog"></a>

Log an external generation to an evaluation run for a datapoint.

The run must have status 'running'.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const logResponse = await humanloop.evaluations.log({
  evaluationId: "evaluationId_example",
  datapoint_id: "datapoint_id_example",
  log: {
    save: true,
  },
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### datapoint_id: `string`<a id="datapoint_id-string"></a>

The datapoint for which a log was generated. Must be one of the datapoints in the dataset being evaluated.

##### log: [`LogRequest`](./models/log-request.ts)<a id="log-logrequestmodelslog-requestts"></a>

The log generated for the datapoint.

##### evaluationId: `string`<a id="evaluationid-string"></a>

ID of the evaluation run. Starts with `evrun_`.

#### 🔄 Return<a id="🔄-return"></a>

[CreateLogResponse](./models/create-log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations/{evaluation_id}/log` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.result`<a id="humanloopevaluationsresult"></a>

Log an evaluation result to an evaluation run.

The run must have status 'running'. One of `result` or `error` must be provided.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const resultResponse = await humanloop.evaluations.result({
  evaluationId: "evaluationId_example",
  log_id: "log_id_example",
  evaluator_id: "evaluator_id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### log_id: `string`<a id="log_id-string"></a>

The log that was evaluated. Must have as its `source_datapoint_id` one of the datapoints in the dataset being evaluated.

##### evaluator_id: `string`<a id="evaluator_id-string"></a>

ID of the evaluator that evaluated the log. Starts with `evfn_`. Must be one of the evaluator IDs associated with the evaluation run being logged to.

##### evaluationId: `string`<a id="evaluationid-string"></a>

ID of the evaluation run. Starts with `evrun_`.

##### result: [`ValueProperty`](./models/value-property.ts)<a id="result-valuepropertymodelsvalue-propertyts"></a>

##### error: `string`<a id="error-string"></a>

An error that occurred during evaluation.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluationResultResponse](./models/evaluation-result-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations/{evaluation_id}/result` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.updateStatus`<a id="humanloopevaluationsupdatestatus"></a>

Update the status of an evaluation run.

Can only be used to update the status of an evaluation run that uses external or human evaluators.
The evaluation must currently have status 'running' if swithcing to completed, or it must have status
'completed' if switching back to 'running'.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateStatusResponse = await humanloop.evaluations.updateStatus({
  id: "id_example",
  status: "pending",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### status: [`EvaluationStatus`](./models/evaluation-status.ts)<a id="status-evaluationstatusmodelsevaluation-statusts"></a>

The new status of the evaluation.

##### id: `string`<a id="id-string"></a>

String ID of evaluation run. Starts with `ev_`.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluations/{id}/status` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.create`<a id="humanloopevaluatorscreate"></a>

Create an evaluator within your organization.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.evaluators.create({
  description: "description_example",
  name: "name_example",
  arguments_type: "target_free",
  return_type: "boolean",
  type: "python",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### description: `string`<a id="description-string"></a>

The description of the evaluator.

##### name: `string`<a id="name-string"></a>

The name of the evaluator.

##### arguments_type: [`EvaluatorArgumentsType`](./models/evaluator-arguments-type.ts)<a id="arguments_type-evaluatorargumentstypemodelsevaluator-arguments-typets"></a>

Whether this evaluator is target-free or target-required.

##### return_type: [`EvaluatorReturnTypeEnum`](./models/evaluator-return-type-enum.ts)<a id="return_type-evaluatorreturntypeenummodelsevaluator-return-type-enumts"></a>

The type of the return value of the evaluator.

##### type: [`EvaluatorType`](./models/evaluator-type.ts)<a id="type-evaluatortypemodelsevaluator-typets"></a>

The type of the evaluator.

##### code: `string`<a id="code-string"></a>

The code for the evaluator. This code will be executed in a sandboxed environment.

##### model_config: [`ModelConfigCompletionRequest`](./models/model-config-completion-request.ts)<a id="model_config-modelconfigcompletionrequestmodelsmodel-config-completion-requestts"></a>

The model configuration used to generate.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluators` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.delete`<a id="humanloopevaluatorsdelete"></a>

Delete an evaluator within your organization.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteResponse = await humanloop.evaluators.delete({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluators/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.get`<a id="humanloopevaluatorsget"></a>

Get an evaluator within your organization.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.evaluators.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluators/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.list`<a id="humanloopevaluatorslist"></a>

Get all evaluators within your organization.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await humanloop.evaluators.list();
```

#### 🔄 Return<a id="🔄-return"></a>

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluators` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.update`<a id="humanloopevaluatorsupdate"></a>

Update an evaluator within your organization.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.evaluators.update({
  id: "id_example",
  arguments_type: "target_free",
  return_type: "boolean",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### description: `string`<a id="description-string"></a>

The description of the evaluator.

##### name: `string`<a id="name-string"></a>

The name of the evaluator.

##### arguments_type: [`EvaluatorArgumentsType`](./models/evaluator-arguments-type.ts)<a id="arguments_type-evaluatorargumentstypemodelsevaluator-arguments-typets"></a>

Whether this evaluator is target-free or target-required.

##### return_type: [`EvaluatorReturnTypeEnum`](./models/evaluator-return-type-enum.ts)<a id="return_type-evaluatorreturntypeenummodelsevaluator-return-type-enumts"></a>

The type of the return value of the evaluator.

##### code: `string`<a id="code-string"></a>

The code for the evaluator. This code will be executed in a sandboxed environment.

##### model_config: [`ModelConfigCompletionRequest`](./models/model-config-completion-request.ts)<a id="model_config-modelconfigcompletionrequestmodelsmodel-config-completion-requestts"></a>

The model configuration used to generate.

#### 🔄 Return<a id="🔄-return"></a>

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/evaluators/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.create`<a id="humanloopexperimentscreate"></a>

Create an experiment for your project.

You can optionally specify IDs of your project's model configs to include
in the experiment, along with a set of labels to consider as positive feedback
and whether the experiment should be set as active.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.experiments.create({
  projectId: "projectId_example",
  name: "name_example",
  positive_labels: [
    {
      type: "type_example",
      value: "value_example",
    },
  ],
  set_active: false,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### name: `string`<a id="name-string"></a>

Name of experiment.

##### positive_labels: [`PositiveLabel`](./models/positive-label.ts)[]<a id="positive_labels-positivelabelmodelspositive-labelts"></a>

Feedback labels to treat as positive user feedback. Used to monitor the performance of model configs in the experiment.

##### projectId: `string`<a id="projectid-string"></a>

String ID of project. Starts with `pr_`.

##### config_ids: `string`[]<a id="config_ids-string"></a>

Configs to add to this experiment. Further configs can be added later.

##### set_active: `boolean`<a id="set_active-boolean"></a>

Whether to set the created project as the project\\\'s active experiment.

#### 🔄 Return<a id="🔄-return"></a>

[ExperimentResponse](./models/experiment-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/experiments` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.delete`<a id="humanloopexperimentsdelete"></a>

Delete the experiment with the specified ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteResponse = await humanloop.experiments.delete({
  experimentId: "experimentId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### experimentId: `string`<a id="experimentid-string"></a>

String ID of experiment. Starts with `exp_`.

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/experiments/{experiment_id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.list`<a id="humanloopexperimentslist"></a>

Get an array of experiments associated to your project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await humanloop.experiments.list({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

String ID of project. Starts with `pr_`.

#### 🔄 Return<a id="🔄-return"></a>

[ExperimentResponse](./models/experiment-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/experiments` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.sample`<a id="humanloopexperimentssample"></a>

Samples a model config from the experiment's active model configs.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const sampleResponse = await humanloop.experiments.sample({
  experimentId: "experimentId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### experimentId: `string`<a id="experimentid-string"></a>

String ID of experiment. Starts with `exp_`.

#### 🔄 Return<a id="🔄-return"></a>

[GetModelConfigResponse](./models/get-model-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/experiments/{experiment_id}/model-config` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.update`<a id="humanloopexperimentsupdate"></a>

Update your experiment, including registering and de-registering
model configs.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.experiments.update({
  experimentId: "experimentId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### experimentId: `string`<a id="experimentid-string"></a>

String ID of experiment. Starts with `exp_`.

##### name: `string`<a id="name-string"></a>

Name of experiment.

##### positive_labels: [`PositiveLabel`](./models/positive-label.ts)[]<a id="positive_labels-positivelabelmodelspositive-labelts"></a>

Feedback labels to treat as positive user feedback. Used to monitor the performance of model configs in the experiment.

##### config_ids_to_register: `string`[]<a id="config_ids_to_register-string"></a>

Model configs to add to this experiment.

##### config_ids_to_deregister: `string`[]<a id="config_ids_to_deregister-string"></a>

Model configs in this experiment to be deactivated.

#### 🔄 Return<a id="🔄-return"></a>

[ExperimentResponse](./models/experiment-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/experiments/{experiment_id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.feedback`<a id="humanloopfeedback"></a>

Submit an array of feedback for existing `data_ids`

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const feedbackResponse = await humanloop.feedback({
  type: "string_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### type: [`FeedbackTypeProperty`](./models/feedback-type-property.ts)<a id="type-feedbacktypepropertymodelsfeedback-type-propertyts"></a>

##### value: `string`<a id="value-string"></a>

The feedback value to be set. This field should be left blank when unsetting \\\'rating\\\', \\\'correction\\\' or \\\'comment\\\', but is required otherwise.

##### data_id: `string`<a id="data_id-string"></a>

ID to associate the feedback to a previously logged datapoint.

##### user: `string`<a id="user-string"></a>

A unique identifier to who provided the feedback.

##### created_at: `string`<a id="created_at-string"></a>

User defined timestamp for when the feedback was created. 

##### unset: `boolean`<a id="unset-boolean"></a>

If true, the value for this feedback is unset.

#### 🔄 Return<a id="🔄-return"></a>

[FeedbackSubmitResponse](./models/feedback-submit-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/feedback` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.create`<a id="humanloopfinetunescreate"></a>

Trigger the fine-tuning process for a specific base model and data snapshot.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.finetunes.create({
  projectId: "projectId_example",
  name: "name_example",
  dataset_id: "dataset_id_example",
  config: {
    provider: "openai",
    base_model: "base_model_example",
  },
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### name: `string`<a id="name-string"></a>

User defined friendly name for a finetuning run

##### dataset_id: `string`<a id="dataset_id-string"></a>

ID of dataset used for finetuning

##### config: [`FinetuneConfig`](./models/finetune-config.ts)<a id="config-finetuneconfigmodelsfinetune-configts"></a>

Configuration and hyper-parameters for the fine-tuning process

##### projectId: `string`<a id="projectid-string"></a>

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata that you would like to log for reference.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

#### 🔄 Return<a id="🔄-return"></a>

[FinetuneResponse](./models/finetune-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/finetunes` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.listAllForProject`<a id="humanloopfinetuneslistallforproject"></a>

Get a list of all fine-tuned models associated to a given project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listAllForProjectResponse = await humanloop.finetunes.listAllForProject({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FinetuneResponse](./models/finetune-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/finetunes` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.summary`<a id="humanloopfinetunessummary"></a>

Checks data for errors and generates finetune data summary.

Does not actually trigger the finetuning process or persist the data.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const summaryResponse = await humanloop.finetunes.summary({
  projectId: "projectId_example",
  name: "name_example",
  dataset_id: "dataset_id_example",
  config: {
    provider: "openai",
    base_model: "base_model_example",
  },
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### name: `string`<a id="name-string"></a>

User defined friendly name for a finetuning run

##### dataset_id: `string`<a id="dataset_id-string"></a>

ID of dataset used for finetuning

##### config: [`FinetuneConfig`](./models/finetune-config.ts)<a id="config-finetuneconfigmodelsfinetune-configts"></a>

Configuration and hyper-parameters for the fine-tuning process

##### projectId: `string`<a id="projectid-string"></a>

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata that you would like to log for reference.

##### provider_api_keys: [`ProviderApiKeys`](./models/provider-api-keys.ts)<a id="provider_api_keys-providerapikeysmodelsprovider-api-keysts"></a>

API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization.

#### 🔄 Return<a id="🔄-return"></a>

[FinetuneDataSummary](./models/finetune-data-summary.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/finetunes/summary` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.update`<a id="humanloopfinetunesupdate"></a>

Update user-specified attributes of the specified finetuned models.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.finetunes.update({
  id: "id_example",
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### projectId: `string`<a id="projectid-string"></a>

##### name: `string`<a id="name-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FinetuneResponse](./models/finetune-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/finetunes/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.delete`<a id="humanlooplogsdelete"></a>

Delete

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteResponse = await humanloop.logs.delete({});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`[]<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/logs` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.get`<a id="humanlooplogsget"></a>

Retrieve a log by log id.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.logs.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of log to return. Starts with `data_`.

#### 🔄 Return<a id="🔄-return"></a>

[LogResponse](./models/log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/logs/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.list`<a id="humanlooplogslist"></a>

Retrieve paginated logs from the server.

Sorting and filtering are supported through query params.

Sorting is supported for the `source`, `model`, `timestamp`, and `feedback-{output_name}` columns.
Specify sorting with the `sort` query param, with values `{column}.{ordering}`.
E.g. ?sort=source.asc&sort=model.desc will yield a multi-column sort. First by source then by model.

Filtering is supported for the `source`, `model`, `feedback-{output_name}`,
`evaluator-{evaluator_external_id}` columns.

Specify filtering with the `source_filter`, `model_filter`, `feedback-{output.name}_filter` and
`evaluator-{evaluator_external_id}_filter` query params.

E.g. ?source_filter=AI&source_filter=user_1234&feedback-explicit_filter=good
will only show rows where the source is "AI" or "user_1234", and where the latest feedback for the "explicit" output
group is "good".

An additional date range filter is supported for the `Timestamp` column (i.e. `Log.created_at`).
These are supported through the `start_date` and `end_date` query parameters.

Searching is supported for the model inputs and output.
Specify a search term with the `search` query param.
E.g. ?search=hello%20there will cause a case-insensitive search across model inputs and output.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await humanloop.logs.list({
  projectId: "projectId_example",
  versionStatus: "uncommitted",
  size: 50,
  page: 0,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

##### search: `string`<a id="search-string"></a>

##### metadataSearch: `string`<a id="metadatasearch-string"></a>

##### versionStatus: [`VersionStatus`](./models/version-status.ts)<a id="versionstatus-versionstatusmodelsversion-statusts"></a>

##### startDate: `string | Date`<a id="startdate-string--date"></a>

##### endDate: `string | Date`<a id="enddate-string--date"></a>

##### size: `number`<a id="size-number"></a>

##### page: `number`<a id="page-number"></a>

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataLogResponse](./models/paginated-data-log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/logs` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.log`<a id="humanlooplog"></a>

Log a datapoint or array of datapoints to your Humanloop project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const logResponse = await humanloop.log({
  save: true,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### project: `string`<a id="project-string"></a>

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`<a id="session_id-string"></a>

ID of the session to associate the datapoint.

##### session_reference_id: `string`<a id="session_reference_id-string"></a>

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`<a id="parent_id-string"></a>

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`<a id="parent_reference_id-string"></a>

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`<a id="inputs-object"></a>

The inputs passed to the prompt template.

##### source: `string`<a id="source-string"></a>

Identifies where the model was called from.

##### metadata: `object`<a id="metadata-object"></a>

Any additional metadata to record.

##### save: `boolean`<a id="save-boolean"></a>

Whether the request/response payloads will be stored on Humanloop.

##### source_datapoint_id: `string`<a id="source_datapoint_id-string"></a>

ID of the source datapoint if this is a log derived from a datapoint in a dataset.

##### reference_id: `string`<a id="reference_id-string"></a>

A unique string to reference the datapoint. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a subsequent log request.

##### trial_id: `string`<a id="trial_id-string"></a>

Unique ID of an experiment trial to associate to the log.

##### messages: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="messages-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

The messages passed to the to provider chat endpoint.

##### output: `string`<a id="output-string"></a>

Generated output from your model for the provided inputs. Can be `None` if logging an error, or if logging a parent datapoint with the intention to populate it later

##### config_id: `string`<a id="config_id-string"></a>

Unique ID of a config to associate to the log.

##### config: [`ConfigProperty`](./models/config-property.ts)<a id="config-configpropertymodelsconfig-propertyts"></a>

##### environment: `string`<a id="environment-string"></a>

The environment name used to create the log.

##### feedback: [`FeedbackLabelsProperty`](./models/feedback-labels-property.ts)<a id="feedback-feedbacklabelspropertymodelsfeedback-labels-propertyts"></a>

##### created_at: `string`<a id="created_at-string"></a>

User defined timestamp for when the log was created. 

##### error: `string`<a id="error-string"></a>

Error message if the log is an error.

##### duration: `number`<a id="duration-number"></a>

Duration of the logged event in seconds.

##### output_message: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)<a id="output_message-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

The message returned by the provider.

##### prompt_tokens: `number`<a id="prompt_tokens-number"></a>

Number of tokens in the prompt used to generate the output.

##### output_tokens: `number`<a id="output_tokens-number"></a>

Number of tokens in the output generated by the model.

##### provider_request: `object`<a id="provider_request-object"></a>

Raw request sent to provider.

##### provider_response: `object`<a id="provider_response-object"></a>

Raw response received the provider.

#### 🔄 Return<a id="🔄-return"></a>

[LogsLogResponse](./models/logs-log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/logs` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.update`<a id="humanlooplogsupdate"></a>

Update a logged datapoint in your Humanloop project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.logs.update({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of logged datapoint to return. Starts with `data_`.

##### output: `string`<a id="output-string"></a>

Generated output from your model for the provided inputs.

##### error: `string`<a id="error-string"></a>

Error message if the log is an error.

##### duration: `number`<a id="duration-number"></a>

Duration of the logged event in seconds.

#### 🔄 Return<a id="🔄-return"></a>

[LogResponse](./models/log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/logs/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.updateByRef`<a id="humanlooplogsupdatebyref"></a>

Update a logged datapoint by its reference ID.

The `reference_id` query parameter must be provided, and refers to the
`reference_id` of a previously-logged datapoint.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateByRefResponse = await humanloop.logs.updateByRef({
  referenceId: "referenceId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### referenceId: `string`<a id="referenceid-string"></a>

A unique string to reference the datapoint. Identifies the logged datapoint created with the same `reference_id`.

##### output: `string`<a id="output-string"></a>

Generated output from your model for the provided inputs.

##### error: `string`<a id="error-string"></a>

Error message if the log is an error.

##### duration: `number`<a id="duration-number"></a>

Duration of the logged event in seconds.

#### 🔄 Return<a id="🔄-return"></a>

[LogResponse](./models/log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/logs` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.deserialize`<a id="humanloopmodelconfigsdeserialize"></a>

Deserialize a model config from a .prompt file format.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deserializeResponse = await humanloop.modelConfigs.deserialize({
  config: "config_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### config: `string`<a id="config-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ModelConfigResponse](./models/model-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/model-configs/deserialize` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.export`<a id="humanloopmodelconfigsexport"></a>

Export a model config to a .prompt file by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const exportResponse = await humanloop.modelConfigs.export({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of the model config. Starts with `config_`.

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/model-configs/{id}/export` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.get`<a id="humanloopmodelconfigsget"></a>

Get a specific model config by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.modelConfigs.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of the model config. Starts with `config_`.

#### 🔄 Return<a id="🔄-return"></a>

[ModelConfigResponse](./models/model-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/model-configs/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.register`<a id="humanloopmodelconfigsregister"></a>

Register a model config to a project and optionally add it to an
experiment.

If the project name provided does not exist, a new project will be created
automatically.

If an experiment name is provided, the specified experiment must already
exist. Otherwise, an error will be raised.

If the model config is the first to be associated to the project, it will
be set as the active model config.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const registerResponse = await humanloop.modelConfigs.register({
  provider: "openai",
  model: "model_example",
  max_tokens: -1,
  temperature: 1,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  endpoint: "complete",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### model: `string`<a id="model-string"></a>

The model instance used. E.g. text-davinci-002.

##### description: `string`<a id="description-string"></a>

A description of the model config.

##### name: `string`<a id="name-string"></a>

A friendly display name for the model config. If not provided, a name will be generated.

##### provider: [`ModelProviders`](./models/model-providers.ts)<a id="provider-modelprovidersmodelsmodel-providersts"></a>

The company providing the underlying model service.

##### max_tokens: `number`<a id="max_tokens-number"></a>

The maximum number of tokens to generate. Provide max_tokens=-1 to dynamically calculate the maximum number of tokens to generate given the length of the prompt

##### temperature: `number`<a id="temperature-number"></a>

What sampling temperature to use when making a generation. Higher values means the model will be more creative.

##### top_p: `number`<a id="top_p-number"></a>

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.

##### stop: [`StopSequenceSProperty`](./models/stop-sequence-sproperty.ts)<a id="stop-stopsequencespropertymodelsstop-sequence-spropertyts"></a>

##### presence_penalty: `number`<a id="presence_penalty-number"></a>

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the generation so far.

##### frequency_penalty: `number`<a id="frequency_penalty-number"></a>

Number between -2.0 and 2.0. Positive values penalize new tokens based on how frequently they appear in the generation so far.

##### other: `object`<a id="other-object"></a>

Other parameter values to be passed to the provider call.

##### seed: `number`<a id="seed-number"></a>

If specified, model will make a best effort to sample deterministically, but it is not guaranteed.

##### response_format: [`ResponseFormat`](./models/response-format.ts)<a id="response_format-responseformatmodelsresponse-formatts"></a>

The format of the response. Only type json_object is currently supported for chat.

##### project: `string`<a id="project-string"></a>

Unique project name. If it does not exist, a new project will be created.

##### project_id: `string`<a id="project_id-string"></a>

Unique project ID

##### experiment: `string`<a id="experiment-string"></a>

If specified, the model config will be added to this experiment. Experiments are used for A/B testing and optimizing hyperparameters.

##### prompt_template: `string`<a id="prompt_template-string"></a>

Prompt template that will take your specified inputs to form your final request to the provider model. NB: Input variables within the prompt template should be specified with syntax: {{INPUT_NAME}}.

##### chat_template: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="chat_template-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

Messages prepended to the list of messages sent to the provider. These messages that will take your specified inputs to form your final request to the provider model. NB: Input variables within the prompt template should be specified with syntax: {{INPUT_NAME}}.

##### endpoint: [`ModelEndpoints`](./models/model-endpoints.ts)<a id="endpoint-modelendpointsmodelsmodel-endpointsts"></a>

Which of the providers model endpoints to use. For example Complete or Edit.

##### tools: [`ToolsEquivalentToOpenAIFunctionsPropertyInner`](./models/tools-equivalent-to-open-aifunctions-property-inner.ts)[]<a id="tools-toolsequivalenttoopenaifunctionspropertyinnermodelstools-equivalent-to-open-aifunctions-property-innerts"></a>

Make tools available to OpenAIs chat model as functions.

#### 🔄 Return<a id="🔄-return"></a>

[ProjectConfigResponse](./models/project-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/model-configs` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.serialize`<a id="humanloopmodelconfigsserialize"></a>

Serialize a model config to a .prompt file format.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const serializeResponse = await humanloop.modelConfigs.serialize({
  provider: "openai",
  model: "model_example",
  max_tokens: -1,
  temperature: 1,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
  endpoint: "complete",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### description: `string`<a id="description-string"></a>

A description of the model config.

##### name: `string`<a id="name-string"></a>

A friendly display name for the model config. If not provided, a name will be generated.

##### provider: [`ModelProviders`](./models/model-providers.ts)<a id="provider-modelprovidersmodelsmodel-providersts"></a>

The company providing the underlying model service.

##### model: `string`<a id="model-string"></a>

The model instance used. E.g. text-davinci-002.

##### max_tokens: `number`<a id="max_tokens-number"></a>

The maximum number of tokens to generate. Provide max_tokens=-1 to dynamically calculate the maximum number of tokens to generate given the length of the prompt

##### temperature: `number`<a id="temperature-number"></a>

What sampling temperature to use when making a generation. Higher values means the model will be more creative.

##### top_p: `number`<a id="top_p-number"></a>

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.

##### stop: [`StopSequenceSProperty`](./models/stop-sequence-sproperty.ts)<a id="stop-stopsequencespropertymodelsstop-sequence-spropertyts"></a>

##### presence_penalty: `number`<a id="presence_penalty-number"></a>

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the generation so far.

##### frequency_penalty: `number`<a id="frequency_penalty-number"></a>

Number between -2.0 and 2.0. Positive values penalize new tokens based on how frequently they appear in the generation so far.

##### other: `object`<a id="other-object"></a>

Other parameter values to be passed to the provider call.

##### seed: `number`<a id="seed-number"></a>

If specified, model will make a best effort to sample deterministically, but it is not guaranteed.

##### response_format: [`ResponseFormat`](./models/response-format.ts)<a id="response_format-responseformatmodelsresponse-formatts"></a>

The format of the response. Only type json_object is currently supported for chat.

##### endpoint: [`ModelEndpoints`](./models/model-endpoints.ts)<a id="endpoint-modelendpointsmodelsmodel-endpointsts"></a>

The provider model endpoint used.

##### chat_template: [`ChatMessageWithToolCall`](./models/chat-message-with-tool-call.ts)[]<a id="chat_template-chatmessagewithtoolcallmodelschat-message-with-tool-callts"></a>

Messages prepended to the list of messages sent to the provider. These messages that will take your specified inputs to form your final request to the provider model. Input variables within the template should be specified with syntax: {{INPUT_NAME}}.

##### tools: [`ToolsEquivalentToOpenAIFunctionsPropertyInner`](./models/tools-equivalent-to-open-aifunctions-property-inner.ts)[]<a id="tools-toolsequivalenttoopenaifunctionspropertyinnermodelstools-equivalent-to-open-aifunctions-property-innerts"></a>

Make tools available to OpenAIs chat model as functions.

##### prompt_template: `string`<a id="prompt_template-string"></a>

Prompt template that will take your specified inputs to form your final request to the model. Input variables within the prompt template should be specified with syntax: {{INPUT_NAME}}.

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/model-configs/serialize` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.create`<a id="humanloopprojectscreate"></a>

Create a new project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.projects.create({
  name: "name_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### name: `string`<a id="name-string"></a>

Unique project name.

##### feedback_types: [`FeedbackTypeRequest`](./models/feedback-type-request.ts)[]<a id="feedback_types-feedbacktyperequestmodelsfeedback-type-requestts"></a>

Feedback types to be created.

##### directory_id: `string`<a id="directory_id-string"></a>

ID of directory to assign project to. Starts with `dir_`. If not provided, the project will be created in the root directory.

#### 🔄 Return<a id="🔄-return"></a>

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.createFeedbackType`<a id="humanloopprojectscreatefeedbacktype"></a>

Create Feedback Type

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createFeedbackTypeResponse = await humanloop.projects.createFeedbackType({
  id: "id_example",
  type: "type_example",
  _class: "select",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### type: `string`<a id="type-string"></a>

The type of feedback to update.

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### values: [`FeedbackLabelRequest`](./models/feedback-label-request.ts)[]<a id="values-feedbacklabelrequestmodelsfeedback-label-requestts"></a>

The feedback values to be available. This field should only be populated when updating a \\\'select\\\' or \\\'multi_select\\\' feedback class.

##### class: [`FeedbackClass`](./models/feedback-class.ts)<a id="class-feedbackclassmodelsfeedback-classts"></a>

The data type associated to this feedback type; whether it is a \\\'text\\\'/\\\'select\\\'/\\\'multi_select\\\'. This is optional when updating the default feedback types (i.e. when `type` is \\\'rating\\\', \\\'action\\\' or \\\'issue\\\').

#### 🔄 Return<a id="🔄-return"></a>

[FeedbackTypeModel](./models/feedback-type-model.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/feedback-types` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deactivateConfig`<a id="humanloopprojectsdeactivateconfig"></a>

Remove the project's active config, if set.

This has no effect if the project does not have an active model config set.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deactivateConfigResponse = await humanloop.projects.deactivateConfig({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### environment: `string`<a id="environment-string"></a>

Name for the environment. E.g. \'production\'. If not provided, will delete the active config for the default environment.

#### 🔄 Return<a id="🔄-return"></a>

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/active-config` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deactivateExperiment`<a id="humanloopprojectsdeactivateexperiment"></a>

Remove the project's active experiment, if set.

This has no effect if the project does not have an active experiment set.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deactivateExperimentResponse =
  await humanloop.projects.deactivateExperiment({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### environment: `string`<a id="environment-string"></a>

Name for the environment. E.g. \'producton\'. If not provided, will return the experiment for the default environment.

#### 🔄 Return<a id="🔄-return"></a>

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/active-experiment` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.delete`<a id="humanloopprojectsdelete"></a>

Delete a specific file.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteResponse = await humanloop.projects.delete({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deleteDeployedConfig`<a id="humanloopprojectsdeletedeployedconfig"></a>

Remove the verion deployed to environment.

This has no effect if the project does not have an active version set.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteDeployedConfigResponse =
  await humanloop.projects.deleteDeployedConfig({
    projectId: "projectId_example",
    environmentId: "environmentId_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

##### environmentId: `string`<a id="environmentid-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/deployed-config/{environment_id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deployConfig`<a id="humanloopprojectsdeployconfig"></a>

Deploy a model config to an environment.

If the environment already has a model config deployed, it will be replaced.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deployConfigResponse = await humanloop.projects.deployConfig({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

##### config_id: `string`<a id="config_id-string"></a>

Model config unique identifier generated by Humanloop.

##### experiment_id: `string`<a id="experiment_id-string"></a>

String ID of experiment. Starts with `exp_`.

##### environments: [`EnvironmentRequest`](./models/environment-request.ts)[]<a id="environments-environmentrequestmodelsenvironment-requestts"></a>

List of environments to associate with the model config.

#### 🔄 Return<a id="🔄-return"></a>

[EnvironmentProjectConfigResponse](./models/environment-project-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{project_id}/deploy-config` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.export`<a id="humanloopprojectsexport"></a>

Export all logged datapoints associated to your project.

Results are paginated and sorts the datapoints based on `created_at` in
descending order.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const exportResponse = await humanloop.projects.export({
  id: "id_example",
  page: 0,
  size: 10,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### page: `number`<a id="page-number"></a>

Page offset for pagination.

##### size: `number`<a id="size-number"></a>

Page size for pagination. Number of logs to export.

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataLogResponse](./models/paginated-data-log-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/export` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.get`<a id="humanloopprojectsget"></a>

Get a specific project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.projects.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

#### 🔄 Return<a id="🔄-return"></a>

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.getActiveConfig`<a id="humanloopprojectsgetactiveconfig"></a>

Retrieves a config to use to execute your model.

A config will be selected based on the project's
active config/experiment settings.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getActiveConfigResponse = await humanloop.projects.getActiveConfig({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### environment: `string`<a id="environment-string"></a>

Name for the environment. E.g. \'producton\'. If not provided, will return the active config for the default environment.

#### 🔄 Return<a id="🔄-return"></a>

[GetModelConfigResponse](./models/get-model-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/active-config` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.list`<a id="humanloopprojectslist"></a>

Get a paginated list of files.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await humanloop.projects.list({
  page: 0,
  size: 10,
  sortBy: "created_at",
  order: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### page: `number`<a id="page-number"></a>

Page offset for pagination.

##### size: `number`<a id="size-number"></a>

Page size for pagination. Number of projects to fetch.

##### filter: `string`<a id="filter-string"></a>

Case-insensitive filter for project name.

##### userFilter: `string`<a id="userfilter-string"></a>

Case-insensitive filter for users in the project. This filter matches against both email address and name of users.

##### sortBy: [`ProjectSortBy`](./models/project-sort-by.ts)<a id="sortby-projectsortbymodelsproject-sort-byts"></a>

Field to sort projects by

##### order: [`SortOrder`](./models/sort-order.ts)<a id="order-sortordermodelssort-orderts"></a>

Direction to sort by.

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataProjectResponse](./models/paginated-data-project-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.listConfigs`<a id="humanloopprojectslistconfigs"></a>

Get an array of versions associated to your file.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listConfigsResponse = await humanloop.projects.listConfigs({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### evaluationAggregates: `boolean`<a id="evaluationaggregates-boolean"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProjectConfigResponse](./models/project-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/configs` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.listDeployedConfigs`<a id="humanloopprojectslistdeployedconfigs"></a>

Get an array of environments with the deployed configs associated to your project.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listDeployedConfigsResponse =
  await humanloop.projects.listDeployedConfigs({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

#### 🔄 Return<a id="🔄-return"></a>

[EnvironmentProjectConfigResponse](./models/environment-project-config-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/deployed-configs` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.update`<a id="humanloopprojectsupdate"></a>

Update a specific project.

Set the project's active model config/experiment by passing either
`active_experiment_id` or `active_model_config_id`.
These will be set to the Default environment unless a list of environments
are also passed in specifically detailing which environments to assign the
active config or experiment.

Set the feedback labels to be treated as positive user feedback used in
calculating top-level project metrics by passing a list of labels in
`positive_labels`.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await humanloop.projects.update({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### name: `string`<a id="name-string"></a>

The new unique project name. Caution, if you are using the project name as the unique identifier in your API calls, changing the name will break the calls.

##### active_experiment_id: `string`<a id="active_experiment_id-string"></a>

ID for an experiment to set as the project\\\'s active deployment. Starts with \\\'exp_\\\'. At most one of \\\'active_experiment_id\\\' and \\\'active_model_config_id\\\' can be set.

##### active_config_id: `string`<a id="active_config_id-string"></a>

ID for a config to set as the project\\\'s active deployment. Starts with \\\'config_\\\'. At most one of \\\'active_experiment_id\\\' and \\\'active_config_id\\\' can be set.

##### positive_labels: [`PositiveLabel`](./models/positive-label.ts)[]<a id="positive_labels-positivelabelmodelspositive-labelts"></a>

The full list of labels to treat as positive user feedback.

##### directory_id: `string`<a id="directory_id-string"></a>

ID of directory to assign project to. Starts with `dir_`.

#### 🔄 Return<a id="🔄-return"></a>

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.updateFeedbackTypes`<a id="humanloopprojectsupdatefeedbacktypes"></a>

Update feedback types.

Allows enabling the available feedback types and setting status of
feedback types/categorical values.

This behaves like an upsert; any feedback categorical values that do not
already exist in the project will be created.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateFeedbackTypesResponse =
  await humanloop.projects.updateFeedbackTypes({
    id: "id_example",
    requestBody: [
      {
        type: "type_example",
        _class: "select",
      },
    ],
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of project. Starts with `pr_`.

##### requestBody: [`FeedbackTypeRequest`](./models/feedback-type-request.ts)[]<a id="requestbody-feedbacktyperequestmodelsfeedback-type-requestts"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FeedbackTypeModel](./models/feedback-type-model.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/projects/{id}/feedback-types` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.sessions.create`<a id="humanloopsessionscreate"></a>

Create a new session.

Returns a session ID that can be used to log datapoints to the session.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await humanloop.sessions.create();
```

#### 🔄 Return<a id="🔄-return"></a>

[CreateSessionResponse](./models/create-session-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/sessions` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.sessions.get`<a id="humanloopsessionsget"></a>

Get a session by ID.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await humanloop.sessions.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

String ID of session to return. Starts with `sesh_`.

#### 🔄 Return<a id="🔄-return"></a>

[SessionResponse](./models/session-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/sessions/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.sessions.list`<a id="humanloopsessionslist"></a>

Get a page of sessions.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await humanloop.sessions.list({
  projectId: "projectId_example",
  page: 1,
  size: 10,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### projectId: `string`<a id="projectid-string"></a>

String ID of project to return sessions for. Sessions that contain any datapoints associated to this project will be returned. Starts with `pr_`.

##### page: `number`<a id="page-number"></a>

Page to fetch. Starts from 1.

##### size: `number`<a id="size-number"></a>

Number of sessions to retrieve.

#### 🔄 Return<a id="🔄-return"></a>

[PaginatedDataSessionResponse](./models/paginated-data-session-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/sessions` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


## Author<a id="author"></a>
This TypeScript package is automatically generated by [Konfig](https://konfigthis.com)
