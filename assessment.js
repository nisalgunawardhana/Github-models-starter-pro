// assessment.js
// Multi-turn Coding Assistant Chatbot using GPT-4o via GitHub AI Inference API

import dotenv from "dotenv";
import readline from "node:readline";
import OpenAI from "openai";

// 1️⃣ Load environment variables
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN not found in .env file");
  process.exit(1);
}

// 2️⃣ Initialize OpenAI client (GitHub Models endpoint)
const client = new OpenAI({
  apiKey: GITHUB_TOKEN,
  baseURL: "https://models.github.ai/inference",
  defaultHeaders: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

// 3️⃣ Setup command-line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askUser(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// 4️⃣ Conversation memory (multi-turn)
const messages = [
  {
    role: "system",
    content:
      "You are a professional coding assistant. " +
      "Help users with programming concepts, debugging, best practices, " +
      "and code examples across multiple programming languages.",
  },
];

// 5️⃣ Chat loop
async function startChat() {
  console.log("🤖 Coding Assistant Chatbot");
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const userInput = (await askUser("You: ")).trim();

    if (!userInput) continue;

    if (userInput.toLowerCase() === "exit") {
      console.log("Bot: Goodbye! 👋");
      rl.close();
      process.exit(0);
    }

    // Save user message
    messages.push({ role: "user", content: userInput });

    try {
      const response = await client.chat.completions.create({
        model: "openai/gpt-4o",
        messages,
        temperature: 0.3,
      });

      const botReply =
        response.choices[0]?.message?.content || "No response received.";

      console.log(`\nBot: ${botReply}\n`);

      // Save assistant response (keeps context)
      messages.push({ role: "assistant", content: botReply });
    } catch (error) {
      console.error("\n⚠️ Error communicating with the AI API");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Message:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }

      console.log();
    }
  }
}

// Start chatbot
startChat();
