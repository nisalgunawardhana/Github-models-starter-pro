/**
 * MULTI-TURN CONVERSATIONAL CHATBOT
 * 
 * This file demonstrates how to create an interactive chatbot that maintains conversation context
 * across multiple exchanges. The application:
 * 1. Sets up a readline interface for user input/output
 * 2. Maintains a conversation history array to preserve context
 * 3. Continuously loops to accept user input and provide AI responses
 * 4. Allows users to exit the conversation by typing "exit"
 * 
 * Key concepts demonstrated:
 * - Persistent conversation memory using message arrays
 * - Interactive command-line interface with readline
 * - Asynchronous conversation loops
 * - Context preservation across multiple API calls
 * - Graceful exit handling
 * 
 * This shows how to build chatbots that can maintain coherent, contextual conversations
 * rather than treating each interaction as isolated.
 */

import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables for secure token management
dotenv.config();
// Get GitHub token for API authentication
const token = process.env["GITHUB_TOKEN"];
// GitHub's AI inference endpoint
const endpoint = "https://models.github.ai/inference";
// GPT-4o model for conversational AI
const modelName = "openai/gpt-4o";

export async function main() {
  // Initialize OpenAI client with GitHub's endpoint
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Set up readline interface for command-line interaction
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Initialize conversation with system message to define AI behavior
  let messages = [
    { role: "system", content: "You are a helpful assistant." }
  ];

  // Recursive function to handle continuous conversation
  async function chatLoop() {
    rl.question('You: ', async (input) => {
      // Check for exit command to end conversation
      if (input.trim().toLowerCase() === "exit") {
        rl.close();
        return;
      }
      // Add user message to conversation history
      messages.push({ role: "user", content: input });

      // Send entire conversation history to maintain context
      const response = await client.chat.completions.create({
        messages,
        model: modelName
      });

      // Extract and display AI response
      const reply = response.choices[0].message.content;
      console.log("Assistant:", reply);
      // Add AI response to conversation history for future context
      messages.push({ role: "assistant", content: reply });

      // Continue the conversation loop
      chatLoop();
    });
  }

  // Provide user instructions and start the conversation
  console.log('Type "exit" to quit the chat at any time.');
  chatLoop();
}

// Execute main function with error handling
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});