import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import path from 'path'; // For handling file paths
import fs from 'fs/promises'; // For reading files asynchronously
import { fileURLToPath } from 'url'; // For __dirname in ES modules

// Load environment variables from .env file
dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Render will provide the PORT environment variable. Fallback to 3000 for local development.
const port = process.env.PORT || 3000;

// Configure CORS
// IMPORTANT: Adjust the 'origin' to your actual frontend domain(s) in production.
app.use(cors({
    origin: [
        'http://localhost:3000', // For local frontend development (if you still run your frontend locally)
        'http://localhost:5000', // Default Firebase Hosting emulator URL
        'http://127.0.0.1:5000', // Alternative Firebase Hosting emulator URL
        'https://studentvoiceplatform.web.app',          // REPLACE with your actual project ID
        'https://studentvoiceplatform.firebaseapp.com' // REPLACE with your actual project ID
    ]
}));
app.use(express.json()); // Middleware to parse JSON request bodies

// --- Firebase Configuration ---
// These values are read from your .env file
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Basic check if Firebase config is fully loaded
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.authDomain) {
    console.error("Error: One or more Firebase environment variables are missing. Please check your .env file.");
    process.exit(1); // Exit if Firebase config is incomplete, as the app won't function
}

// --- Google Gemini API Setup ---
// This value is read from your .env file
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    console.error("Error: GEMINI_API_KEY is not set in environment variables!");
    process.exit(1); // Exit if Gemini key is missing
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

// --- Backend API Endpoint for Gemini ---
app.post('/generate-advice', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ advice: text });
    } catch (error) {
        console.error("Error calling Gemini API from backend:", error);
        res.status(500).json({ error: "Failed to get advice from AI. Check backend logs." });
    }
});

// --- Serve HTML files and inject Firebase config ---

// Function to read an HTML file and inject the Firebase config placeholder
async function serveHtmlWithConfig(filePath, res) {
    try {
        let htmlContent = await fs.readFile(filePath, 'utf8');
        // Replace the placeholder string in the HTML with the actual Firebase config object as JSON
        htmlContent = htmlContent.replace(
            'const firebaseConfig = {}; // Placeholder: The server will replace this line',
            `const firebaseConfig = ${JSON.stringify(firebaseConfig)};`
        );
        res.send(htmlContent);
    } catch (error) {
        console.error(`Error serving HTML file ${filePath}:`, error);
        res.status(500).send('Error loading page.');
    }
}

// Serve index.html at the root URL
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'frontend', 'index.html');
    serveHtmlWithConfig(indexPath, res);
});

// Serve admin.html
app.get('/admin.html', (req, res) => {
    const adminPath = path.join(__dirname, '..', 'frontend', 'admin.html');
    serveHtmlWithConfig(adminPath, res);
});

// Serve other static assets (CSS, client-side JS libraries, images etc.)
// from the 'frontend' folder if they are requested directly (e.g., CSS files, Bootstrap JS).
// This line must come AFTER your specific routes like '/' and '/admin.html'
// to ensure those specific routes are handled first.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- Start the backend server ---
// This tells your Express app to listen for incoming requests on the specified port.
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
    // These console logs are helpful for local testing but will appear in Render logs too
    console.log(`Local User Panel: http://localhost:${port}`);
    console.log(`Local Admin Panel: http://localhost:${port}/admin.html`);
});