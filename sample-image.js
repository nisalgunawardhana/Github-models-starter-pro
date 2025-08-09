/**
 * SAMPLE IMAGE ANALYSIS WITH GPT-4o VISION
 * 
 * This file demonstrates how to use GPT-4o's vision capabilities to analyze images.
 * The application:
 * 1. Loads a sample image from the Images folder
 * 2. Converts the image to a base64 data URL format
 * 3. Sends both text and image data to the AI model
 * 4. Receives a detailed description of what's in the image
 * 
 * Key concepts demonstrated:
 * - Multi-modal input handling (text + image)
 * - File system operations for reading image files
 * - Base64 encoding for image data transmission
 * - Error handling for file operations
 * - Vision model configuration and usage
 * 
 * This showcases the multimodal capabilities of modern AI models that can understand
 * and describe visual content alongside text prompts.
 */

import OpenAI from "openai";
import { readFileSync } from "node:fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
// Get GitHub token for API authentication
const token = process.env["GITHUB_TOKEN"];
// GitHub's AI inference endpoint URL
const endpoint = "https://models.github.ai/inference";
// Specify the GPT-4o model for vision capabilities
const modelName = "openai/gpt-4o";

export async function main() {
  // Initialize OpenAI client with GitHub's endpoint and token
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  // Create a chat completion request with both text and image content
  const response = await client.chat.completions.create({
    messages: [
        // System message defines the AI's role for image description
        { role: "system", content: "You are a helpful assistant that describes images in details." },
        // User message contains both text query and image data
        { role: "user", content: [
            { type: "text", text: "What's in this image?"},
            { type: "image_url", image_url: {
                url: getImageDataUrl("sample.jpg", "jpg"), details: "low"}}
          ]
        }
      ],
      model: modelName
    });

  // Output the AI's description of the image
  console.log(response.choices[0].message.content);
}

/**
 * Utility function to convert an image file to a base64 data URL
 * This is required for sending image data to the AI model via API
 * 
 * @param {string} imageFile - The path to the image file.
 * @param {string} imageFormat - The format of the image file. For example: "jpeg", "png".
 * @returns {string} The data URL of the image.
 */
function getImageDataUrl(imageFile, imageFormat) {
  try {
      // Construct the full path to the image in the Images folder
      const imagePath = `Images/${imageFile}`;
      // Read the image file as a buffer
      const imageBuffer = readFileSync(imagePath);
      // Convert the buffer to base64 string
      const imageBase64 = imageBuffer.toString('base64');
      // Return the complete data URL format required by the API
      return `data:image/${imageFormat};base64,${imageBase64}`;
  } catch (error) {
      // Handle file reading errors gracefully
      console.error(`Could not read 'Images/${imageFile}'.`);
      console.error('Set the correct path to the image file before running this sample.');
      process.exit(1);
  }
}

// Execute the main function and handle any errors that occur
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});