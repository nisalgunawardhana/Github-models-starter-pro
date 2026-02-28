/**
 * ASSESSMENT TASK - MULTI-TURN CODING ASSISTANT CHATBOT
 * 
 * This file serves as the main assignment for creating a sophisticated coding assistant
 * chatbot using the GPT-4o model through GitHub's AI inference API.
 * 
 * OBJECTIVE:
 * Create a multi-turn conversational chatbot that provides meaningful coding guidance
 * and assistance to developers. The chatbot should maintain conversation context
 * across multiple exchanges and provide helpful, accurate coding advice.
 * 
 * REQUIREMENTS TO IMPLEMENT:
 * 1. Environment Setup:
 *    - Load environment variables using the `dotenv` package
 *    - Initialize the OpenAI API client with GitHub token authentication
 *    - Configure the endpoint to use GitHub's AI inference service
 * 
 * 2. Multi-turn Conversation Logic:
 *    - Implement a conversation loop that maintains context
 *    - Store conversation history to preserve context across exchanges
 *    - Handle user input and AI responses in a continuous dialogue
 * 
 * 3. Coding Assistance Features:
 *    - Provide meaningful coding guidance based on user queries
 *    - Support various programming languages and concepts
 *    - Offer code examples, explanations, and best practices
 *    - Handle debugging help and code review suggestions
 * 
 * EXAMPLE INTERACTIONS:
 * User: "How do I create a function in JavaScript?"
 * Bot: "You can create a function using the `function` keyword or as an arrow function. Here's an example: ..."
 * 
 * User: "Can you help me debug this code?"
 * Bot: "I'd be happy to help debug your code. Please share the code and describe the issue you're experiencing..."
 * 
 * TECHNICAL IMPLEMENTATION NOTES:
 * - Use the OpenAI SDK with GitHub's models endpoint
 * - Implement proper error handling for API calls
 * - Consider user experience with clear prompts and responses
 * - Maintain conversation state throughout the session
 * - Allow graceful exit from the conversation
 */

import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

// 1. ENVIRONMENT SETUP
// Load environment variables using the `dotenv` package
dotenv.config();
// Get GitHub token for API authentication
const token = process.env["GITHUB_TOKEN"];
// GitHub's AI inference endpoint
const endpoint = "https://models.github.ai/inference";
// GPT-4o model for conversational AI
const modelName = "openai/gpt-4o";

export async function main() {
  // Initialize the OpenAI API client with GitHub token authentication
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Set up readline interface for command-line interaction
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // 2. MULTI-TURN CONVERSATION LOGIC
  // Initialize conversation with system message to define AI behavior
  let messages = [
    {
      role: "system",
      content: `You are an expert coding assistant chatbot designed to help developers with high-quality programming guidance and support.

YOUR RESPONSIBILITIES:
1. Provide meaningful coding guidance based on user queries
2. Support various programming languages and concepts (JavaScript, Python, Java, C++, C#, Go, Rust, TypeScript, etc.)
3. Offer code examples, explanations, and best practices
4. Help with debugging code and identifying issues
5. Provide code review suggestions and improvements
6. Explain complex programming concepts in clear, accessible language
7. Suggest optimizations and performance improvements
8. Help with architecture and design patterns
9. Provide accurate and tested code solutions

INTERACTION GUIDELINES:
- Always provide clear, well-commented code examples when relevant
- Explain the "why" behind recommendations, not just the "how"
- Break down complex problems into manageable steps
- Ask clarifying questions if the request is ambiguous
- Acknowledge edge cases and limitations in your suggestions
- Be patient and encouraging, especially for beginners
- Keep responses focused and concise while remaining thorough
- Use proper syntax highlighting with markdown code blocks

RESPONSE FORMAT:
- For code questions: provide examples with explanations
- For debugging: analyze the issue, explain the problem, and provide solutions
- For best practices: explain why something is recommended
- Always maintain context from previous messages in the conversation

Remember: You are here to help developers learn and improve their coding skills.`
    }
  ];

  // Recursive function to handle continuous conversation
  // This maintains conversation state and allows graceful exit
  async function chatLoop() {
    rl.question("You: ", async (input) => {
      // Handle exit command to end conversation
      if (input.trim().toLowerCase() === "exit") {
        console.log(
          "Assistant: Thank you for using the Coding Assistant! Happy coding!"
        );
        rl.close();
        return;
      }

      // Skip empty input
      if (input.trim() === "") {
        chatLoop();
        return;
      }

      // Store conversation history to preserve context across exchanges
      messages.push({ role: "user", content: input });

      try {
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
      } catch (error) {
        console.error("Error calling the API:", error.message);
      }

      // Continue the conversation loop
      chatLoop();
    });
  }

  // Provide user instructions and start the conversation
  console.log("=".repeat(60));
  console.log("Welcome to the Coding Assistant Chatbot!");
  console.log("=".repeat(60));
  console.log(
    'Ask me anything about coding, debugging, best practices, or programming concepts.'
  );
  console.log('Type "exit" to quit the chat at any time.');
  console.log("-".repeat(60));
  chatLoop();
}

// Execute main function with error handling
main().catch((err) => {
  console.error("The application encountered an error:", err);
});
