import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Gemini AI client with secure environment variable
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Secure API endpoint for chatbot
  app.post('/api/chat', async (req, res) => {
    const fs = await import('fs');
    const logPath = path.join(process.cwd(), 'chat_debug.log');
    const writeLog = (msg: string) => {
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
    };

    try {
      writeLog("Received request to /api/chat");
      const { message, history } = req.body;
      writeLog(`Message: ${message}, History length: ${history?.length || 0}`);
      
      if (!message) {
        writeLog("Error: message is missing");
        return res.status(400).json({ error: 'Message payload is required' });
      }

      writeLog(`API Key length: ${apiKey.length}`);

      // Convert history to format expected by SDK: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text || '' }]
      }));

      writeLog(`Formatted history: ${JSON.stringify(formattedHistory)}`);

      // Create chat instance with history and instructions
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        history: formattedHistory,
        config: {
          systemInstruction: `You are LynqSwift, the execution-first AI assistant for LYNQUP. 
Your personality is technical, elite, and precise. 
LYNQUP is a platform for the Indian event market that solves 'Messaging Debt' by replacing DMs with structured execution.

FORMATTING RULES:
1. DO NOT use asterisks (*) for bolding or lists. Provide clean plain text.
2. DO NOT use markdown headers or bold symbols.
3. ALWAYS use relevant emojis to enhance the tech-forward personality (e.g., ⚡, 🛰️, 🛡️, 🔗, ⚙️).

CORE SYSTEMS:
- The Shelf: Vetted talent nodes (DJs, Creators, Production, Speakers) priced in Indian Rupees (₹).
- The Engine: GPS Verification for site-sync and Content-Hashing for digital delivery.
- Smart-Escrow: Capital in INR is secured and released only via technical validation.
- Unified Brief: A single sync-point for entire rosters.

Respond with concise, high-impact technical advice. Use terms like 'telemetry', 'protocol', 'execution', and 'sync'. Mention Indian Rupees (₹) where relevant.`,
        },
      });

      writeLog("Created Chat session successfully");

      // Stream the response back to client using Server Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();
      writeLog("Flushed response headers");

      req.on('close', () => {
        writeLog("Request closed by client");
        res.end();
      });

      writeLog("Calling sendMessageStream...");
      const responseStream = await chat.sendMessageStream({ message });
      writeLog("Received response stream promise");

      for await (const chunk of responseStream) {
        if (chunk.text) {
          writeLog(`Streaming chunk: ${chunk.text.slice(0, 30)}...`);
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      writeLog("Finished streaming all chunks. Writing done signal.");
      res.write('data: [DONE]\n\n');
      res.end();

    } catch (error: any) {
      writeLog(`CRITICAL API Error: ${error.message}\nStack: ${error.stack}`);
      res.write(`data: ${JSON.stringify({ error: error.message || 'Signal degradation detected.' })}\n\n`);
      res.end();
    }
  });

  // Serve static assets in production, otherwise mount Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LYNQUP Express Server active on http://localhost:${PORT}`);
  });
}

startServer();
