# CompletionsApi

All URIs are relative to *https://api.humanloop.com/v4*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](CompletionsApi.md#create) | **POST** /completion | Create
[**createDeployed**](CompletionsApi.md#createDeployed) | **POST** /completion-deployed | Completion Deployed
[**createExperiment**](CompletionsApi.md#createExperiment) | **POST** /completion-experiment | Completion Experiment
[**createModelConfig**](CompletionsApi.md#createModelConfig) | **POST** /completion-model-config | Completion Model Config


# **create**

#### **POST** /completion

### Description
Create a completion by providing details of the model configuration in the request. change

### Example


```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  // Use native Fetch API instead of axios
  // useFetch: true,
  openaiApiKey: "openaiApiKey",
  openaiAzureApiKey: "openaiAzureApiKey",
  openaiAzureEndpointApiKey: "openaiAzureEndpointApiKey",
  cohereApiKey: "cohereApiKey",
  ai21ApiKey: "ai21ApiKey",
  mockApiKey: "mockApiKey",
  anthropicApiKey: "anthropicApiKey",
  apiKey: "API_KEY",
});

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

console.log(createResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **completionRequest** | **CompletionRequest**|  |


### Return type

**CompletionResponse**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **createDeployed**

#### **POST** /completion-deployed

### Description
Create a completion using the project's active deployment.

The active deployment can be a specific model configuration or an experiment.

### Example


```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  // Use native Fetch API instead of axios
  // useFetch: true,
  openaiApiKey: "openaiApiKey",
  openaiAzureApiKey: "openaiAzureApiKey",
  openaiAzureEndpointApiKey: "openaiAzureEndpointApiKey",
  cohereApiKey: "cohereApiKey",
  ai21ApiKey: "ai21ApiKey",
  mockApiKey: "mockApiKey",
  anthropicApiKey: "anthropicApiKey",
  apiKey: "API_KEY",
});

const createDeployedResponse = await humanloop.completeDeployed({
  num_samples: 1,
  stream: false,
});

console.log(createDeployedResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **completionDeployedRequest** | **CompletionDeployedRequest**|  |


### Return type

**CompletionResponse**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **createExperiment**

#### **POST** /completion-experiment

### Description
Create a completion for a specific experiment.

### Example


```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  // Use native Fetch API instead of axios
  // useFetch: true,
  openaiApiKey: "openaiApiKey",
  openaiAzureApiKey: "openaiAzureApiKey",
  openaiAzureEndpointApiKey: "openaiAzureEndpointApiKey",
  cohereApiKey: "cohereApiKey",
  ai21ApiKey: "ai21ApiKey",
  mockApiKey: "mockApiKey",
  anthropicApiKey: "anthropicApiKey",
  apiKey: "API_KEY",
});

const createExperimentResponse = await humanloop.completeExperiment({
  num_samples: 1,
  stream: false,
  experiment_id: "experiment_id_example",
});

console.log(createExperimentResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **completionExperimentRequest** | **CompletionExperimentRequest**|  |


### Return type

**CompletionResponse**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# **createModelConfig**

#### **POST** /completion-model-config

### Description
Create a completion for a specific model configuration.

### Example


```typescript
import { Humanloop } from "humanloop";

const humanloop = new Humanloop({
  // Defining the base path is optional and defaults to https://api.humanloop.com/v4
  // basePath: "https://api.humanloop.com/v4",
  // Use native Fetch API instead of axios
  // useFetch: true,
  openaiApiKey: "openaiApiKey",
  openaiAzureApiKey: "openaiAzureApiKey",
  openaiAzureEndpointApiKey: "openaiAzureEndpointApiKey",
  cohereApiKey: "cohereApiKey",
  ai21ApiKey: "ai21ApiKey",
  mockApiKey: "mockApiKey",
  anthropicApiKey: "anthropicApiKey",
  apiKey: "API_KEY",
});

const createModelConfigResponse = await humanloop.completeModelConfiguration({
  num_samples: 1,
  stream: false,
  model_config_id: "model_config_id_example",
});

console.log(createModelConfigResponse);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **completionModelConfigRequest** | **CompletionModelConfigRequest**|  |


### Return type

**CompletionResponse**

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


