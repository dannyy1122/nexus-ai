import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, MessageSquare, Settings, LogOut, Sparkles, X, Key, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I am your AI Nexus assistant. I'm powered by advanced language models to help you with coding, creative writing, and business automation. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      if (apiKey && apiKey.startsWith('gsk_')) {
        // FREE GROQ API INTEGRATION (Llama 3)
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: currentInput }],
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.choices[0].message.content,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else if (apiKey && apiKey.startsWith('sk-')) {
        // PAID OPENAI CALL
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: currentInput }],
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.choices[0].message.content,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // HYPER-REALISTIC GPT SIMULATION (For Video)
        setTimeout(() => {
          const lowerInput = currentInput.toLowerCase();
          let reply = "";

          const techStacks = ["React with TypeScript", "Node.js and Express", "Python with FastAPI", "Next.js 14", "Docker and Kubernetes"];
          const insights = [
            "This approach ensures sub-second latency and high availability.",
            "By utilizing a microservices architecture, we can scale individual components independently.",
            "Implementing advanced caching strategies like Redis would significantly improve throughput.",
            "The integration of vector databases like Pinecone would allow for sophisticated semantic search.",
            "Using a CI/CD pipeline with GitHub Actions ensures rapid and reliable deployment cycles."
          ];
          const randomTech = techStacks[Math.floor(Math.random() * techStacks.length)];
          const randomInsight = insights[Math.floor(Math.random() * insights.length)];

          if (lowerInput.includes("code") || lowerInput.includes("script") || lowerInput.includes("build") || lowerInput.includes("create")) {
            reply = `I'd be happy to help you build that! For a project involving "${currentInput}", I recommend using a modern stack like **${randomTech}**. \n\n### Key Implementation Steps:\n1. **Data Modeling**: Define a robust schema for your entities.\n2. **API Layer**: Build RESTful or GraphQL endpoints to handle client requests.\n3. **Frontend Integration**: Use state management libraries to maintain a fluid user experience.\n\n${randomInsight} \n\nWould you like me to generate a boilerplate for this architecture?`;
          } else if (lowerInput.includes("business") || lowerInput.includes("idea") || lowerInput.includes("market") || lowerInput.includes("grow")) {
            reply = `Analyzing the market potential for "${currentInput}"... \n\nBased on current trends, this niche is experiencing a **25% year-over-year growth**. To capitalize on this, you should focus on:\n\n*   **User Acquisition**: Implement a data-driven marketing strategy.\n*   **Scalability**: Ensure your backend can handle a 10x surge in traffic.\n*   **Monetization**: Consider a tiered subscription model for recurring revenue.\n\nShall I draft a full 12-month business roadmap for this initiative?`;
          } else if (lowerInput.includes("hi") || lowerInput.includes("hello") || lowerInput.includes("hey")) {
            reply = `Greetings! I am Nexus AI, currently operating in **High-Performance Simulation Mode**. I am ready to assist you with complex problem solving, creative drafting, and technical analysis. \n\nHow can I help you push your project forward today?`;
          } else {
            reply = `That is an intriguing query regarding **"${currentInput}"**. \n\nIn my current operational state, I analyze this through a comprehensive lens of data and logic. This topic specifically touches upon the intersection of modern technology and strategic implementation. \n\nIf you provide a valid **Groq (Free)** or **OpenAI (Paid)** Key in the settings, I can perform a deep semantic analysis. However, even in my current mode, I can tell you that ${randomInsight.toLowerCase()} \n\nWhat specific details would you like to explore further?`;
          }

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: reply,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }, 2000);
      }
    } catch (error: any) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error connecting to AI: ${error.response?.data?.error?.message || "Please check your network or API key. For free access, use a Groq API Key."}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      if (!apiKey) setTimeout(() => setIsLoading(false), 2000);
      else setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem' }}>
              <Zap size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>AI NEXUS</h1>
          </div>

          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            width: '100%'
          }} onClick={() => setMessages([{ id: '1', text: "New Chat started. How can I help?", sender: 'ai', timestamp: new Date() }])}>
            <Plus size={20} /> New Chat
          </button>

          <div style={{ flex: 1, marginTop: '2rem' }}>
             <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '1rem' }}>History</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  <MessageSquare size={16} /> Automation Project
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  <MessageSquare size={16} /> AI Integration
                </div>
             </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div onClick={() => setShowSettings(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
              <Settings size={20} /> Settings
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
              <LogOut size={20} /> Log Out
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Bot color="var(--primary)" size={28} />
            <div>
              <h2 style={{ fontSize: '1rem' }}>Nexus Assistant</h2>
              <p style={{ fontSize: '0.75rem', color: '#10b981' }}>Active</p>
            </div>
          </div>
          <Sparkles color="var(--primary)" size={20} />
        </header>

        <div className="chat-messages">
          {messages.length === 1 && (
            <div className="welcome-screen">
              <Bot size={60} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>How can I help you?</h1>
              <div className="tip-grid">
                {['Explain AI Automation', 'Write a React component', 'Market analysis ideas', 'Draft a business email'].map(tip => (
                  <div key={tip} className="tip-card" onClick={() => setInput(tip)}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.length > 1 && messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`message ${msg.sender}`}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: msg.sender === 'ai' ? 'var(--bg-sidebar)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {msg.sender === 'ai' ? <Bot size={24} color="var(--primary)" /> : <User size={24} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 700 }}>
                      {msg.sender === 'ai' ? 'AI ASSISTANT' : 'YOU'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="message ai">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'var(--bg-sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={24} color="var(--primary)" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[0, 0.2, 0.4].map(d => (
                    <motion.div key={d} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d }} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* CIRCLED INPUT AREA - FIXED & CENTERED */}
        <div className="input-area-container">
          <div className="input-box-wrapper">
            <input
              type="text"
              className="chat-input-field"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '400px', background: 'var(--bg-sidebar)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>API Configuration</h3>
                <X onClick={() => setShowSettings(false)} style={{ cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>OpenAI API Key</label>
                <div style={{ position: 'relative' }}>
                  <Key size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                  <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.75rem', color: 'white' }} />
                </div>
                <button onClick={() => setShowSettings(false)} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
