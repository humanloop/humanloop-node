<div align="center">

[![Visit Humanloop](./header.png)](https://humanloop.com)

# [Humanloop](https://humanloop.com)

[![npm](https://img.shields.io/badge/npm-v0.5.19-blue)](https://www.npmjs.com/package/humanloop/v/0.5.19)
[![GitHub last commit](https://img.shields.io/github/last-commit/humanloop/humanloop-node.svg)](https://github.com/humanloop/humanloop-node/commits)

</div>

## Table of Contents

<!-- toc -->

- [Installing](#installing)
  * [npm](#npm)
  * [yarn](#yarn)
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
  * [`humanloop.evaluations.create`](#humanloopevaluationscreate)
  * [`humanloop.evaluations.get`](#humanloopevaluationsget)
  * [`humanloop.evaluations.listAllForProject`](#humanloopevaluationslistallforproject)
  * [`humanloop.evaluations.listDatapoints`](#humanloopevaluationslistdatapoints)
  * [`humanloop.evaluators.create`](#humanloopevaluatorscreate)
  * [`humanloop.evaluators.delete`](#humanloopevaluatorsdelete)
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
  * [`humanloop.log`](#humanlooplog)
  * [`humanloop.logs.update`](#humanlooplogsupdate)
  * [`humanloop.logs.updateByRef`](#humanlooplogsupdatebyref)
  * [`humanloop.modelConfigs.get`](#humanloopmodelconfigsget)
  * [`humanloop.modelConfigs.register`](#humanloopmodelconfigsregister)
  * [`humanloop.projects.create`](#humanloopprojectscreate)
  * [`humanloop.projects.createFeedbackType`](#humanloopprojectscreatefeedbacktype)
  * [`humanloop.projects.deactivateConfig`](#humanloopprojectsdeactivateconfig)
  * [`humanloop.projects.deactivateExperiment`](#humanloopprojectsdeactivateexperiment)
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

## Installing

### npm
```
npm install humanloop --save
```

### yarn
```
yarn add humanloop
```

## Streaming Support

This SDK supports streaming, see example usage in a NextJS application [here](https://github.com/konfig-dev/humanloop-streaming-example/blob/main/pages/api/edge-streaming.ts#L16)

## Getting Started

```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  // Use native Fetch API instead of axios
  // useFetch: true,
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

## Reference


### `humanloop.chat`

Get a chat response by providing details of the model configuration in the request.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.chat({
  messages: [
    {
      role: "user",
    },
  ],
  num_samples: 1,
  stream: false,
  model_config: {
    model: "model_example",
    max_tokens: -1,
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  },
});
```

#### ⚙️ Parameters

##### messages: [`ChatMessage`](./models/chat-message.ts)[]

The messages passed to the to provider chat endpoint.

##### model_config: [`ModelConfigurationProperty`](./models/model-configuration-property.ts)

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of chat responses.

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`

End-user ID passed through to provider call.

##### tool_call: [`ToolCallProperty1`](./models/tool-call-property1.ts)

#### 🔄 Return

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint

`/chat` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.chatDeployed`

Get a chat response using the project\'s active deployment.  The active deployment can be a specific model configuration or an experiment.

#### 🛠️ Usage

```typescript
const createDeployedResponse = await humanloop.chatDeployed({
  messages: [
    {
      role: "user",
    },
  ],
  num_samples: 1,
  stream: false,
});
```

#### ⚙️ Parameters

##### messages: [`ChatMessage`](./models/chat-message.ts)[]

The messages passed to the to provider chat endpoint.

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of chat responses.

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`

End-user ID passed through to provider call.

##### tool_call: [`ToolCallProperty1`](./models/tool-call-property1.ts)

##### environment: `string`

The environment name used to create a chat response. If not specified, the default environment will be used.

#### 🔄 Return

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint

`/chat-deployed` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.chatExperiment`

Get a chat response for a specific experiment.

#### 🛠️ Usage

```typescript
const createExperimentResponse = await humanloop.chatExperiment({
  messages: [
    {
      role: "user",
    },
  ],
  num_samples: 1,
  stream: false,
  experiment_id: "experiment_id_example",
});
```

#### ⚙️ Parameters

##### messages: [`ChatMessage`](./models/chat-message.ts)[]

The messages passed to the to provider chat endpoint.

##### experiment_id: `string`

If an experiment ID is provided a model configuration will be sampled from the experiments active model configurations.

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of chat responses, where each chat response will use a model configuration sampled from the experiment.

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`

End-user ID passed through to provider call.

##### tool_call: [`ToolCallProperty1`](./models/tool-call-property1.ts)

#### 🔄 Return

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint

`/chat-experiment` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.chatModelConfiguration`

Get chat response for a specific model configuration.

#### 🛠️ Usage

```typescript
const createModelConfigResponse = await humanloop.chatModelConfiguration({
  messages: [
    {
      role: "user",
    },
  ],
  num_samples: 1,
  stream: false,
  model_config_id: "model_config_id_example",
});
```

#### ⚙️ Parameters

##### messages: [`ChatMessage`](./models/chat-message.ts)[]

The messages passed to the to provider chat endpoint.

##### model_config_id: `string`

Identifies the model configuration used to create a chat response.

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of chat responses.

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### user: `string`

End-user ID passed through to provider call.

##### tool_call: [`ToolCallProperty1`](./models/tool-call-property1.ts)

#### 🔄 Return

[ChatResponse](./models/chat-response.ts)

#### 🌐 Endpoint

`/chat-model-config` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.complete`

Create a completion by providing details of the model configuration in the request.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.complete({
  num_samples: 1,
  stream: false,
  model_config: {
    model: "model_example",
    max_tokens: -1,
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    prompt_template: "{{question}}",
  },
});
```

#### ⚙️ Parameters

##### model_config: [`ModelConfigurationProperty1`](./models/model-configuration-property1.ts)

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of generations.

##### logprobs: `number`

Include the log probabilities of the top n tokens in the provider_response

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### suffix: `string`

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

##### user: `string`

End-user ID passed through to provider call.

#### 🔄 Return

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint

`/completion` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.completeDeployed`

Create a completion using the project\'s active deployment.  The active deployment can be a specific model configuration or an experiment.

#### 🛠️ Usage

```typescript
const createDeployedResponse = await humanloop.completeDeployed({
  num_samples: 1,
  stream: false,
});
```

#### ⚙️ Parameters

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of generations.

##### logprobs: `number`

Include the log probabilities of the top n tokens in the provider_response

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### suffix: `string`

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

##### user: `string`

End-user ID passed through to provider call.

##### environment: `string`

The environment name used to create a chat response. If not specified, the default environment will be used.

#### 🔄 Return

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint

`/completion-deployed` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.completeExperiment`

Create a completion for a specific experiment.

#### 🛠️ Usage

```typescript
const createExperimentResponse = await humanloop.completeExperiment({
  num_samples: 1,
  stream: false,
  experiment_id: "experiment_id_example",
});
```

#### ⚙️ Parameters

##### experiment_id: `string`

If an experiment ID is provided a model configuration will be sampled from the experiments active model configurations.

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of chat responses, where each chat response will use a model configuration sampled from the experiment.

##### logprobs: `number`

Include the log probabilities of the top n tokens in the provider_response

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### suffix: `string`

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

##### user: `string`

End-user ID passed through to provider call.

#### 🔄 Return

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint

`/completion-experiment` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.completeModelConfiguration`

Create a completion for a specific model configuration.

#### 🛠️ Usage

```typescript
const createModelConfigResponse = await humanloop.completeModelConfiguration({
  num_samples: 1,
  stream: false,
  model_config_id: "model_config_id_example",
});
```

#### ⚙️ Parameters

##### model_config_id: `string`

Identifies the model configuration used to create a chat response.

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

##### num_samples: `number`

The number of generations.

##### logprobs: `number`

Include the log probabilities of the top n tokens in the provider_response

##### stream: `boolean`

If true, tokens will be sent as data-only server-sent events. If num_samples > 1, samples are streamed back independently.

##### suffix: `string`

The suffix that comes after a completion of inserted text. Useful for completions that act like inserts.

##### user: `string`

End-user ID passed through to provider call.

#### 🔄 Return

[CompletionResponse](./models/completion-response.ts)

#### 🌐 Endpoint

`/completion-model-config` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datapoints.delete`

Delete a list of testsets by their IDs.

#### 🛠️ Usage

```typescript
const deleteResponse = await humanloop.datapoints.delete([
  "requestBody_example",
]);
```

#### ⚙️ Request Body

`string`[]

#### 🌐 Endpoint

`/datapoints` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datapoints.get`

Get a datapoint by ID.

#### 🛠️ Usage

```typescript
const getResponse = await humanloop.datapoints.get({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of datapoint. Starts with `evtc_`.

#### 🔄 Return

[DatapointResponse](./models/datapoint-response.ts)

#### 🌐 Endpoint

`/datapoints/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datapoints.update`

Edit the input, messages and criteria fields of a datapoint. The fields passed in the request are the ones edited.  Passing `null` as a value for a field will delete that field. In order to signify not changing a field, it should be omitted from the request body.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.datapoints.update({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of datapoint. Starts with `evtc_`.

##### inputs: Record<string, `string`>

The inputs to the prompt template for this datapoint.

##### messages: [`ChatMessage`](./models/chat-message.ts)[]

The chat messages for this datapoint.

##### target: Record<string, [`Target`](./models/target.ts)>

Object with criteria necessary to evaluate this datapoint.

#### 🔄 Return

[DatapointResponse](./models/datapoint-response.ts)

#### 🌐 Endpoint

`/datapoints/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.create`

Create a new dataset for a project.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.datasets.create({
  projectId: "projectId_example",
  description: "description_example",
  name: "name_example",
});
```

#### ⚙️ Parameters

##### description: `string`

The description of the dataset.

##### name: `string`

The name of the dataset.

##### projectId: `string`

#### 🔄 Return

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/datasets` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.createDatapoint`

Create a new testcase for a testset.

#### 🛠️ Usage

```typescript
const createDatapointResponse = await humanloop.datasets.createDatapoint({
  datasetId: "dataset_id_example",
  requestBody: {
    log_ids: ["log_ids_example"],
  },
});
```

#### ⚙️ Parameters

##### datasetId: `string`

String ID of dataset. Starts with `evts_`.

##### requestBody: [`DatasetsCreateDatapointRequest`](./models/datasets-create-datapoint-request.ts)

#### 🔄 Return

[DatapointResponse](./models/datapoint-response.ts)

#### 🌐 Endpoint

`/datasets/{dataset_id}/datapoints` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.delete`

Delete a dataset by ID.

#### 🛠️ Usage

```typescript
const deleteResponse = await humanloop.datasets.delete({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of dataset. Starts with `evts_`.

#### 🔄 Return

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint

`/datasets/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.get`

Get a single dataset by ID.

#### 🛠️ Usage

```typescript
const getResponse = await humanloop.datasets.get({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of dataset. Starts with `evts_`.

#### 🔄 Return

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint

`/datasets/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.listAllForProject`

Get all datasets for a project.

#### 🛠️ Usage

```typescript
const listAllForProjectResponse = await humanloop.datasets.listAllForProject({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters

##### projectId: `string`

#### 🔄 Return

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/datasets` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.listDatapoints`

Get datapoints for a dataset.

#### 🛠️ Usage

```typescript
const listDatapointsResponse = await humanloop.datasets.listDatapoints({
  datasetId: "datasetId_example",
  page: 0,
  size: 50,
});
```

#### ⚙️ Parameters

##### datasetId: `string`

String ID of dataset. Starts with `evts_`.

##### page: `number`

##### size: `number`

#### 🌐 Endpoint

`/datasets/{dataset_id}/datapoints` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.datasets.update`

Update a testset by ID.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.datasets.update({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of testset. Starts with `evts_`.

##### description: `string`

The description of the dataset.

##### name: `string`

The name of the dataset.

#### 🔄 Return

[DatasetResponse](./models/dataset-response.ts)

#### 🌐 Endpoint

`/datasets/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.create`

Create an evaluation.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.evaluations.create({
  projectId: "projectId_example",
  config_id: "config_id_example",
  evaluator_ids: ["evaluator_ids_example"],
  dataset_id: "dataset_id_example",
});
```

#### ⚙️ Parameters

##### config_id: `string`

ID of the config to evaluate. Starts with `config_`.

##### evaluator_ids: `string`[]

IDs of evaluators to run on the dataset. IDs start with `evfn_`

##### dataset_id: `string`

ID of the dataset to use in this evaluation. Starts with `evts_`.

##### projectId: `string`

String ID of project. Starts with `pr_`.

##### provider_api_keys: [`ProviderAPIKeysProperty1`](./models/provider-apikeys-property1.ts)

#### 🔄 Return

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/evaluations` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.get`

Get evaluation by ID.

#### 🛠️ Usage

```typescript
const getResponse = await humanloop.evaluations.get({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of evaluation run. Starts with `ev_`.

##### evaluatorAggregates: `boolean`

Whether to include evaluator aggregates in the response.

#### 🔄 Return

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint

`/evaluations/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.listAllForProject`

Get all the evaluations associated with your project.

#### 🛠️ Usage

```typescript
const listAllForProjectResponse = await humanloop.evaluations.listAllForProject(
  {
    projectId: "projectId_example",
  }
);
```

#### ⚙️ Parameters

##### projectId: `string`

String ID of project. Starts with `pr_`.

##### evaluatorAggregates: `boolean`

Whether to include evaluator aggregates in the response.

#### 🔄 Return

[EvaluationResponse](./models/evaluation-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/evaluations` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluations.listDatapoints`

Get testcases by evaluation ID.

#### 🛠️ Usage

```typescript
const listDatapointsResponse = await humanloop.evaluations.listDatapoints({
  id: "id_example",
  page: 1,
  size: 10,
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of evaluation. Starts with `ev_`.

##### page: `number`

Page to fetch. Starts from 1.

##### size: `number`

Number of evaluation results to retrieve.

#### 🌐 Endpoint

`/evaluations/{id}/datapoints` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.create`

Create an evaluator within your organization.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.evaluators.create({
  description: "description_example",
  name: "name_example",
  code: "code_example",
  arguments_type: "string_example",
  return_type: "string_example",
});
```

#### ⚙️ Parameters

##### description: `string`

The description of the evaluator.

##### name: `string`

The name of the evaluator.

##### code: `string`

The code for the evaluator. This code will be executed in a sandboxed environment.

##### arguments_type: [`EvaluatorArgumentsType`](./models/evaluator-arguments-type.ts)

Whether this evaluator is target-free or target-required.

##### return_type: [`EvaluatorReturnTypeEnum`](./models/evaluator-return-type-enum.ts)

The type of the return value of the evaluator.

#### 🔄 Return

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint

`/evaluators` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.delete`

Delete an evaluator within your organization.

#### 🛠️ Usage

```typescript
const deleteResponse = await humanloop.evaluators.delete({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

#### 🌐 Endpoint

`/evaluators/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.list`

Get all evaluators within your organization.

#### 🛠️ Usage

```typescript
const listResponse = await humanloop.evaluators.list();
```

#### 🔄 Return

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint

`/evaluators` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.evaluators.update`

Update an evaluator within your organization.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.evaluators.update({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

##### description: `string`

The description of the evaluator.

##### name: `string`

The name of the evaluator.

##### code: `string`

The code for the evaluator. This code will be executed in a sandboxed environment.

##### arguments_type: [`EvaluatorArgumentsType`](./models/evaluator-arguments-type.ts)

Whether this evaluator is target-free or target-required.

##### return_type: [`EvaluatorReturnTypeEnum`](./models/evaluator-return-type-enum.ts)

The type of the return value of the evaluator.

#### 🔄 Return

[EvaluatorResponse](./models/evaluator-response.ts)

#### 🌐 Endpoint

`/evaluators/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.create`

Create an experiment for your project.  You can optionally specify IDs of your project\'s model configs to include in the experiment, along with a set of labels to consider as positive feedback and whether the experiment should be set as active.

#### 🛠️ Usage

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

#### ⚙️ Parameters

##### name: `string`

Name of experiment.

##### positive_labels: [`PositiveLabel`](./models/positive-label.ts)[]

Feedback labels to treat as positive user feedback. Used to monitor the performance of model configs in the experiment.

##### projectId: `string`

String ID of project. Starts with `pr_`.

##### config_ids: `string`[]

Configs to add to this experiment. Further configs can be added later.

##### set_active: `boolean`

Whether to set the created project as the project\\\'s active experiment.

#### 🔄 Return

[ExperimentResponse](./models/experiment-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/experiments` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.delete`

Delete the experiment with the specified ID.

#### 🛠️ Usage

```typescript
const deleteResponse = await humanloop.experiments.delete({
  experimentId: "experimentId_example",
});
```

#### ⚙️ Parameters

##### experimentId: `string`

String ID of experiment. Starts with `exp_`.

#### 🌐 Endpoint

`/experiments/{experiment_id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.list`

Get an array of experiments associated to your project.

#### 🛠️ Usage

```typescript
const listResponse = await humanloop.experiments.list({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters

##### projectId: `string`

String ID of project. Starts with `pr_`.

#### 🔄 Return

[ExperimentResponse](./models/experiment-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/experiments` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.sample`

Samples a model config from the experiment\'s active model configs.

#### 🛠️ Usage

```typescript
const sampleResponse = await humanloop.experiments.sample({
  experimentId: "experimentId_example",
});
```

#### ⚙️ Parameters

##### experimentId: `string`

String ID of experiment. Starts with `exp_`.

#### 🔄 Return

[GetModelConfigResponse](./models/get-model-config-response.ts)

#### 🌐 Endpoint

`/experiments/{experiment_id}/model-config` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.experiments.update`

Update your experiment, including registering and de-registering model configs.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.experiments.update({
  experimentId: "experimentId_example",
});
```

#### ⚙️ Parameters

##### experimentId: `string`

String ID of experiment. Starts with `exp_`.

##### name: `string`

Name of experiment.

##### positive_labels: [`PositiveLabel`](./models/positive-label.ts)[]

Feedback labels to treat as positive user feedback. Used to monitor the performance of model configs in the experiment.

##### config_ids_to_register: `string`[]

Model configs to add to this experiment.

##### config_ids_to_deregister: `string`[]

Model configs in this experiment to be deactivated.

#### 🔄 Return

[ExperimentResponse](./models/experiment-response.ts)

#### 🌐 Endpoint

`/experiments/{experiment_id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.feedback`

Submit an array of feedback for existing `data_ids`

#### 🛠️ Usage

```typescript
const feedbackResponse = await humanloop.feedback({
  type: "string_example",
});
```

#### ⚙️ Parameters

##### type: [`FeedbackTypeProperty`](./models/feedback-type-property.ts)

##### value: `string`

The feedback value to be set. This field should be left blank when unsetting \\\'rating\\\', \\\'correction\\\' or \\\'comment\\\', but is required otherwise.

##### data_id: `string`

ID to associate the feedback to a previously logged datapoint.

##### user: `string`

A unique identifier to who provided the feedback.

##### created_at: `string`

User defined timestamp for when the feedback was created. 

##### unset: `boolean`

If true, the value for this feedback is unset.

#### 🔄 Return

[FeedbackSubmitResponse](./models/feedback-submit-response.ts)

#### 🌐 Endpoint

`/feedback` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.create`

Trigger the fine-tuning process for a specific base model and data snapshot.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.finetunes.create({
  projectId: "projectId_example",
  name: "name_example",
  dataset_id: "dataset_id_example",
  config: {
    base_model: "base_model_example",
  },
});
```

#### ⚙️ Parameters

##### name: `string`

User defined friendly name for a finetuning run

##### dataset_id: `string`

ID of dataset used for finetuning

##### config: [`FinetuningConfigProperty`](./models/finetuning-config-property.ts)

##### projectId: `string`

##### metadata: `object`

Any additional metadata that you would like to log for reference.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

#### 🔄 Return

[FinetuneResponse](./models/finetune-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/finetunes` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.listAllForProject`

Get a list of all fine-tuned models associated to a given project.

#### 🛠️ Usage

```typescript
const listAllForProjectResponse = await humanloop.finetunes.listAllForProject({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters

##### projectId: `string`

#### 🔄 Return

[FinetuneResponse](./models/finetune-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/finetunes` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.summary`

Checks data for errors and generates finetune data summary.  Does not actually trigger the finetuning process or persist the data.

#### 🛠️ Usage

```typescript
const summaryResponse = await humanloop.finetunes.summary({
  projectId: "projectId_example",
  name: "name_example",
  dataset_id: "dataset_id_example",
  config: {
    base_model: "base_model_example",
  },
});
```

#### ⚙️ Parameters

##### name: `string`

User defined friendly name for a finetuning run

##### dataset_id: `string`

ID of dataset used for finetuning

##### config: [`FinetuningConfigProperty`](./models/finetuning-config-property.ts)

##### projectId: `string`

##### metadata: `object`

Any additional metadata that you would like to log for reference.

##### provider_api_keys: [`ProviderAPIKeysProperty`](./models/provider-apikeys-property.ts)

#### 🔄 Return

[FinetuneDataSummary](./models/finetune-data-summary.ts)

#### 🌐 Endpoint

`/projects/{project_id}/finetunes/summary` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.finetunes.update`

Update user-specified attributes of the specified finetuned models.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.finetunes.update({
  id: "id_example",
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters

##### id: `string`

##### projectId: `string`

##### name: `string`

#### 🔄 Return

[FinetuneResponse](./models/finetune-response.ts)

#### 🌐 Endpoint

`/finetunes/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.log`

Log a datapoint or array of datapoints to your Humanloop project.

#### 🛠️ Usage

```typescript
const logResponse = await humanloop.log({});
```

#### ⚙️ Parameters

##### project: `string`

Unique project name. If no project exists with this name, a new project will be created.

##### project_id: `string`

Unique ID of a project to associate to the log. Either this or `project` must be provided.

##### session_id: `string`

ID of the session to associate the datapoint.

##### session_reference_id: `string`

A unique string identifying the session to associate the datapoint to. Allows you to log multiple datapoints to a session (using an ID kept by your internal systems) by passing the same `session_reference_id` in subsequent log requests. Specify at most one of this or `session_id`.

##### parent_id: `string`

ID associated to the parent datapoint in a session.

##### parent_reference_id: `string`

A unique string identifying the previously-logged parent datapoint in a session. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a prior log request. Specify at most one of this or `parent_id`. Note that this cannot refer to a datapoint being logged in the same request.

##### inputs: `object`

The inputs passed to the prompt template.

##### source: `string`

Identifies where the model was called from.

##### metadata: `object`

Any additional metadata to record.

##### reference_id: `string`

A unique string to reference the datapoint. Allows you to log nested datapoints with your internal system IDs by passing the same reference ID as `parent_id` in a subsequent log request.

##### trial_id: `string`

Unique ID of an experiment trial to associate to the log.

##### messages: [`ChatMessage`](./models/chat-message.ts)[]

The messages passed to the to provider chat endpoint.

##### output: `string`

Generated output from your model for the provided inputs. Can be `None` if logging an error, or if logging a parent datapoint with the intention to populate it later

##### config: [`ConfigProperty1`](./models/config-property1.ts)

##### feedback: [`FeedbackLabelsProperty`](./models/feedback-labels-property.ts)

##### created_at: `string`

User defined timestamp for when the log was created. 

##### error: `string`

Error message if the log is an error.

##### duration: `number`

Duration of the logged event in seconds.

#### 🔄 Return

[LogsLogResponse](./models/logs-log-response.ts)

#### 🌐 Endpoint

`/logs` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.update`

Update a logged datapoint in your Humanloop project.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.logs.update({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of logged datapoint to return. Starts with `data_`.

##### output: `string`

Generated output from your model for the provided inputs.

##### error: `string`

Error message if the log is an error.

##### duration: `number`

Duration of the logged event in seconds.

#### 🔄 Return

[LogResponse](./models/log-response.ts)

#### 🌐 Endpoint

`/logs/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.logs.updateByRef`

Update a logged datapoint by its reference ID.  The `reference_id` query parameter must be provided, and refers to the `reference_id` of a previously-logged datapoint.

#### 🛠️ Usage

```typescript
const updateByRefResponse = await humanloop.logs.updateByRef({
  referenceId: "referenceId_example",
});
```

#### ⚙️ Parameters

##### referenceId: `string`

A unique string to reference the datapoint. Identifies the logged datapoint created with the same `reference_id`.

##### output: `string`

Generated output from your model for the provided inputs.

##### error: `string`

Error message if the log is an error.

##### duration: `number`

Duration of the logged event in seconds.

#### 🔄 Return

[LogResponse](./models/log-response.ts)

#### 🌐 Endpoint

`/logs` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.get`

Get a specific model config by ID.

#### 🛠️ Usage

```typescript
const getResponse = await humanloop.modelConfigs.get({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of the model config. Starts with `config_`.

#### 🔄 Return

[ModelConfigResponse](./models/model-config-response.ts)

#### 🌐 Endpoint

`/model-configs/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.modelConfigs.register`

Register a model config to a project and optionally add it to an experiment.  If the project name provided does not exist, a new project will be created automatically.  If an experiment name is provided, the specified experiment must already exist. Otherwise, an error will be raised.  If the model config is the first to be associated to the project, it will be set as the active model config.

#### 🛠️ Usage

```typescript
const registerResponse = await humanloop.modelConfigs.register({
  model: "model_example",
  max_tokens: -1,
  temperature: 1,
  top_p: 1,
  presence_penalty: 0,
  frequency_penalty: 0,
});
```

#### ⚙️ Parameters

##### model: `string`

The model instance used. E.g. text-davinci-002.

##### description: `string`

A description of the model config.

##### name: `string`

A friendly display name for the model config. If not provided, a name will be generated.

##### provider: [`ModelProviders`](./models/model-providers.ts)

The company providing the underlying model service.

##### max_tokens: `number`

The maximum number of tokens to generate. Provide max_tokens=-1 to dynamically calculate the maximum number of tokens to generate given the length of the prompt

##### temperature: `number`

What sampling temperature to use when making a generation. Higher values means the model will be more creative.

##### top_p: `number`

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.

##### stop: [`StopSequenceSProperty`](./models/stop-sequence-sproperty.ts)

##### presence_penalty: `number`

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the generation so far.

##### frequency_penalty: `number`

Number between -2.0 and 2.0. Positive values penalize new tokens based on how frequently they appear in the generation so far.

##### other: `object`

Other parameter values to be passed to the provider call.

##### project: `string`

Unique project name. If it does not exist, a new project will be created.

##### project_id: `string`

Unique project ID

##### experiment: `string`

If specified, the model config will be added to this experiment. Experiments are used for A/B testing and optimizing hyperparameters.

##### prompt_template: `string`

Prompt template that will take your specified inputs to form your final request to the provider model. NB: Input variables within the prompt template should be specified with syntax: {{INPUT_NAME}}.

##### chat_template: [`ChatMessage`](./models/chat-message.ts)[]

Messages prepended to the list of messages sent to the provider. These messages that will take your specified inputs to form your final request to the provider model. NB: Input variables within the prompt template should be specified with syntax: {{INPUT_NAME}}.

##### endpoint: [`ModelEndpoints`](./models/model-endpoints.ts)

Which of the providers model endpoints to use. For example Complete or Edit.

##### tools: [`ModelConfigToolRequest`](./models/model-config-tool-request.ts)[]

Make tools available to OpenAIs chat model as functions.

#### 🔄 Return

[ProjectConfigResponse](./models/project-config-response.ts)

#### 🌐 Endpoint

`/model-configs` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.create`

Create a new project.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.projects.create({
  name: "name_example",
});
```

#### ⚙️ Parameters

##### name: `string`

Unique project name.

##### feedback_types: [`FeedbackTypeRequest`](./models/feedback-type-request.ts)[]

Feedback types to be created.

#### 🔄 Return

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint

`/projects` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.createFeedbackType`

Create Feedback Type

#### 🛠️ Usage

```typescript
const createFeedbackTypeResponse = await humanloop.projects.createFeedbackType({
  id: "id_example",
  type: "type_example",
});
```

#### ⚙️ Parameters

##### type: `string`

The type of feedback to update.

##### id: `string`

String ID of project. Starts with `pr_`.

##### values: [`FeedbackLabelRequest`](./models/feedback-label-request.ts)[]

The feedback values to be available. This field should only be populated when updating a \\\'select\\\' or \\\'multi_select\\\' feedback class.

##### class: [`FeedbackClass`](./models/feedback-class.ts)

The data type associated to this feedback type; whether it is a \\\'text\\\'/\\\'select\\\'/\\\'multi_select\\\'. This is optional when updating the default feedback types (i.e. when `type` is \\\'rating\\\', \\\'action\\\' or \\\'issue\\\').

#### 🔄 Return

[FeedbackTypeModel](./models/feedback-type-model.ts)

#### 🌐 Endpoint

`/projects/{id}/feedback-types` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deactivateConfig`

Remove the project\'s active config, if set.  This has no effect if the project does not have an active model config set.

#### 🛠️ Usage

```typescript
const deactivateConfigResponse = await humanloop.projects.deactivateConfig({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### environment: `string`

Name for the environment. E.g. \'producton\'. If not provided, will delete the active config for the default environment.

#### 🔄 Return

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint

`/projects/{id}/active-config` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deactivateExperiment`

Remove the project\'s active experiment, if set.  This has no effect if the project does not have an active experiment set.

#### 🛠️ Usage

```typescript
const deactivateExperimentResponse =
  await humanloop.projects.deactivateExperiment({
    id: "id_example",
  });
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### environment: `string`

Name for the environment. E.g. \'producton\'. If not provided, will return the experiment for the default environment.

#### 🔄 Return

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint

`/projects/{id}/active-experiment` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deleteDeployedConfig`

Remove the model config deployed to environment.  This has no effect if the project does not have an active model config set.

#### 🛠️ Usage

```typescript
const deleteDeployedConfigResponse =
  await humanloop.projects.deleteDeployedConfig({
    projectId: "projectId_example",
    environmentId: "environmentId_example",
  });
```

#### ⚙️ Parameters

##### projectId: `string`

##### environmentId: `string`

#### 🌐 Endpoint

`/projects/{project_id}/deployed-config/{environment_id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.deployConfig`

Deploy a model config to an environment.  If the environment already has a model config deployed, it will be replaced.

#### 🛠️ Usage

```typescript
const deployConfigResponse = await humanloop.projects.deployConfig({
  projectId: "projectId_example",
});
```

#### ⚙️ Parameters

##### projectId: `string`

##### config_id: `string`

Model config unique identifier generated by Humanloop.

##### experiment_id: `string`

String ID of experiment. Starts with `exp_`.

##### environments: [`EnvironmentRequest`](./models/environment-request.ts)[]

List of environments to associate with the model config.

#### 🔄 Return

[EnvironmentProjectConfigResponse](./models/environment-project-config-response.ts)

#### 🌐 Endpoint

`/projects/{project_id}/deploy-config` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.export`

Export all logged datapoints associated to your project.  Results are paginated and sorts the datapoints based on `created_at` in descending order.

#### 🛠️ Usage

```typescript
const exportResponse = await humanloop.projects.export({
  id: "id_example",
  page: 0,
  size: 10,
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### page: `number`

Page offset for pagination.

##### size: `number`

Page size for pagination. Number of logs to export.

#### 🌐 Endpoint

`/projects/{id}/export` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.get`

Get a specific project.

#### 🛠️ Usage

```typescript
const getResponse = await humanloop.projects.get({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

#### 🔄 Return

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint

`/projects/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.getActiveConfig`

Retrieves a config to use to execute your model.  A config will be selected based on the project\'s active config/experiment settings.

#### 🛠️ Usage

```typescript
const getActiveConfigResponse = await humanloop.projects.getActiveConfig({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### environment: `string`

Name for the environment. E.g. \'producton\'. If not provided, will return the active config for the default environment.

#### 🔄 Return

[GetModelConfigResponse](./models/get-model-config-response.ts)

#### 🌐 Endpoint

`/projects/{id}/active-config` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.list`

Get a paginated list of projects.

#### 🛠️ Usage

```typescript
const listResponse = await humanloop.projects.list({
  page: 0,
  size: 10,
});
```

#### ⚙️ Parameters

##### page: `number`

Page offset for pagination.

##### size: `number`

Page size for pagination. Number of projects to fetch.

##### organizationId: `string`

ID of organization that fetched projects belong to. Starts with `org_`.

##### filter: `string`

Case-insensitive filter for project name.

##### userFilter: `string`

Case-insensitive filter for users in the project. This filter matches against both email address and name of users.

##### sortBy: [`ProjectSortBy`](./models/project-sort-by.ts)

Field to sort projects by

##### order: [`SortOrder`](./models/sort-order.ts)

Direction to sort by.

#### 🌐 Endpoint

`/projects` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.listConfigs`

Get an array of configs associated to your project.

#### 🛠️ Usage

```typescript
const listConfigsResponse = await humanloop.projects.listConfigs({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### evaluationAggregates: `boolean`

#### 🔄 Return

[ProjectConfigResponse](./models/project-config-response.ts)

#### 🌐 Endpoint

`/projects/{id}/configs` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.listDeployedConfigs`

Get an array of environments with the deployed configs associated to your project.

#### 🛠️ Usage

```typescript
const listDeployedConfigsResponse =
  await humanloop.projects.listDeployedConfigs({
    id: "id_example",
  });
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

#### 🔄 Return

[EnvironmentProjectConfigResponse](./models/environment-project-config-response.ts)

#### 🌐 Endpoint

`/projects/{id}/deployed-configs` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.update`

Update a specific project.  Set the project\'s active model config/experiment by passing either `active_experiment_id` or `active_model_config_id`. These will be set to the Default environment unless a list of environments are also passed in specifically detailing which environments to assign the active config or experiment.  Set the feedback labels to be treated as positive user feedback used in calculating top-level project metrics by passing a list of labels in `positive_labels`.

#### 🛠️ Usage

```typescript
const updateResponse = await humanloop.projects.update({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### name: `string`

The new unique project name. Caution, if you are using the project name as the unique identifier in your API calls, changing the name will break the calls.

##### active_experiment_id: `string`

ID for an experiment to set as the project\\\'s active deployment. Starts with \\\'exp_\\\'. At most one of \\\'active_experiment_id\\\' and \\\'active_model_config_id\\\' can be set.

##### active_config_id: `string`

ID for a config to set as the project\\\'s active deployment. Starts with \\\'config_\\\'. At most one of \\\'active_experiment_id\\\' and \\\'active_config_id\\\' can be set.

##### positive_labels: [`PositiveLabel`](./models/positive-label.ts)[]

The full list of labels to treat as positive user feedback.

#### 🔄 Return

[ProjectResponse](./models/project-response.ts)

#### 🌐 Endpoint

`/projects/{id}` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.projects.updateFeedbackTypes`

Update feedback types.  Allows enabling the available feedback types and setting status of feedback types/categorical values.  This behaves like an upsert; any feedback categorical values that do not already exist in the project will be created.

#### 🛠️ Usage

```typescript
const updateFeedbackTypesResponse =
  await humanloop.projects.updateFeedbackTypes({
    id: "id_example",
    requestBody: [
      {
        type: "type_example",
      },
    ],
  });
```

#### ⚙️ Parameters

##### id: `string`

String ID of project. Starts with `pr_`.

##### requestBody: [`FeedbackTypeRequest`](./models/feedback-type-request.ts)[]

#### 🔄 Return

[FeedbackTypeModel](./models/feedback-type-model.ts)

#### 🌐 Endpoint

`/projects/{id}/feedback-types` `PATCH`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.sessions.create`

Create a new session.  Returns a session ID that can be used to log datapoints to the session.

#### 🛠️ Usage

```typescript
const createResponse = await humanloop.sessions.create();
```

#### 🔄 Return

[CreateSessionResponse](./models/create-session-response.ts)

#### 🌐 Endpoint

`/sessions` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.sessions.get`

Get a session by ID.

#### 🛠️ Usage

```typescript
const getResponse = await humanloop.sessions.get({
  id: "id_example",
});
```

#### ⚙️ Parameters

##### id: `string`

String ID of session to return. Starts with `sesh_`.

#### 🔄 Return

[SessionResponse](./models/session-response.ts)

#### 🌐 Endpoint

`/sessions/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `humanloop.sessions.list`

Get a page of sessions.

#### 🛠️ Usage

```typescript
const listResponse = await humanloop.sessions.list({
  projectId: "projectId_example",
  page: 1,
  size: 10,
});
```

#### ⚙️ Parameters

##### projectId: `string`

String ID of project to return sessions for. Sessions that contain any datapoints associated to this project will be returned. Starts with `pr_`.

##### page: `number`

Page to fetch. Starts from 1.

##### size: `number`

Number of sessions to retrieve.

#### 🌐 Endpoint

`/sessions` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


## Author
This TypeScript package is automatically generated by [Konfig](https://konfigthis.com)
