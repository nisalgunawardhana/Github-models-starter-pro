/**
 * INTERACTIVE CREATIVE WRITING & STORYTELLING DEMONSTRATION
 * 
 * This file demonstrates GPT-5's advanced creative writing capabilities by creating
 * an interactive storytelling experience. The application:
 * 1. Generates original stories based on user-provided genres and themes
 * 2. Allows users to influence the story direction through choices
 * 3. Maintains story continuity and character development
 * 4. Provides multiple creative writing styles and formats
 * 5. Demonstrates advanced narrative structure understanding
 * 
 * Key concepts demonstrated:
 * - Creative content generation with GPT-5
 * - Interactive narrative branching based on user input
 * - Genre-specific writing style adaptation
 * - Character consistency across story segments
 * - Dynamic plot development and story pacing
 * - Creative prompt engineering for storytelling
 * 
 * This showcases GPT-5's enhanced creative capabilities and its ability to maintain
 * coherent narratives while adapting to user preferences and choices.
 */

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import readline from "readline";

// Load environment variables and configure API
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5";

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Story state management
let storyHistory = [];
let currentGenre = "";
let mainCharacter = "";

// Available genres for story generation
const genres = {
  1: "Science Fiction",
  2: "Fantasy Adventure", 
  3: "Mystery Thriller",
  4: "Historical Fiction",
  5: "Romantic Comedy",
  6: "Horror",
  7: "Cyberpunk",
  8: "Magical Realism"
};

// Utility function to prompt user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Initialize the AI client
function createClient() {
  return ModelClient(
    endpoint,
    new AzureKeyCredential(token)
  );
}

// Generate story beginning based on user preferences
async function generateStoryBeginning(genre, character, setting, theme) {
  const client = createClient();
  
  const prompt = `Create the opening chapter of a ${genre} story featuring a character named ${character}. 
  Setting: ${setting}
  Theme: ${theme}
  
  Requirements:
  - Write approximately 300 words
  - Establish compelling characters and atmosphere
  - End with a dramatic moment or choice point
  - Use vivid, immersive descriptions
  - Match the tone and style typical of ${genre}
  - Leave the story open for continuation based on reader choices`;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "system", 
          content: `You are a master storyteller and creative writer specializing in ${genre}. Create engaging, well-paced narratives with rich character development and immersive world-building. Always end story segments with clear choice points for the reader.`
        },
        { role: "user", content: prompt }
      ],
      model: model,
      temperature: 0.9,
      max_tokens: 500
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// Continue story based on user choice
async function continueStory(userChoice, previousStory) {
  const client = createClient();
  
  const storyContext = storyHistory.join("\n\n");
  
  const prompt = `Continue the ${currentGenre} story based on the reader's choice: "${userChoice}"
  
  Previous story context:
  ${storyContext}
  
  Requirements:
  - Continue naturally from the previous segment
  - Incorporate the reader's choice meaningfully
  - Maintain character consistency and story tone
  - Write approximately 250 words
  - End with another choice point or dramatic moment
  - Advance the plot significantly`;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "system", 
          content: `You are continuing a ${currentGenre} story. Maintain narrative consistency, character development, and genre conventions. Always provide engaging choices for the reader to influence the story direction.`
        },
        { role: "user", content: prompt }
      ],
      model: model,
      temperature: 0.8,
      max_tokens: 400
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// Generate multiple choice options for story continuation
async function generateChoices(currentStorySegment) {
  const client = createClient();
  
  const prompt = `Based on this story segment, generate 3 distinct and interesting choice options for the reader:

  Story segment:
  ${currentStorySegment}
  
  Provide exactly 3 choices that:
  - Lead to different story directions
  - Are all plausible within the story context
  - Offer varying levels of risk/adventure
  - Maintain the ${currentGenre} genre conventions
  
  Format as:
  1. [Choice option]
  2. [Choice option] 
  3. [Choice option]`;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "system", 
          content: "You are a story consultant creating meaningful choice points for interactive narratives. Focus on choices that create compelling branching paths."
        },
        { role: "user", content: prompt }
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 200
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// Display genre selection menu
function displayGenreMenu() {
  console.log("\n🎭 Creative Writing Studio - Choose Your Genre:");
  console.log("=".repeat(50));
  Object.entries(genres).forEach(([num, genre]) => {
    console.log(`${num}. ${genre}`);
  });
  console.log("=".repeat(50));
}

// Main interactive storytelling function
export async function main() {
  console.log("🌟 Welcome to the Interactive Story Generator powered by GPT-5!");
  console.log("Create unique stories that adapt to your choices and preferences.\n");

  try {
    // Genre selection
    displayGenreMenu();
    const genreChoice = await askQuestion("Select a genre (1-8): ");
    currentGenre = genres[genreChoice] || "Science Fiction";
    
    // Character creation
    mainCharacter = await askQuestion("Enter your main character's name: ");
    const setting = await askQuestion("Describe the setting/world: ");
    const theme = await askQuestion("What theme should the story explore? ");

    console.log(`\n📖 Generating your ${currentGenre} story featuring ${mainCharacter}...\n`);

    // Generate initial story
    const storyBeginning = await generateStoryBeginning(currentGenre, mainCharacter, setting, theme);
    console.log("=".repeat(60));
    console.log(storyBeginning);
    console.log("=".repeat(60));
    
    storyHistory.push(storyBeginning);

    // Interactive story continuation loop
    for (let chapter = 1; chapter <= 5; chapter++) {
      console.log(`\n📚 Chapter ${chapter} Choices:`);
      
      // Generate choices
      const choices = await generateChoices(storyHistory[storyHistory.length - 1]);
      console.log(choices);
      
      const userChoice = await askQuestion("\nEnter your choice (1, 2, or 3) or 'quit' to end: ");
      
      if (userChoice.toLowerCase() === 'quit') {
        console.log("\n📝 Thanks for the creative writing session! Your story will continue in your imagination...");
        break;
      }

      console.log("\n✍️  Continuing your story...\n");
      
      // Continue story based on choice
      const nextSegment = await continueStory(userChoice, storyHistory[storyHistory.length - 1]);
      console.log("=".repeat(60));
      console.log(nextSegment);
      console.log("=".repeat(60));
      
      storyHistory.push(nextSegment);
    }

    console.log("\n🎉 Story generation complete! Your creative collaboration with GPT-5 has created a unique narrative.");
    
  } catch (error) {
    console.error("❌ Story generation error:", error);
  } finally {
    rl.close();
  }
}

// Execute the main function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("The creative writing sample encountered an error:", err);
    process.exit(1);
  });
}
