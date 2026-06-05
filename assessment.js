import OpenAI from "openai";
import readline from "readline";
import dotenv from "dotenv";

// 1. Load environment variables using `dotenv`
dotenv.config();

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("❌ Error: GITHUB_TOKEN is missing in your .env file!");
  process.exit(1);
}

// 2. Initialize the OpenAI API client with the GitHub token and endpoint
const openai = new OpenAI({
  apiKey: token,
  baseURL: "https://models.inference.ai.azure.com",
});

// Configure the model required by the assignment
const modelName = "gpt-4o";

// Set up the terminal reading interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 3. Implement multi-turn conversation logic by storing history
const conversationHistory = [
  {
    role: "system",
    content: "You are a helpful multi-turn coding assistant chatbot. Provide clear coding guidance, code examples, debugging help, and support multiple programming languages.",
  },
];

console.clear();
console.log("====================================================");
console.log("🚀 OpenAI-Powered Coding Assistant Chatbot Initialized!");
console.log("Type your programming questions below.");
console.log("Type 'exit' to gracefully close the application.");
console.log("====================================================\n");

// Continuous dialogue loop
function askQuestion() {
  rl.question("\x1b[36mYou:\x1b[0m ", async (userInput) => {
    const cleanedInput = userInput.trim();

    // Graceful exit condition
    if (cleanedInput.toLowerCase() === "exit") {
      console.log("\n👋 Goodbye! Happy coding!");
      rl.close();
      process.exit(0);
    }

    if (!cleanedInput) {
      askQuestion();
      return;
    }

    // Append user input to history to maintain context
    conversationHistory.push({ role: "user", content: cleanedInput });

    try {
      process.stdout.write("\x1b[33mBot is thinking...\x1b[0m\r");

      // 4. Request completion using OpenAI SDK over GitHub's service
      const response = await openai.chat.completions.create({
        messages: conversationHistory,
        model: modelName,
        temperature: 0.7,
        max_tokens: 1000,
      });

      // Clear the "thinking..." placeholder
      process.stdout.write("                                \r");

      const botReply = response.choices[0].message.content;

      // Print the response to the user
      console.log(`\n\x1b[32mBot:\x1b[0m ${botReply}\n`);

      // Append assistant response to history to sustain multi-turn context
      conversationHistory.push({ role: "assistant", content: botReply });

    } catch (error) {
      process.stdout.write("                                \r");
      console.error("\n❌ Error communicating with the GitHub AI API.");
      console.error(`Details: ${error.message}`);
      console.log("Please verify your internet connection or your GITHUB_TOKEN.\n");
      
      // Remove failed prompt from history context
      conversationHistory.pop();
    }

    // Keep loop active
    askQuestion();
  });
}

// Start loop execution
askQuestion();