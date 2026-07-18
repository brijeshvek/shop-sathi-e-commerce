"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Bot, ArrowUpRight, HelpCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

let msgCounter = 0;
const getUniqueId = () => {
  msgCounter += 1;
  return `msg-id-${msgCounter}`;
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am Shop Shathi's AI assistant. I can help you find products, suggest popular items, or answer your questions about shipping, returns, and orders. How can I help you today?",
      timestamp: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const messagesEndRef = useRef(null);

  // Initialize and preload FAQs & products for smart offline matching/context
  useEffect(() => {
    if (!isOpen || hasLoadedData) return;

    let active = true;
    const load = async () => {
      try {
        const [prodRes, faqRes] = await Promise.all([
          api.get("/products?limit=50").catch(() => ({ data: { data: [] } })),
          api.get("/cms/faqs?limit=100&activeOnly=true").catch(() => ({ data: { data: [] } })),
        ]);
        if (active) {
          setProducts(prodRes.data?.data || []);
          setFaqs(faqRes.data?.data || []);
          setHasLoadedData(true);
        }
      } catch (err) {
        console.error("AI Assistant: failed to load context data", err);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [isOpen, hasLoadedData]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Suggested Prompts
  const quickPrompts = [
    { label: "Suggest Electronics", prompt: "Suggest some good electronics products for me" },
    { label: "Trending Products", prompt: "What are the trending products available?" },
    { label: "Return Policy", prompt: "What is your return policy?" },
    { label: "Shipping Info", prompt: "Do you offer free shipping?" },
  ];

  // Client-side local smart search & matching engine
  const handleLocalResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Check if user is asking for product suggestions or searching products
    const isProductSearch = /suggest|recommend|product|show|find|search|buy|item|device|clothing|phone|laptop|watch/i.test(q);
    
    // Search products if requested or if query matches product names/categories
    let matchedProducts = [];
    if (isProductSearch || q.length > 2) {
      matchedProducts = products.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        const categoryMatch = typeof p.category === 'object' && p.category?.name?.toLowerCase().includes(q);
        return nameMatch || descMatch || brandMatch || categoryMatch;
      });

      // If no matching items, but user asked for general suggestions, return featured/top-rated
      if (matchedProducts.length === 0 && isProductSearch) {
        matchedProducts = products.slice(0, 4);
      }
    }

    // 2. Check if user is asking questions matching FAQs
    let matchedFaq = null;
    let highestScore = 0;

    faqs.forEach(faq => {
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();
      
      // Calculate a basic matching score
      let score = 0;
      const keywords = q.split(/\s+/);
      keywords.forEach(word => {
        if (word.length > 3) {
          if (question.includes(word)) score += 3;
          if (answer.includes(word)) score += 1;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        matchedFaq = faq;
      }
    });

    // Determine the final answer
    if (matchedFaq && highestScore >= 3) {
      return {
        text: matchedFaq.answer,
        products: matchedProducts.slice(0, 3)
      };
    }

    // If matches products specifically
    if (matchedProducts.length > 0) {
      return {
        text: `Here are some products I found matching "${query}":`,
        products: matchedProducts.slice(0, 3)
      };
    }

    // Handle generic policies if FAQs are empty/not matching
    if (q.includes("return") || q.includes("refund")) {
      return {
        text: "You can return most items within 30 days of delivery for a full refund. Items must be in original condition with packaging intact. Please visit your profile order page to initiate a return request."
      };
    }
    if (q.includes("ship") || q.includes("delivery") || q.includes("charge")) {
      return {
        text: "We deliver across the country. Shipping is free for orders above ₹499! For orders below that, a shipping charge of ₹99 applies. Standard delivery takes 3-5 business days."
      };
    }
    if (q.includes("payment") || q.includes("pay") || q.includes("razorpay")) {
      return {
        text: "We support secure payments via Razorpay including Credit/Debit Cards, UPI, Net Banking, and popular wallets."
      };
    }

    // Default Fallback
    return {
      text: "I couldn't find a direct answer to that, but I can recommend checking out our top products! Feel free to ask about our shipping options, returns, or browse our products page.",
      products: products.slice(0, 3)
    };
  };

  // Live Gemini API client-side fetch integration
  const queryGeminiAPI = async (userQuery) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      // Build context from current products and FAQs
      const faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
      const productContext = products.map(p => `- ${p.name} (Brand: ${p.brand || 'N/A'}, Price: ₹${p.price}, Link slug: ${p.slug})`).join("\n");

      const systemPrompt = `You are a helpful AI Assistant for Shop Shathi, a premium e-commerce store.
Your goals:
1. Answer customer questions accurately using the provided FAQs and policies.
2. Suggest relevant products from the product list provided.

Store Policies:
- Free shipping threshold: ₹499. Below that: ₹99.
- Tax rate: 18% GST (already included in prices).
- Returns: within 30 days of delivery.
- Payments: Credit/Debit Cards, UPI, Net Banking.

Frequently Asked Questions (FAQs):
${faqContext || "No FAQs loaded."}

Product Catalog:
${productContext || "No products loaded."}

User query: "${userQuery}"

Provide a concise, polite, customer-friendly response in plain text. If you suggest specific products, make sure to mention their names exactly. Do not use Markdown formatting like asterisks or hashtags. Keep it short and helpful.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gemini API request failed");
      }

      const resData = await response.json();
      const answerText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Parse suggested products from the AI text to render product cards
      const suggestedProds = [];
      products.forEach(p => {
        if (answerText.toLowerCase().includes(p.name.toLowerCase())) {
          if (!suggestedProds.find(sp => sp._id === p._id)) {
            suggestedProds.push(p);
          }
        }
      });

      return {
        text: answerText,
        products: suggestedProds.slice(0, 3)
      };
    } catch (err) {
      console.error("Gemini query error, falling back to local search:", err);
      return null;
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: getUniqueId(),
      sender: "user",
      text,
      timestamp: null,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let responseData = null;
      // Try Gemini API first if configured
      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        responseData = await queryGeminiAPI(text);
      }

      // Fallback to local matching if Gemini is not set or failed
      if (!responseData) {
        responseData = handleLocalResponse(text);
      }

      setMessages(prev => [
        ...prev,
        {
          id: getUniqueId(),
          sender: "bot",
          text: responseData.text,
          products: responseData.products || [],
          timestamp: null,
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: getUniqueId(),
          sender: "bot",
          text: "Oops, I encountered an issue. How else can I assist you?",
          timestamp: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="mb-4 w-92 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide">Shop Shathi Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                    <span className="text-[10px] text-primary-100 font-medium uppercase tracking-wider">
                      {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "Gemini AI Active" : "Smart Matching Active"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2.5 max-w-[85%]">
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800">
                        <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          msg.sender === "user"
                            ? "bg-primary-600 text-white rounded-tr-none"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-800"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Product Recommendations inside Chat Bubble */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="grid gap-2 mt-2">
                          {msg.products.map((prod) => (
                            <Link
                              href={`/products/${prod.slug}`}
                              key={prod._id}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 border border-gray-100 dark:border-gray-800 hover:border-primary-200 rounded-xl transition-all shadow-xs group"
                            >
                              {prod.images && prod.images[0] && (
                                <img
                                  src={prod.images[0].url}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-800"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {prod.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                  {prod.brand || "Shop Shathi"}
                                </p>
                                <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400">
                                  ₹{prod.price}
                                </span>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 shadow-xs flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600 dark:text-primary-400" />
                      <span className="text-[11px] font-medium tracking-wide">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-primary-500" /> Suggested queries:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp.prompt)}
                      className="text-[11px] font-medium px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 border border-gray-200 dark:border-gray-800 hover:border-primary-200 rounded-lg cursor-pointer transition-all"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:outline-none rounded-xl text-xs text-gray-800 dark:text-gray-100 transition-colors placeholder:text-gray-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 dark:disabled:text-gray-600 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:shadow-primary-500/25 transition-all relative group"
        aria-label="Toggle AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-amber-300" />
        
        {/* Floating Greeting Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        )}
        
        {/* Hover Tooltip */}
        {!isOpen && (
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all origin-right bg-gray-900 text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md">
            Chat with AI
          </span>
        )}
      </motion.button>
    </div>
  );
}
