import { ConfigCache } from "./cache";
import { configCache } from "./complete-deployed";
import { Humanloop, HumanloopError } from "./index";

describe("client", () => {
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_API_KEY,
    basePath: "http://127.0.0.1:4010",
    openaiApiKey: "OPENAI_TEST_KEY",
  });
  it("list", async () => {
    let page = await humanloop.projects.list();
    const records = page.data.records;
    while (page.hasNext()) {
      page = await page.next();
      records.push(...page.data.records);
    }
    expect(records).not.toBeNull();
  });
  it("exportDatapoints", async () => {
    let page = await humanloop.projects.export({ id: "pr_1" });
    const records = page.data.records;
    while (page.hasNext()) {
      page = await page.next();
      records.push(...page.data.records);
    }
    expect(records).not.toBeNull();
  });
  it("log", async () => {
    const response = await humanloop.log({
      project: "myProject",
      inputs: { myInput: "Hello world" },
      output: "test",
    });
    expect(response).not.toBeNull();
  });

  it("chat", async () => {
    const humanloop = new Humanloop({
      apiKey: process.env.HUMANLOOP_API_KEY,
      basePath: "https://neostaging.humanloop.ml/v4",
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    const response = await humanloop.chat({
      project: "konfig-dev-001",
      messages: [
        {
          role: "system",
          content:
            "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
        },
        { role: "user", content: "Hello!" },
      ],
      model_config: {
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 1,
      },
    });
    console.log(response);
  });
  it("listProjects", async () => {
    const humanloop = new Humanloop({
      apiKey: process.env.HUMANLOOP_API_KEY,
      basePath: "https://neostaging.humanloop.ml/v4",
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    let page = await humanloop.projects.list();
    for (let i = 0; i < 2; i++) {
      console.log(page.data);
      page = await page.next();
    }
  });
  it("chatStream", async () => {
    const humanloop = new Humanloop({
      apiKey: process.env.HUMANLOOP_API_KEY,
      basePath: "https://neostaging.humanloop.ml/v4",
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    const response = await humanloop.chatStream({
      project: "konfig-dev-001",
      messages: [{ role: "user", content: "Hello!" }],
      model_config: {
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 1,
      },
    });
    const decoder = new TextDecoder();
    const reader = response.data.getReader();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      console.log(decoder.decode(value));
    }
  });

  it("completeDeployed-completeDeployedNoProxy", async () => {
    const humanloop = new Humanloop({
      basePath: "https://neostaging.humanloop.ml/v4",
      apiKey: process.env.HUMANLOOP_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    const params = {
      project_id: "pr_2DCxnUcGuDiBPkjSpxev5",
      inputs: {
        topic: "hello!",
      },
      source: "test",
      metadata: { key: "value" },
    };
    const response = await humanloop.completeDeployed(params);
    const responseNoProxy = await humanloop.completeDeployedNoProxy(params);
    console.log(JSON.stringify(response.data, null, 2));
    console.log(JSON.stringify(responseNoProxy.data, null, 2));
    expect(response.data.data[0].model_config_id).toEqual(responseNoProxy.data[0].model_config_id);
    configCache.dispose()
  });
  it("completeDeployed", async () => {
    const humanloop = new Humanloop({
      basePath: "https://neostaging.humanloop.ml/v4",
      apiKey: process.env.HUMANLOOP_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });
    const response = await humanloop.completeDeployed({
      project_id: "pr_2DCxnUcGuDiBPkjSpxev5",
      inputs: {
        topic: "artificial intelligence",
      },
      source: "test",
      metadata: { key: "value" },
    });
    console.log(JSON.stringify(response.data, null, 2));
  });
  it("HumanloopError", async () => {
    // Initialize the Humanloop client.
    const humanloop = new Humanloop({
      basePath: "https://neostaging.humanloop.ml/v4",
      apiKey: process.env.HUMANLOOP_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await humanloop.chatDeployed({
        project: "test",
        messages: [],
      });
      console.log(response.data);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(HumanloopError);
    }
  });
});
