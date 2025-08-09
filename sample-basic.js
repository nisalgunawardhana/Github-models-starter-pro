/**
 * SAMPLE BASIC GPT-4o IMPLEMENTATION
 * 
 * This file demonstrates the most basic usage of the OpenAI GPT-4o model through GitHub's AI inference API.
 * It performs a simple question-answer interaction where:
 * 1. A system message defines the AI's role as a helpful assistant
 * 2. A user message asks a specific question about geography
 * 3. The AI responds with the answer
 * 
 * Key concepts demonstrated:
 * - Environment variable loading for secure API token management
 * - OpenAI client initialization with custom endpoint (GitHub's AI service)
 * - Basic chat completion request with temperature and token limits
 * - Error handling for API calls
 * 
 * This serves as the foundation for more complex AI interactions shown in other sample files.
 */

// Import the OpenAI SDK and dotenv for environment variable management
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from a .env file into process.env
dotenv.config();

// Get the GitHub token from environment variables
const token = process.env["GITHUB_TOKEN"];

// Set the API endpoint and model name
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

// Define the main async function
export async function main() {
  // Create an OpenAI client with the custom endpoint and API key
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Send a chat completion request to the model
  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." }, // System prompt
      { role: "user", content: "What is the capital of France?" }   // User question
    ],
    temperature: 1.0, // Controls randomness of output
    top_p: 1.0,       // Controls diversity via nucleus sampling
    max_tokens: 1000, // Maximum tokens in the response
    model: modelName  // Model to use
  });

  // Print the assistant's reply to the console
  console.log(response.choices[0].message.content);
}

// Run the main function and handle any errors
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});