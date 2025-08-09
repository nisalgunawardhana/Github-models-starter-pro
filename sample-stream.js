/**
 * STREAMING RESPONSE DEMONSTRATION
 * 
 * This file demonstrates how to handle streaming responses from the AI model, which provides
 * a more interactive user experience by displaying text as it's generated rather than waiting
 * for the complete response. The application:
 * 1. Sends a request with streaming enabled
 * 2. Processes response chunks in real-time as they arrive
 * 3. Displays text progressively, character by character
 * 4. Tracks and displays token usage statistics
 * 
 * Key concepts demonstrated:
 * - Real-time streaming API responses
 * - Asynchronous iteration over response streams
 * - Progressive text display for better user experience
 * - Token usage monitoring and reporting
 * - Stream configuration options (include_usage)
 * 
 * This is particularly useful for long responses where users want to see output
 * immediately rather than waiting for the entire response to be completed.
 */

import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables for secure API token management
dotenv.config();
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

export async function main() {
  // Initialize OpenAI client with GitHub's AI endpoint
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Create a streaming chat completion request
  const stream = await client.chat.completions.create({
    messages: [
        // System message defines AI behavior
        { role: "system", content: "You are a helpful assistant." },
        // User prompt requesting a comprehensive response (good for demonstrating streaming)
        { role: "user", content: "Give me 5 good reasons why I should exercise every day." },
      ],
      model: modelName,
      stream: true, // Enable streaming mode
      stream_options: {include_usage: true} // Include token usage information
    });

    // Variable to store final usage statistics
    var usage = null;
    // Iterate through the stream of response chunks
    for await (const part of stream) {
      // Output each piece of content as it arrives (real-time display)
      process.stdout.write(part.choices[0]?.delta?.content || '');
      // Capture usage statistics when available
	  if (part.usage){
		usage = part.usage;
      }
    }
    // Add final newline after streaming is complete
    process.stdout.write('\n');
    
    // Display token usage statistics if available
    if (usage) {
	  process.stdout.write(`Prompt tokens: ${usage.prompt_tokens}\n`);
	  process.stdout.write(`Completion tokens: ${usage.completion_tokens}\n`);
	  process.stdout.write(`Total tokens: ${usage.total_tokens}\n`);
    }
}

// Execute main function with error handling
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});