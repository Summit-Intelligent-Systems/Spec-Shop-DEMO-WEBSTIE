'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Glasses,
  Bot,
  AlertCircle,
} from 'lucide-react';
import type { SourceCitation } from '@/lib/rag/retriever';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: SourceCitation[];
  timestamp: Date;
  isStreaming?: boolean;
}

const QUICK_CHIPS = [
  { label: '👓 Eyeglasses', query: 'Show me your eyeglasses collection' },
  { label: '🕶️ Sunglasses', query: 'Show me your sunglasses collection' },
  { label: '🎯 Face Shape Guide', query: 'Which frames suit a round face shape?' },
  { label: '👁️ Free Eye Exam', query: 'Can I get my eyes checked for free?' },
  { label: '🏷️ Discount Code', query: 'Do you have any discount coupon codes?' },
  { label: '📍 Store Locations', query: 'Where are your flagship stores located?' },
];

const SUGGESTED_QUESTIONS = [
  'Which frames suit a round face shape?',
  'How much does the 20-step eye test cost?',
  'What is the price & material of The Sovereign Round?',
  'Do you have any discount promo codes?',
  'Where are your flagship stores located?',
  'What is your warranty and return policy?',
];

/**
 * Parses markdown bold (**text**), links ([label](url)), relative paths (/path),
 * and bullet points (* / -) into styled React elements.
 */
function renderFormattedText(text: string, onLinkClick?: () => void): React.ReactNode {
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
    const content = isBullet ? trimmed.slice(2).trim() : line;

    // Tokenize markdown links [text](url), bold **text**, and relative paths (e.g. /shop/eyeglasses)
    const tokenRegex = new RegExp(
      '(\\[([^\\]]+)\\]\\(([^)]+)\\))|(\\*\\*(.+?)\\*\\*)|(\\((/(?:shop|product|stores|try-on|lookbook|cart|checkout|face-shape-guide|prescription-guide|book-eye-test|faq|lens-technology)[^)]*)\\))',
      'g'
    );
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const plain = content.slice(lastIndex, match.index).replace(/\*\*/g, '');
        parts.push(plain);
      }

      if (match[1]) {
        // [Label](url)
        const label = match[2];
        const url = match[3];
        parts.push(
          <Link
            key={`l-${lineIdx}-${match.index}`}
            href={url}
            onClick={onLinkClick}
            className="text-gold underline underline-offset-2 hover:text-gold-300 font-medium inline-flex items-center gap-0.5 transition-colors"
          >
            <span>{label}</span>
            {url.startsWith('http') && <ExternalLink className="w-2.5 h-2.5 inline ml-0.5" />}
          </Link>
        );
      } else if (match[4]) {
        // **bold**
        parts.push(
          <strong key={`b-${lineIdx}-${match.index}`} className="font-bold text-white tracking-wide">
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        // (/route)
        const path = match[7];
        parts.push(
          <span key={`p-${lineIdx}-${match.index}`}>
            {'('}
            <Link
              href={path}
              onClick={onLinkClick}
              className="text-gold underline underline-offset-2 hover:text-gold-300 font-medium transition-colors"
            >
              {path}
            </Link>
            {')'}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const tail = content.slice(lastIndex).replace(/\*\*/g, '');
      parts.push(tail);
    }

    if (isBullet) {
      return (
        <div key={`line-${lineIdx}`} className="flex items-start gap-2 my-1 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
          <span className="flex-1">{parts}</span>
        </div>
      );
    }

    return (
      <div key={`line-${lineIdx}`} className={trimmed === '' ? 'h-2' : 'my-0.5'}>
        {parts}
      </div>
    );
  });
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello! Welcome to XYZ Eyewear. I am your personal AI Concierge.\n\nAsk me anything from a simple 'Hi' to questions about our handcrafted frames, face shape styling, complimentary 20-step eye exams, or flagship optical salons. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (userText: string) => {
    const text = userText.trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setError(null);

    const userMessageId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    const botMessageId = `bot-${Date.now()}`;
    const initialBotMsg: Message = {
      id: botMessageId,
      sender: 'assistant',
      text: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to connect to XYZ AI Concierge.');
      }

      // Extract source citations from header
      let sources: SourceCitation[] = [];
      const sourcesHeader = response.headers.get('X-Sources');
      if (sourcesHeader) {
        try {
          sources = JSON.parse(decodeURIComponent(sourcesHeader));
        } catch {
          // ignore parsing error
        }
      }

      if (!response.body) {
        throw new Error('Response stream is unavailable.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      let isDone = false;
      while (!isDone) {
        const { done, value } = await reader.read();
        if (done) {
          isDone = true;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: fullText, sources, isStreaming: true }
              : msg
          )
        );
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: fullText, sources, isStreaming: false }
            : msg
        )
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching your response.';
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "I apologize, but I encountered an issue accessing the boutique resources. Please try again or reach our team at support@xyzeyewear.com.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "Welcome to XYZ Eyewear. I am your personal AI Concierge, trained on our complete catalog, optical blueprints, certified eye exam protocols, and boutique locations. How may I assist your vision today?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <>
      {/* ─── Floating Concierge Button ────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              aria-label="Open XYZ AI Concierge"
              className="relative flex items-center gap-3 bg-obsidian-950 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl border border-gold/40 hover:border-gold transition-all group"
            >
              {/* Pulsing Status Dot */}
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping" />
              </div>

              {/* Bot Icon with Gold Glow */}
              <div className="w-7 h-7 rounded-full bg-gold/15 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-obsidian-950 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>

              {/* Button Label */}
              <div className="text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold block leading-none">
                  AI Concierge
                </span>
                <span className="text-[10px] text-obsidian-300 block leading-tight mt-0.5">
                  Ask About Frames & Care
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Chat Window ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[640px] sm:max-h-[85vh] z-50 flex flex-col bg-obsidian-950 text-white sm:rounded-3xl border border-white/15 shadow-2xl overflow-hidden backdrop-blur-2xl"
          >
            {/* ── Header ── */}
            <div className="p-4 sm:px-6 border-b border-white/10 bg-obsidian-900/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold/30 to-obsidian-900 border border-gold/40 flex items-center justify-center text-gold shadow-gold">
                    <Glasses className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-obsidian-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-base font-semibold text-white tracking-wide">
                      XYZ AI Concierge
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                      RAG Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-obsidian-400">
                    Grounded in Catalog, Lenses & Flagship Stores
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 rounded-xl text-obsidian-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close concierge"
                  className="p-2 rounded-xl text-obsidian-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Messages Container ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-end gap-2 max-w-[90%]">
                    {msg.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mb-1 border border-gold/40">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-gold-600 to-gold text-obsidian-950 font-medium rounded-br-none shadow-md'
                          : 'bg-white/5 border border-white/10 text-obsidian-100 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {/* Message Content */}
                      <div className="space-y-1">
                        {msg.text ? (
                          renderFormattedText(msg.text, () => setIsOpen(false))
                        ) : (
                          <div className="flex items-center gap-1.5 py-1 text-obsidian-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce delay-150" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce delay-300" />
                            <span className="text-[11px] ml-1">Consulting store catalog...</span>
                          </div>
                        )}
                      </div>

                      {/* Source Citations & Links */}
                      {msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                            Verified Website Sources:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((source) => (
                              <Link
                                key={source.id}
                                href={source.url}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-obsidian-900/90 hover:bg-gold hover:text-obsidian-950 text-[11px] text-obsidian-300 border border-white/10 hover:border-gold transition-colors"
                              >
                                <span>{source.title}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-obsidian-500 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Suggested Questions (only if 1 message exists) */}
              {messages.length === 1 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-obsidian-400 block px-1">
                    Suggested Inquiries:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="text-left px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-obsidian-200 border border-white/10 hover:border-gold/40 flex items-center justify-between group transition-colors"
                      >
                        <span>{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-obsidian-500 group-hover:text-gold transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Box & Quick Action Chips ── */}
            <div className="p-3.5 sm:p-4 border-t border-white/10 bg-obsidian-900/90 shrink-0 space-y-2.5">
              {/* Quick Action Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSendMessage(chip.query)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-gold hover:text-obsidian-950 text-obsidian-300 border border-white/10 hover:border-gold transition-colors disabled:opacity-40 shrink-0 font-medium"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Say 'hi', ask about frames, eye exams..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 focus:border-gold text-white placeholder:text-obsidian-500 text-xs rounded-xl px-4 py-3 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  aria-label="Send message"
                  className="p-3 rounded-xl bg-gold hover:bg-gold-400 disabled:opacity-40 disabled:hover:bg-gold text-obsidian-950 font-semibold transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-obsidian-400 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Strictly grounded in verified website resources</span>
                </span>
                <span>XYZ Eyewear</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
