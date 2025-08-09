/**
 * FUNCTION CALLING / TOOL USAGE DEMONSTRATION
 * 
 * This file demonstrates the advanced function calling capabilities of GPT-4o, allowing the AI
 * to interact with external functions and tools to provide more accurate and dynamic responses.
 * The application:
 * 1. Defines a mock flight information function that returns flight details
 * 2. Registers this function as a "tool" that the AI can call
 * 3. Sends a user query that requires flight information
 * 4. Handles the AI's request to call the function
 * 5. Provides the function result back to the AI for final response formatting
 * 
 * Key concepts demonstrated:
 * - Function/tool definition with JSON schema
 * - Tool registration and parameter specification
 * - Multi-step conversation flow with function calls
 * - Dynamic function execution based on AI requests
 * - Result integration and response formatting
 * 
 * This showcases how AI models can be extended with external capabilities,
 * making them more practical for real-world applications requiring live data
 * or specific computations.
 */

import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables for API authentication
dotenv.config();
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

/**
 * Mock function to simulate flight information lookup
 * In a real application, this would connect to actual flight APIs
 * 
 * @param {Object} params - Flight search parameters
 * @param {string} params.originCity - Departure city
 * @param {string} params.destinationCity - Arrival city
 * @returns {string} JSON string with flight information or error
 */
function getFlightInfo({originCity, destinationCity}){
  // Mock data for demonstration - would be real API call in production
  if (originCity === "Seattle" && destinationCity === "Miami"){
    return JSON.stringify({
      airline: "Delta",
      flight_number: "DL123",
      flight_date: "July 16th, 2025",
      flight_time: "10:00AM"
    });
  }
  return JSON.stringify({error: "No flights found between the cities"});
}

/**
 * Function registry mapping function names to their implementations
 * This allows dynamic function calling based on AI requests
 */
const namesToFunctions = {
  getFlightInfo: (data) =>
  getFlightInfo(data),
};

export async function main() {
  
  // Define the tool/function schema that the AI can use
  const tool = {
    "type": "function",
    "function": {
      name: "getFlightInfo",
      // Description helps the AI understand when and how to use this function
      description: "Returns information about the next flight between two cities." +
               "This includes the name of the airline, flight number and the date and time" +
               "of the next flight",
      // JSON schema defining the required parameters
      parameters: {
        "type": "object",
        "properties": {
          "originCity": {
            "type": "string",
            "description": "The name of the city where the flight originates",
          },
          "destinationCity": {
            "type": "string", 
            "description": "The flight destination city",
          },
        },
        "required": [
          "originCity",
          "destinationCity"
        ],
      }
    }
  };
  
  // Initialize OpenAI client
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  
  // Initialize conversation with system message and user query
  let messages=[
      {role: "system", content: "You an assistant that helps users find flight information."},
      {role: "user", content: "I'm interested in going to Miami. What is the next flight there from Seattle?"},
  ];
  
  // Send initial request with tool availability
  let response = await client.chat.completions.create({
    messages: messages,
    tools: [tool], // Make the flight info function available to the AI
    model: modelName
  });
  
  // Check if the AI wants to call our function
  if (response.choices[0].finish_reason === "tool_calls"){
  
    // Add the AI's response (including tool call request) to conversation history
    messages.push(response.choices[0].message);

    // Process the tool call (expecting one function call)
    if (response.choices[0].message && response.choices[0].message.tool_calls.length === 1){

      const toolCall = response.choices[0].message.tool_calls[0];
      // Verify it's a function call as expected
      if (toolCall.type === "function"){
        const toolCall = response.choices[0].message.tool_calls[0];
        // Extract function arguments and execute the function
        const functionArgs = JSON.parse(toolCall.function.arguments);
        console.log(`Calling function \`${toolCall.function.name}\` with arguments ${toolCall.function.arguments}`);
        const callableFunc = namesToFunctions[toolCall.function.name];
        const functionReturn = callableFunc(functionArgs);
        console.log(`Function returned = ${functionReturn}`);
      
        // Add the function result to the conversation
        messages.push(
          {
             "tool_call_id": toolCall.id,
             "role": "tool",
             "name": toolCall.function.name,
             "content": functionReturn,
          }
        )

        // Send the complete conversation (with function result) back to AI for final response
        response = await client.chat.completions.create({
          messages: messages,
          tools: [tool],
          model: modelName
        });
      // Display the AI's final response that incorporates the function result
      console.log(`Model response = ${response.choices[0].message.content}`);
      }
    }
  }
}

// Execute main function with error handling
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});