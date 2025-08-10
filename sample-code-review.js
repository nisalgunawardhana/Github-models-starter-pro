/**
 * AUTOMATED CODE REVIEW & ANALYSIS DEMONSTRATION
 * 
 * This file demonstrates GPT-5's advanced code analysis capabilities by providing
 * comprehensive code review services. The application:
 * 1. Analyzes code files for potential issues and improvements
 * 2. Provides security vulnerability assessments
 * 3. Suggests performance optimizations and best practices
 * 4. Generates refactored code examples
 * 5. Offers architectural recommendations and design patterns
 * 6. Creates detailed documentation and code explanations
 * 
 * Key concepts demonstrated:
 * - Advanced code analysis using GPT-5's enhanced reasoning
 * - Multi-dimensional code review (security, performance, maintainability)
 * - Language-specific best practices and patterns
 * - Automated documentation generation
 * - Code quality scoring and improvement recommendations
 * - Interactive code review workflow
 * 
 * This showcases GPT-5's ability to understand complex code structures,
 * identify potential issues, and provide actionable improvement suggestions
 * across multiple programming languages and paradigms.
 */

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { readFileSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import readline from "readline";

// Configure API credentials and model
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5";

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Supported file extensions for code analysis
const supportedExtensions = {
  '.js': 'JavaScript',
  '.ts': 'TypeScript', 
  '.py': 'Python',
  '.java': 'Java',
  '.cpp': 'C++',
  '.c': 'C',
  '.cs': 'C#',
  '.go': 'Go',
  '.rs': 'Rust',
  '.php': 'PHP',
  '.rb': 'Ruby',
  '.swift': 'Swift',
  '.kt': 'Kotlin'
};

// Code review categories and scoring
const reviewCategories = {
  security: 'Security & Vulnerability Assessment',
  performance: 'Performance & Optimization',
  maintainability: 'Code Maintainability & Readability',
  bestPractices: 'Best Practices & Conventions',
  architecture: 'Architecture & Design Patterns',
  testing: 'Testing & Error Handling'
};

// Utility function for user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Initialize AI client
function createClient() {
  return ModelClient(
    endpoint,
    new AzureKeyCredential(token)
  );
}

// Comprehensive code analysis
async function analyzeCode(code, language, filename) {
  const client = createClient();
  
  const analysisPrompt = `Perform a comprehensive code review and analysis of this ${language} code:

FILENAME: ${filename}
CODE:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide a detailed analysis covering:

1. **SECURITY ANALYSIS** (Score: /10)
   - Identify potential security vulnerabilities
   - Check for input validation issues
   - Look for injection attack vectors
   - Assess authentication/authorization concerns

2. **PERFORMANCE ANALYSIS** (Score: /10)
   - Identify performance bottlenecks
   - Suggest optimization opportunities
   - Check for inefficient algorithms or data structures
   - Memory usage considerations

3. **CODE QUALITY** (Score: /10)
   - Readability and maintainability assessment
   - Code organization and structure
   - Naming conventions and clarity
   - Code complexity analysis

4. **BEST PRACTICES** (Score: /10)
   - Language-specific best practices
   - Design patterns usage
   - Error handling implementation
   - Code documentation quality

5. **IMPROVEMENT SUGGESTIONS**
   - Prioritized list of specific improvements
   - Code refactoring recommendations
   - Architecture suggestions if applicable

6. **OVERALL SCORE**: X/40 with summary

Format your response clearly with markdown headers and provide specific line numbers when referencing issues.`;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "system", 
          content: `You are a senior software engineer and code review expert with expertise in ${language} and software best practices. Provide thorough, constructive, and actionable code reviews. Be specific about issues and provide concrete improvement suggestions.`
        },
        { role: "user", content: analysisPrompt }
      ],
      model: model,
      temperature: 0.3,
      max_tokens: 1500
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// Generate refactored code based on analysis
async function generateRefactoredCode(originalCode, language, analysisResults) {
  const client = createClient();
  
  const refactorPrompt = `Based on the following code analysis, provide a refactored version of the code that addresses the identified issues:

ORIGINAL CODE:
\`\`\`${language.toLowerCase()}
${originalCode}
\`\`\`

ANALYSIS RESULTS:
${analysisResults}

Please provide:
1. **REFACTORED CODE** - Complete improved version
2. **KEY CHANGES MADE** - Bulleted list of specific improvements
3. **RATIONALE** - Explanation of why each change improves the code

Focus on the most impactful improvements that address security, performance, and maintainability concerns.`;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "system", 
          content: `You are an expert software engineer specializing in code refactoring and optimization. Provide clean, efficient, and well-documented refactored code that follows ${language} best practices.`
        },
        { role: "user", content: refactorPrompt }
      ],
      model: model,
      temperature: 0.2,
      max_tokens: 1200
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// Generate comprehensive documentation
async function generateDocumentation(code, language, filename) {
  const client = createClient();
  
  const docPrompt = `Generate comprehensive technical documentation for this ${language} code:

FILENAME: ${filename}
CODE:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Provide:
1. **OVERVIEW** - Purpose and functionality summary
2. **API DOCUMENTATION** - Functions, classes, and methods with parameters
3. **USAGE EXAMPLES** - Code examples showing how to use the module
4. **DEPENDENCIES** - Required libraries and imports
5. **CONFIGURATION** - Setup and configuration requirements
6. **TROUBLESHOOTING** - Common issues and solutions

Format as professional technical documentation with clear sections and examples.`;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "system", 
          content: `You are a technical writer and software documentation expert. Create clear, comprehensive, and user-friendly documentation that helps developers understand and use the code effectively.`
        },
        { role: "user", content: docPrompt }
      ],
      model: model,
      temperature: 0.4,
      max_tokens: 1000
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return response.body.choices[0].message.content;
}

// Display supported file types
function displaySupportedTypes() {
  console.log("\n🔍 Supported File Types for Code Analysis:");
  console.log("=".repeat(50));
  Object.entries(supportedExtensions).forEach(([ext, lang]) => {
    console.log(`${ext.padEnd(6)} - ${lang}`);
  });
  console.log("=".repeat(50));
}

// Main code review function
export async function main() {
  console.log("🔍 Advanced Code Review & Analysis Tool powered by GPT-5");
  console.log("Comprehensive code analysis with security, performance, and quality insights\n");

  try {
    displaySupportedTypes();
    
    const mode = await askQuestion("\nChoose mode:\n1. Analyze file from current directory\n2. Analyze code snippet\nEnter choice (1 or 2): ");

    let code, language, filename;

    if (mode === "1") {
      // File analysis mode
      filename = await askQuestion("Enter filename to analyze: ");
      
      try {
        code = readFileSync(filename, 'utf-8');
        const ext = extname(filename).toLowerCase();
        language = supportedExtensions[ext];
        
        if (!language) {
          console.log(`⚠️  Warning: ${ext} files are not explicitly supported, but I'll analyze as generic code.`);
          language = "Generic";
        }
      } catch (error) {
        console.error(`❌ Error reading file: ${error.message}`);
        return;
      }
    } else {
      // Code snippet mode
      console.log("\nPaste your code snippet (end with 'END' on a new line):");
      let codeLines = [];
      let line;
      while ((line = await askQuestion("")) !== "END") {
        codeLines.push(line);
      }
      code = codeLines.join('\n');
      filename = await askQuestion("Enter language (e.g., JavaScript, Python, Java): ");
      language = filename;
      filename = `snippet.${filename.toLowerCase()}`;
    }

    if (code.trim().length === 0) {
      console.log("❌ No code provided for analysis.");
      return;
    }

    console.log(`\n🔄 Analyzing ${language} code (${code.length} characters)...\n`);

    // Perform comprehensive analysis
    console.log("📊 Running comprehensive code analysis...");
    const analysis = await analyzeCode(code, language, filename);
    
    console.log("\n" + "=".repeat(80));
    console.log("📋 CODE ANALYSIS RESULTS");
    console.log("=".repeat(80));
    console.log(analysis);

    // Ask if user wants refactored code
    const wantRefactor = await askQuestion("\n🛠️  Would you like to see refactored code? (y/n): ");
    if (wantRefactor.toLowerCase() === 'y') {
      console.log("\n🔄 Generating refactored code...");
      const refactoredCode = await generateRefactoredCode(code, language, analysis);
      
      console.log("\n" + "=".repeat(80));
      console.log("🚀 REFACTORED CODE & IMPROVEMENTS");
      console.log("=".repeat(80));
      console.log(refactoredCode);
    }

    // Ask if user wants documentation
    const wantDocs = await askQuestion("\n📚 Would you like to generate documentation? (y/n): ");
    if (wantDocs.toLowerCase() === 'y') {
      console.log("\n🔄 Generating documentation...");
      const documentation = await generateDocumentation(code, language, filename);
      
      console.log("\n" + "=".repeat(80));
      console.log("📖 GENERATED DOCUMENTATION");
      console.log("=".repeat(80));
      console.log(documentation);
      
      // Offer to save documentation
      const saveDocs = await askQuestion("\n💾 Save documentation to file? (y/n): ");
      if (saveDocs.toLowerCase() === 'y') {
        const docFilename = `${basename(filename, extname(filename))}_documentation.md`;
        writeFileSync(docFilename, documentation);
        console.log(`✅ Documentation saved to: ${docFilename}`);
      }
    }

    console.log("\n🎉 Code review complete! GPT-5 has analyzed your code for security, performance, and quality improvements.");

  } catch (error) {
    console.error("❌ Code analysis error:", error);
  } finally {
    rl.close();
  }
}

// Execute the main function if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("The code review sample encountered an error:", err);
    process.exit(1);
  });
}
