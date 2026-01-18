

import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

export async function main() {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let messages = [
    {
      role: "system",
      content: `You are a highly knowledgeable and helpful coding assistant. Your expertise includes:
- Multiple programming languages (JavaScript, Python, Java, C++, etc.)
- Web development frameworks and libraries
- Database design and SQL
- Software architecture and design patterns
- Debugging and troubleshooting
- Code review and best practices
- Algorithms and data structures

When providing assistance:
- Provide clear, concise explanations
- Include practical code examples when relevant
- Explain the "why" behind your recommendations
- Offer multiple approaches when applicable
- Help debug issues by asking clarifying questions
- Suggest best practices and improvements`
    }
  ];

  /**
   * Conversation loop with context preservation
   */
  async function chatLoop() {
    rl.question("\nYou: ", async (userInput) => {
      if (userInput.trim().toLowerCase() === "exit") {
        console.log("\nAssistant: Goodbye! Happy coding!");
        rl.close();
        return;
      }

      if (userInput.trim() === "") {
        chatLoop();
        return;
      }

      try {
        messages.push({ role: "user", content: userInput });

        const response = await client.chat.completions.create({
          messages: messages,
          model: modelName,
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        });

        const assistantReply = response.choices[0].message.content;
        console.log("\nAssistant:", assistantReply);
        messages.push({ role: "assistant", content: assistantReply });
        chatLoop();
      } catch (error) {
        console.error("\nError communicating with the assistant:", error.message);
        chatLoop();
      }
    });
  }

  console.log("=".repeat(60));
  console.log("Welcome to the Coding Assistant Chatbot!");
  console.log("=".repeat(60));
  console.log("\nThis is a multi-turn conversational assistant that can help you with:");
  console.log("  • Programming questions and guidance");
  console.log("  • Code debugging and troubleshooting");
  console.log("  • Algorithm and data structure explanations");
  console.log("  • Best practices and design patterns");
  console.log("  • Code reviews and improvements");
  console.log("\nType 'exit' at any time to quit the conversation.");
  console.log("=".repeat(60));

  chatLoop();
}

main().catch((err) => {
  console.error("The application encountered an error:", err);
  process.exit(1);
});
