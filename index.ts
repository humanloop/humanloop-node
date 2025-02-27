import { HumanloopClient } from "./src/humanloop.client";

const hl_client = new HumanloopClient({
    apiKey: "hl_sk_ba742be05e4413f7cf0b54c1552ddb0586a35440d3c85aac",
});

void main();

async function main(): Promise<void> {
    const response = await hl_client.prompts.call({
        path: "Andrei QA TS/Prompt 2",
        prompt: {
            model: "gpt-4o-mini",
        },
        messages: [
            {
                role: "user",
                content: "Say something",
            },
        ],
    });

    console.log("RESPONSE", response);
}