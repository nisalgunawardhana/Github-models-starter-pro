import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables
dotenv.config();

const token = process.env.GITHUB_TOKEN;

// Initialize the API client using GitHub's models endpoint
const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token
});

// Setup input/output interface for the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Store conversation history
let conversationHistory = [
    { role: "system", content: "You are a helpful and expert coding assistant." }
];

function startChat() {
    rl.question("User: ", async (userInput) => {
        // Exit condition
        if (userInput.trim().toLowerCase() === 'exit') {
            console.log("Bot: Goodbye! Happy Coding! 👋");
            rl.close();
            return;
        }

        // Add user message to history
        conversationHistory.push({ role: "user", content: userInput });

        try {
            const response = await client.chat.completions.create({
                messages: conversationHistory,
                model: "gpt-4o",
            });

            const botMessage = response.choices[0].message.content;
            console.log(`\nBot: ${botMessage}\n`);

            // Add bot response to history so it remembers
            conversationHistory.push({ role: "assistant", content: botMessage });
            
        } catch (error) {
            console.error("\nError occurred while fetching response:", error.message, "\n");
        }

        // Loop the chat
        startChat();
    });
}

console.log("\nWelcome to the Coding Assistant! (Type 'exit' to quit)\n");
startChat();