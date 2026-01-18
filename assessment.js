

// Import required modules
import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables from .env file
dotenv.config();

// Get GitHub token from environment variables
const token = process.env["GITHUB_TOKEN"];

// Set up API endpoint and model configuration
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

/**
 * Main function to run the multi-turn coding assistant chatbot
 */
export async function main() {
  // Initialize OpenAI client with GitHub's endpoint and token
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Set up readline interface for interactive command-line input/output
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Initialize conversation history with system message
  // This defines the AI's behavior and expertise
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
   * Recursive function to handle the conversation loop
   * Continuously prompts for user input and provides AI responses
   */
  async function chatLoop() {
    rl.question("\nYou: ", async (userInput) => {
      // Check if user wants to exit the conversation
      if (userInput.trim().toLowerCase() === "exit") {
        console.log("\nAssistant: Goodbye! Happy coding!");
        rl.close();
        return;
      }

      // Ignore empty inputs and continue
      if (userInput.trim() === "") {
        chatLoop();
        return;
      }

      try {
        // Add user message to conversation history to maintain context
        messages.push({ role: "user", content: userInput });

        // Send the entire conversation history to the API
        // This allows the model to understand context from previous exchanges
        const response = await client.chat.completions.create({
          messages: messages,
          model: modelName,
          temperature: 0.7,      // Balanced between creativity and consistency
          top_p: 0.9,            // Nucleus sampling for diversity
          max_tokens: 2000       // Allow longer responses for coding explanations
        });

        // Extract the assistant's response
        const assistantReply = response.choices[0].message.content;

        // Display the response to the user
        console.log("\nAssistant:", assistantReply);

        // Add assistant's response to conversation history for context preservation
        messages.push({ role: "assistant", content: assistantReply });

        // Continue the conversation loop
        chatLoop();
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("\nError communicating with the assistant:", error.message);
        // Continue the conversation even if there's an error
        chatLoop();
      }
    });
  }

  // Display welcome message and instructions to the user
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

  // Start the conversation loop
  chatLoop();
}

// Execute the main function with error handling
main().catch((err) => {
  console.error("The application encountered an error:", err);
  process.exit(1);
});
