import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { useAIChat } from "../../hooks/useAIChat";

export function AIChatWidget() {
  const { messages, isLoading, isOpen, toggleChat, sendMessage } = useAIChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-60 w-full h-[85vh] rounded-t-3xl sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] sm:rounded-2xl bg-white/95 backdrop-blur-xl dark:bg-kudi-dark/95 shadow-2xl border border-gray-100/50 dark:border-white/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-kudi-green to-emerald-700 text-white p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">
                    KudiFlow AI
                  </h3>
                  <p className="text-xs text-emerald-100">Always online</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50 dark:bg-transparent">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-10"
                >
                  <div className="w-16 h-16 rounded-full bg-kudi-green/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-kudi-green" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Hi! I'm KudiFlow's AI Assistant.
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                    I can help you manage your sales, track inventory, and send
                    debt reminders. Ask me anything!
                  </p>
                </motion.div>
              )}

              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-tr from-kudi-gold to-yellow-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-kudi-green"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3.5 text-[15px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-tr from-kudi-gold to-yellow-500 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white dark:bg-gray-800 border border-gray-100/80 dark:border-gray-700/50 rounded-2xl rounded-tl-sm text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-kudi-green flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-100/80 dark:border-gray-700/50 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[46px]">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "easeInOut",
                        delay: 0,
                      }}
                      className="w-2 h-2 bg-kudi-green/60 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "easeInOut",
                        delay: 0.15,
                      }}
                      className="w-2 h-2 bg-kudi-green/60 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                      className="w-2 h-2 bg-kudi-green/60 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white/80 dark:bg-kudi-dark/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  // NOTE: text-base is critical here to prevent iOS Safari auto-zoom on mobile
                  className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-kudi-green/40 dark:text-white transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-kudi-green to-emerald-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-kudi-green/30 transition-all flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase">
                  Powered by KudiFlow AI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div
        className={`fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[60] ${
          isOpen ? "hidden sm:block" : ""
        }`}
      >
        <div className="relative">
          {/* Pulsing ring effect when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-kudi-green/40 animate-ping opacity-75" />
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? "bg-gray-800 text-white hover:bg-gray-900 shadow-gray-900/20"
                : "bg-gradient-to-r from-kudi-green to-emerald-600 text-white hover:shadow-kudi-green/40"
            }`}
            aria-label="Toggle AI Chat"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageSquare className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </>
  );
}
