import dotenv from "dotenv";
import OpenAI from "openai";
import readline from "readline";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.GITHUB_TOKEN });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

let conversation = [];

async function chat() {
  console.log("Welcome to Coding Assistant! Type 'exit' to quit.\n");

  while (true) {
    const userMessage = await ask("You: ");
    if (userMessage.toLowerCase() === "exit") break;

    conversation.push({ role: "user", content: userMessage });

    try {
      const response = await client.chat.completions.create({
        model: "openai/gpt-4o",
        messages: conversation,
        temperature: 0.7,
      });

      const botMessage = response.choices[0].message.content;
      console.log(`Bot: ${botMessage}\n`);
      conversation.push({ role: "assistant", content: botMessage });
    } catch (err) {
      console.error("API Error:", err.message);
    }
  }

  rl.close();
}

chat();