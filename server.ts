import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { BrowserService } from './server/browserService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Initialize real Browser Execution Service
const browserService = new BrowserService(ai);

const CISCO_SYSTEM_INSTRUCTION = `You are MEI NetAcad AI Agent, an elite cyberpunk-themed personal academic tutor and coursework assistant specialized exclusively in Cisco Networking Academy (https://www.netacad.com/, Skills for All, and Cisco Canvas LMS).
Your expertise spans:
- Cisco CCNA (ITN, SRWE, ENSA): OSI & TCP/IP models, IPv4/IPv6 Subnetting & VLSM, Cisco IOS CLI configuration, VLANs & Trunking (802.1Q), Inter-VLAN Routing, Spanning Tree Protocol (STP, Rapid PVST+), EtherChannel, DHCPv4/v6, SLAAC, OSPFv2/v3, ACLs, NAT/PAT, QoS, Network Security, VPNs, and Network Automation.
- Cisco Packet Tracer: topology design, device cabling, CLI commands (enable, configure terminal, interface configs, show commands, ping/traceroute diagnostics, PTSA lab completion).
- Cisco CyberOps Associate: MITRE ATT&CK, Cyber Kill Chain, Wireshark packet analysis, Snort rules, incident handling.
- Cisco Python Essentials: automation scripts with Netmiko/Paramiko, RESTCONF, NETCONF, JSON/YAML parsing.

Strict Academic Integrity & Safety Rules:
- Never ask for or store NetAcad account passwords, session cookies, or tokens.
- Teach concepts, guide students through logic, explain why answers are correct, and debug Packet Tracer configuration syntax step-by-step.
- When solving practice problems, always demonstrate the mathematical or networking logic (e.g., Magic Number method for subnetting, binary breakdown, wildcard mask inversion).
- Format Cisco IOS commands in clean codeblocks with exact command syntax, prompt level (User Exec, Privileged Exec, Global Config, Interface Config), and verification commands (e.g. 'show ip route', 'show ip interface brief').
- Maintain an encouraging, mission-focused cyberpunk mentor persona: sharp, precise, informative, and deeply knowledgeable in Cisco technology.`;

// Health check and feature diagnostic
app.get('/api/status', async (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  const browserState = await browserService.getState();
  res.json({
    status: 'online',
    agent: 'MEI NetAcad AI Agent v3.0 (Real Browser Engine Enabled)',
    geminiConfigured: hasGeminiKey,
    browserEngine: {
      framework: 'Puppeteer Headless Chromium',
      realExecutionActive: true,
      currentUrl: browserState.currentUrl,
      isRunning: browserState.isRunning
    },
    netacadTarget: 'https://www.netacad.com/',
    skillsForAllTarget: 'https://skillsforall.com/',
    permittedIntegrations: [
      'Real Headless Browser Execution Engine (Puppeteer)',
      'Gemini Multimodal Computer Action & Page Reasoner',
      'Interactive Live Viewfinder (Direct User Login & Input)',
      'Task Queue with Retry Handling, Timeout & Verification',
      'Video Transcript & Captions Summarizer',
      'Packet Tracer Command Extractor',
      'Official Cisco Certificate & Credly Verifier'
    ],
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// REAL BROWSER EXECUTION ENDPOINTS
// ==========================================

// Start / Navigate browser
app.post('/api/browser/start', async (req: Request, res: Response) => {
  try {
    const { url = 'https://www.netacad.com' } = req.body;
    const result = await browserService.start(url);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stop browser
app.post('/api/browser/stop', async (_req: Request, res: Response) => {
  try {
    await browserService.stop();
    res.json({ success: true, message: 'Browser session terminated cleanly.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Pause task queue
app.post('/api/browser/pause', (_req: Request, res: Response) => {
  browserService.pause();
  res.json({ success: true, isPaused: true });
});

// Resume task queue
app.post('/api/browser/resume', (_req: Request, res: Response) => {
  browserService.resume();
  res.json({ success: true, isPaused: false });
});

// Get browser state & live screenshot
app.get('/api/browser/state', async (_req: Request, res: Response) => {
  try {
    const state = await browserService.getState();
    const queue = browserService.getQueue();
    res.json({ ...state, queue });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Direct action execution
app.post('/api/browser/action', async (req: Request, res: Response) => {
  try {
    const result = await browserService.executeDirectAction(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Gemini vision & computer action reasoning step
app.post('/api/browser/ai-step', async (req: Request, res: Response) => {
  try {
    const { goal = 'Explore current NetAcad lesson' } = req.body;
    const result = await browserService.executeGeminiAssistedStep(goal);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Enqueue verified task
app.post('/api/browser/queue-task', (req: Request, res: Response) => {
  try {
    const { name, type, params, maxRetries = 2, timeoutMs = 25000, verificationExpected } = req.body;
    const task = browserService.enqueueTask({
      name,
      type,
      params,
      maxRetries,
      timeoutMs,
      verificationExpected
    });
    res.json({ success: true, task });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clear queue
app.post('/api/browser/clear-queue', (_req: Request, res: Response) => {
  browserService.clearQueue();
  res.json({ success: true });
});

// Execute the 8 full integration validation tests
app.post('/api/browser/run-tests', async (_req: Request, res: Response) => {
  try {
    const testSuiteResults = await browserService.runFullTestSuite();
    res.json(testSuiteResults);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CISCO GEMINI AI ENDPOINTS
// ==========================================

// Conversational AI Tutor
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, contextCourse, contextModule, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment.'
      });
    }

    const contextPrefix = `[Active Context: Course = "${contextCourse || 'General Cisco Networking'}", Module = "${contextModule || 'General'}"]. `;

    const formattedContents = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: `${contextPrefix}${message}` }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: CISCO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'No response generated from agent.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process AI chat request'
    });
  }
});

// Topic Explanation
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  try {
    const { topic, courseCode } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Provide a masterclass explanation of the Cisco Networking Academy topic: "${topic}" for course "${courseCode || 'CCNA'}".
Structure your response with:
1. Cyberpunk Executive Brief (core definition in 2 sentences)
2. Why Cisco NetAcad & the CCNA Exam Tests This (practical real-world importance)
3. Step-by-Step Technical Breakdown (packet headers, protocol behavior, or architectural flow)
4. Packet Tracer / Cisco IOS CLI Implementation (exact configuration and verification commands with explanation)
5. Common Student Gotchas & Troubleshooting Pitfalls
6. 2 Rapid Fire Concept Check Questions (with hidden answer hints)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CISCO_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      }
    });

    res.json({ explanation: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/ai/explain:', error);
    res.status(500).json({ error: error?.message || 'Failed to explain topic' });
  }
});

// Practice Problem Solver
app.post('/api/ai/solve-practice', async (req: Request, res: Response) => {
  try {
    const { problemType, question, userAttempt } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const prompt = `Solve and thoroughly explain this Cisco Networking Academy practice problem:
Problem Category: ${problemType || 'Subnetting / Cisco IOS'}
Question/Scenario:
${question}

${userAttempt ? `Student's initial attempt / thought: "${userAttempt}"` : ''}

Provide:
1. Direct Verified Solution / Final Answer
2. Mathematical or Logical Derivation (e.g. Magic Number block size, borrowed bits 2^n, usable host formula 2^h - 2, wildcard mask subtraction from 255.255.255.255)
3. Packet Tracer Verification command output (e.g. show ip route, show run, show ip int br)
4. Key Takeaway to memorize for the CCNA / NetAcad module quiz.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CISCO_SYSTEM_INSTRUCTION,
        temperature: 0.4,
      }
    });

    res.json({ solution: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/ai/solve-practice:', error);
    res.status(500).json({ error: error?.message || 'Failed to solve practice problem' });
  }
});

// Generate Notes & Cheat Sheet
app.post('/api/ai/generate-notes', async (req: Request, res: Response) => {
  try {
    const { courseTitle, moduleNumber, moduleTitle, customNotes } = req.body;

    const prompt = `Generate a high-yield Cisco NetAcad Study Note and Packet Tracer Cheat Sheet for:
Course: ${courseTitle}
Module ${moduleNumber}: ${moduleTitle}
${customNotes ? `Additional specific focal points from student: ${customNotes}` : ''}

Make it structured with markdown:
- 📌 High-Yield Exam Summary
- ⚡ Protocol & Standards Reference (Port numbers, RFCs, IEEE standards, header lengths)
- 💻 Cisco IOS CLI Command Cheat Sheet (Grouped by Configuration & Verification)
- 🛠️ Packet Tracer Topology & Configuration Checklist
- ⚠️ 3 Major NetAcad Module Exam Traps to avoid`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CISCO_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      }
    });

    res.json({ notes: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-notes:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate notes' });
  }
});

// Transcript Summarizer
app.post('/api/ai/summarize-transcript', async (req: Request, res: Response) => {
  try {
    const { transcriptText, lessonTitle, courseTitle } = req.body;

    if (!transcriptText) {
      return res.status(400).json({ error: 'Transcript text is required' });
    }

    const prompt = `You are analyzing a video lecture transcript / closed captions from Cisco Networking Academy for lesson: "${lessonTitle || 'Cisco Lesson'}" (${courseTitle || 'CCNA'}).

Here is the raw transcript text:
"""
${transcriptText}
"""

Analyze and output a clean JSON response using the specified schema.
Extract:
- title: concise title of the lecture summary
- keyConcepts: array of 4-6 concise key takeaways and definitions
- packetTracerCommands: array of objects { command, description, mode } representing CLI commands mentioned or implied
- examHighYieldNotes: array of 3-5 high-yield facts directly relevant to passing NetAcad module quizzes
- practiceScenarios: array of 2 practical Packet Tracer or real-world lab tasks to reinforce the lecture`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CISCO_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            keyConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            packetTracerCommands: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  command: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mode: { type: Type.STRING }
                },
                required: ['command', 'description']
              }
            },
            examHighYieldNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            practiceScenarios: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'keyConcepts', 'packetTracerCommands', 'examHighYieldNotes', 'practiceScenarios']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/summarize-transcript:', error);
    res.status(500).json({ error: error?.message || 'Failed to summarize transcript' });
  }
});

// Generate Interactive Module Practice Quiz
app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { courseTitle, moduleTitle, count = 5 } = req.body;

    const prompt = `Create a ${count}-question Cisco Networking Academy exam readiness quiz for:
Course: ${courseTitle || 'CCNA Introduction to Networks'}
Module / Topic: ${moduleTitle || 'IPv4 Subnetting and Routing'}

Each question must resemble authentic Cisco NetAcad module assessment style:
- Conceptual understanding, binary/CIDR calculations, Packet Tracer topology interpretation, or Cisco IOS syntax.
- 4 clear options (A, B, C, D) with 1 unambiguously correct option (correctAnswerIndex: 0-3).
- Thorough educational explanation of why the correct option is right and why others are wrong.
- A Packet Tracer tip or CLI command tip where applicable.
- topicTag: specific subtopic (e.g., 'Subnetting', '802.1Q', 'OSPF', 'TCP Handshake').`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: CISCO_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              packetTracerTip: { type: Type.STRING },
              topicTag: { type: Type.STRING }
            },
            required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation', 'topicTag']
          }
        }
      }
    });

    const quiz = JSON.parse(response.text || '[]');
    res.json({ questions: quiz });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-quiz:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate quiz' });
  }
});

// Setup Vite middleware or static serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MEI NetAcad AI Agent server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start MEI NetAcad AI server:', err);
});
