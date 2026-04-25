import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
const client = new OpenAI({ baseURL: endpoint, apiKey: token });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


let conversationHistory = [
  { 
    role: "system", 
    content: "You are a professional coding assistant. Provide accurate code examples and debugging help." 
  }
];

async function startChatbot() {
  console.log("\n AI Coding Assistant Started (Type 'exit' to quit)\n");

  const chat = () => {
    rl.question("User: ", async (userInput) => {
      
    
      if (userInput.toLowerCase() === 'exit') {
        console.log("Bot: Goodbye!");
        rl.close();
        return;
      }

      conversationHistory.push({ role: "user", content: userInput });

      try {
        const response = await client.chat.completions.create({
          messages: conversationHistory,
          model: modelName
        });

        const botReply = response.choices[0].message.content;
        console.log(`\nBot: ${botReply}\n`);
        conversationHistory.push({ role: "assistant", content: botReply });

        chat();

      } catch (error) {
        console.error(" API Error:", error.message);
        rl.close();
      }
    });
  };

  chat();
}

startChatbot();