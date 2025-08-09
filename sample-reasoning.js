/**
 * COMPLEX REASONING AND PROBLEM SOLVING DEMONSTRATION
 * 
 * This file showcases the advanced reasoning capabilities of the o1-preview model by presenting
 * various complex scenarios that require deep thinking and logical analysis. The application:
 * 1. Provides a menu of challenging reasoning scenarios (math, logic, ethics, problem-solving)
 * 2. Allows users to select which type of reasoning challenge to present to the AI
 * 3. Uses the o1-preview model specifically designed for complex reasoning tasks
 * 4. Cleans up markdown formatting from responses for better readability
 * 
 * Key concepts demonstrated:
 * - Advanced reasoning model usage (o1-preview vs standard GPT-4o)
 * - Interactive scenario selection with user-friendly menus
 * - Text processing utilities for cleaning AI responses
 * - Complex problem scenarios that test different types of reasoning:
 *   - Mathematical calculations and analysis
 *   - Logical puzzles and deduction
 *   - Ethical dilemmas and moral reasoning
 *   - Resource allocation and optimization problems
 * 
 * This demonstrates how specialized reasoning models can tackle problems requiring
 * multi-step thinking, logical deduction, and complex analysis.
 */

import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables for secure API access
dotenv.config();
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
// Using o1-preview model specifically designed for complex reasoning tasks
const modelName = "openai/o1-preview";

// Array of predefined reasoning scenarios to test different cognitive abilities
const scenarios = [
    {
        name: "Mathematical Reasoning",
        // Tests calculation skills and understanding of averages with multi-step problems
        prompt: "A train travels 60 miles per hour for 2 hours, then 80 miles per hour for 1.5 hours. What is the average speed for the entire trip?"
    },
    {
        name: "Logic Puzzle",
        // Tests deductive reasoning and logical thinking under constraints
        prompt: "Three people are wearing hats that are either red or blue. Each person can see the other two hats but not their own. They are told that at least one of them is wearing a red hat. If they are asked in turn if they know the color of their own hat, what logical reasoning can they use to figure it out?"
    },
    {
        name: "Complex Problem Solving",
        // Tests resource allocation and constraint satisfaction
        prompt: "You are organizing a conference with three sessions and four speakers. Each speaker can only attend two sessions, and no session can have more than two speakers. How would you assign the speakers to sessions?"
    },
    {
        name: "Ethical Reasoning",
        // Tests moral reasoning and ethical decision-making frameworks
        prompt: "You see a runaway trolley heading towards five people tied up on the tracks. You can pull a lever to divert the trolley onto another track, where it will hit one person. What should you do, and why?"
    }
];

/**
 * Utility function to clean markdown formatting from AI responses
 * This improves readability by removing markdown syntax and formatting
 * 
 * @param {string} text - The text containing markdown formatting
 * @returns {string} - Clean text without markdown syntax
 */
function cleanMarkdownFormatting(text) {
    if (!text) return text;
    
    return text
        // Remove bold markdown (**text** or __text__)
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        // Remove italic markdown (*text* or _text_)
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        // Remove code blocks (```text```)
        .replace(/```[\s\S]*?```/g, (match) => {
            return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
        })
        // Remove inline code (`text`)
        .replace(/`([^`]+)`/g, '$1')
        // Remove headers (# ## ### etc.)
        .replace(/^#+\s*/gm, '')
        // Remove bullet points and list markers
        .replace(/^\s*[-*+]\s+/gm, '• ')
        .replace(/^\s*\d+\.\s+/gm, (match, offset, string) => {
            const num = match.match(/\d+/)[0];
            return `${num}. `;
        })
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * Display the menu of available reasoning scenarios to the user
 * Shows numbered options with brief descriptions for easy selection
 */
function showMenu() {
    console.log("Choose a scenario to run:");
    scenarios.forEach((s, i) => {
        // Truncate long prompts for menu display
        const shortDescription = s.prompt.length > 50 
            ? s.prompt.substring(0, 50) + "..." 
            : s.prompt;
        console.log(`${i + 1}. ${s.name}: ${shortDescription}`);
    });
    console.log("Enter the number of your choice:");
}

export async function main() {
    // Set up readline interface for user input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Display available reasoning scenarios
    showMenu();

    // Handle user selection and process the chosen scenario
    rl.question("> ", async (answer) => {
        const idx = parseInt(answer.trim(), 10) - 1;
        // Validate user input
        if (idx < 0 || idx >= scenarios.length) {
            console.log("Invalid choice.");
            rl.close();
            return;
        }

        // Initialize OpenAI client with reasoning model
        const client = new OpenAI({ baseURL: endpoint, apiKey: token });
        // Send the selected scenario to the reasoning model
        const response = await client.chat.completions.create({
            messages: [
                { role: "user", content: scenarios[idx].prompt }
            ],
            model: modelName
        });

        // Display the AI's reasoning and solution
        console.log("\nAI Response:");
        console.log(cleanMarkdownFormatting(response.choices[0].message.content));
        rl.close();
    });
}

// Execute the main function with error handling
main().catch((err) => {
    console.error("The sample encountered an error:", err);
});
