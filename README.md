# humanloop

[![npm](https://img.shields.io/badge/npm-v0.5.16-blue)](https://www.npmjs.com/package/humanloop/v/0.5.16)

## Installing

### npm
```
npm install humanloop --save
```

### yarn
```
yarn add humanloop
```

**Important note: this library can be used in both the client-side or server-side, but using it
in client-side browser code is not recommended as you would expose security credentials.**

### Streaming Support

This SDK supports streaming, see example usage in a NextJS application [here](https://github.com/konfig-dev/humanloop-streaming-example/blob/main/pages/api/edge-streaming.ts#L16)

### Usage in Next.js Edge Runtime

If you are using `humanloop` in a Next.js Edge runtime make sure to set `useFetch: true` like so:

```typescript
import { Humanloop } from "humanloop";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  const humanloop = new Humanloop({
    useFetch: true, // useFetch must be "true" for humanloop to work in Next.js edge runtime
  });
  return new Response(JSON.stringify({ message: "This is from humanloop" }), {
    status: 200,
  });
}
```


## Getting Started

```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  // Use native Fetch API instead of axios
  // useFetch: true,
  openaiApiKey: "openaiApiKey",
  ai21ApiKey: "ai21ApiKey",
  mockApiKey: "mockApiKey",
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

## Documentation for API Endpoints

All URIs are relative to *https://api.humanloop.com/v4*

Tag | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*Chats* | [**create**](docs/ChatsApi.md#create) | **POST** /chat | Get a chat response by providing details of the model configuration in the request.
*Chats* | [**createDeployed**](docs/ChatsApi.md#createDeployed) | **POST** /chat-deployed | Get a chat response using the project\&#39;s active deployment.  The active deployment can be a specific model configuration or an experiment.
*Chats* | [**createExperiment**](docs/ChatsApi.md#createExperiment) | **POST** /chat-experiment | Get a chat response for a specific experiment.
*Chats* | [**createModelConfig**](docs/ChatsApi.md#createModelConfig) | **POST** /chat-model-config | Get chat response for a specific model configuration.
*Completions* | [**create**](docs/CompletionsApi.md#create) | **POST** /completion | Create a completion by providing details of the model configuration in the request.
*Completions* | [**createDeployed**](docs/CompletionsApi.md#createDeployed) | **POST** /completion-deployed | Create a completion using the project\&#39;s active deployment.  The active deployment can be a specific model configuration or an experiment.
*Completions* | [**createExperiment**](docs/CompletionsApi.md#createExperiment) | **POST** /completion-experiment | Create a completion for a specific experiment.
*Completions* | [**createModelConfig**](docs/CompletionsApi.md#createModelConfig) | **POST** /completion-model-config | Create a completion for a specific model configuration.
*Evaluations* | [**create**](docs/EvaluationsApi.md#create) | **POST** /projects/{project_id}/evaluations | Create an evaluation.
*Evaluations* | [**get**](docs/EvaluationsApi.md#get) | **GET** /evaluations/{id} | Get evaluation by ID.
*Evaluations* | [**listAllForProject**](docs/EvaluationsApi.md#listAllForProject) | **GET** /projects/{project_id}/evaluations | Get all the evaluations associated with your project.
*Evaluations* | [**listTestcases**](docs/EvaluationsApi.md#listTestcases) | **GET** /evaluations/{id}/testcases | Get testcases by evaluation ID.
*Evaluators* | [**create**](docs/EvaluatorsApi.md#create) | **POST** /evaluators | Create an evaluator within your organization.
*Evaluators* | [**delete**](docs/EvaluatorsApi.md#delete) | **DELETE** /evaluators/{id} | Delete an evaluator within your organization.
*Evaluators* | [**list**](docs/EvaluatorsApi.md#list) | **GET** /evaluators | Get all evaluators within your organization.
*Evaluators* | [**update**](docs/EvaluatorsApi.md#update) | **PATCH** /evaluators/{id} | Update an evaluator within your organization.
*Experiments* | [**create**](docs/ExperimentsApi.md#create) | **POST** /projects/{project_id}/experiments | Create an experiment for your project.  You can optionally specify IDs of your project\&#39;s model configs to include in the experiment, along with a set of labels to consider as positive feedback and whether the experiment should be set as active.
*Experiments* | [**delete**](docs/ExperimentsApi.md#delete) | **DELETE** /experiments/{experiment_id} | Delete the experiment with the specified ID.
*Experiments* | [**list**](docs/ExperimentsApi.md#list) | **GET** /projects/{project_id}/experiments | Get an array of experiments associated to your project.
*Experiments* | [**sample**](docs/ExperimentsApi.md#sample) | **GET** /experiments/{experiment_id}/model-config | Samples a model config from the experiment\&#39;s active model configs.
*Experiments* | [**update**](docs/ExperimentsApi.md#update) | **PATCH** /experiments/{experiment_id} | Update your experiment, including registering and de-registering model configs.
*Feedback* | [**feedback**](docs/FeedbackApi.md#feedback) | **POST** /feedback | Submit an array of feedback for existing &#x60;data_ids&#x60;
*Logs* | [**log**](docs/LogsApi.md#log) | **POST** /logs | Log a datapoint or array of datapoints to your Humanloop project.
*Logs* | [**update**](docs/LogsApi.md#update) | **PATCH** /logs/{id} | Update a logged datapoint in your Humanloop project.
*Logs* | [**updateByRef**](docs/LogsApi.md#updateByRef) | **PATCH** /logs | Update a logged datapoint by its reference ID.  The &#x60;reference_id&#x60; query parameter must be provided, and refers to the &#x60;reference_id&#x60; of a previously-logged datapoint.
*Model Configs* | [**get**](docs/ModelConfigsApi.md#get) | **GET** /model-configs/{id} | Get a specific model config by ID.
*Model Configs* | [**register**](docs/ModelConfigsApi.md#register) | **POST** /model-configs | Register a model config to a project and optionally add it to an experiment.  If the project name provided does not exist, a new project will be created automatically.  If an experiment name is provided, the specified experiment must already exist. Otherwise, an error will be raised.  If the model config is the first to be associated to the project, it will be set as the active model config.
*Projects* | [**create**](docs/ProjectsApi.md#create) | **POST** /projects | Create a new project.
*Projects* | [**createFeedbackType**](docs/ProjectsApi.md#createFeedbackType) | **POST** /projects/{id}/feedback-types | 
*Projects* | [**deactivateConfig**](docs/ProjectsApi.md#deactivateConfig) | **DELETE** /projects/{id}/active-config | Remove the project\&#39;s active config, if set.  This has no effect if the project does not have an active model config set.
*Projects* | [**deactivateExperiment**](docs/ProjectsApi.md#deactivateExperiment) | **DELETE** /projects/{id}/active-experiment | Remove the project\&#39;s active experiment, if set.  This has no effect if the project does not have an active experiment set.
*Projects* | [**deleteDeployedConfig**](docs/ProjectsApi.md#deleteDeployedConfig) | **DELETE** /projects/{project_id}/deployed-config/{environment_id} | Remove the model config deployed to environment.  This has no effect if the project does not have an active model config set.
*Projects* | [**deployConfig**](docs/ProjectsApi.md#deployConfig) | **PATCH** /projects/{project_id}/deploy-config | Deploy a model config to an environment.  If the environment already has a model config deployed, it will be replaced.
*Projects* | [**export**](docs/ProjectsApi.md#export) | **POST** /projects/{id}/export | Export all logged datapoints associated to your project.  Results are paginated and sorts the datapoints based on &#x60;created_at&#x60; in descending order.
*Projects* | [**get**](docs/ProjectsApi.md#get) | **GET** /projects/{id} | Get a specific project.
*Projects* | [**getActiveConfig**](docs/ProjectsApi.md#getActiveConfig) | **GET** /projects/{id}/active-config | Retrieves a config to use to execute your model.  A config will be selected based on the project\&#39;s active config/experiment settings.
*Projects* | [**list**](docs/ProjectsApi.md#list) | **GET** /projects | Get a paginated list of projects.
*Projects* | [**listConfigs**](docs/ProjectsApi.md#listConfigs) | **GET** /projects/{id}/configs | Get an array of configs associated to your project.
*Projects* | [**listDeployedConfigs**](docs/ProjectsApi.md#listDeployedConfigs) | **GET** /projects/{id}/deployed-configs | Get an array of environments with the deployed configs associated to your project.
*Projects* | [**update**](docs/ProjectsApi.md#update) | **PATCH** /projects/{id} | Update a specific project.  Set the project\&#39;s active model config/experiment by passing either &#x60;active_experiment_id&#x60; or &#x60;active_model_config_id&#x60;. These will be set to the Default environment unless a list of environments are also passed in specifically detailing which environments to assign the active config or experiment.  Set the feedback labels to be treated as positive user feedback used in calculating top-level project metrics by passing a list of labels in &#x60;positive_labels&#x60;.
*Projects* | [**updateFeedbackTypes**](docs/ProjectsApi.md#updateFeedbackTypes) | **PATCH** /projects/{id}/feedback-types | Update feedback types.  Allows enabling the available feedback types and setting status of feedback types/categorical values.  This behaves like an upsert; any feedback categorical values that do not already exist in the project will be created.
*Sessions* | [**create**](docs/SessionsApi.md#create) | **POST** /sessions | Create a new session.  Returns a session ID that can be used to log datapoints to the session.
*Sessions* | [**get**](docs/SessionsApi.md#get) | **GET** /sessions/{id} | Get a session by ID.
*Sessions* | [**list**](docs/SessionsApi.md#list) | **GET** /sessions | Get a page of sessions.
*Testcases* | [**delete**](docs/TestcasesApi.md#delete) | **DELETE** /testcases | Delete a list of testsets by their IDs.
*Testcases* | [**get**](docs/TestcasesApi.md#get) | **GET** /testcases/{id} | Get a testcase by ID.
*Testcases* | [**update**](docs/TestcasesApi.md#update) | **PATCH** /testcases/{id} | Edit the input, messages and criteria fields of a testcase. The fields passed in the request are the ones edited.  Passing &#x60;null&#x60; as a value for a field will delete that field. In order to signify not changing a field, it should be omitted from the request body.
*Testsets* | [**create**](docs/TestsetsApi.md#create) | **POST** /projects/{project_id}/testsets | Create a new testset for a project.
*Testsets* | [**createTestcase**](docs/TestsetsApi.md#createTestcase) | **POST** /testsets/{testset_id}/testcases | Create a new testcase for a testset.
*Testsets* | [**delete**](docs/TestsetsApi.md#delete) | **DELETE** /testsets/{id} | Delete a testset by ID.
*Testsets* | [**get**](docs/TestsetsApi.md#get) | **GET** /testsets/{id} | Get a single testset by ID.
*Testsets* | [**listAllForProject**](docs/TestsetsApi.md#listAllForProject) | **GET** /projects/{project_id}/testsets | Get all testsets for a project.
*Testsets* | [**listTestcases**](docs/TestsetsApi.md#listTestcases) | **GET** /testsets/{testset_id}/testcases | Get testcases for a testset.
*Testsets* | [**update**](docs/TestsetsApi.md#update) | **PATCH** /testsets/{id} | Update a testset by ID.

## Author
This TypeScript package is automatically generated by [Konfig](https://konfigthis.com)
