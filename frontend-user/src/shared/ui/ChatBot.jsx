import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore } from "../../stores/useLanguageStore";
import "./ChatBot.css";

const TRANSLATIONS = {
  en: {
    greeting: "Hi there 👋 How can we help you today?",
    support: "Support",
    internal: "Discover how to get custom solutions, digital invitations, and more.",
    opt1Title: "Explore Koupreng Templates",
    opt1Desc: "Find the perfect design for your wedding and start customizing.",
    opt2Title: "Looking to upgrade plan",
    opt2Desc: "Speak to a live agent to upgrade your account to Gold or Diamond.",
    opt3Title: "Need technical support",
    opt3Desc: "Get helpful tips, guides, and assistance for using our platform.",
    inputPlaceholder: "Enter message...",
    poweredBy: "powered by"
  },
  km: {
    greeting: "សួស្តី 👋 តើមានអ្វីឲ្យយើងខ្ញុំជួយទេថ្ងៃនេះ?",
    support: "ជំនួយបច្ចេកទេស",
    internal: "ស្វែងយល់ពីរបៀបទទួលបានសន្លឹកការឌីជីថល ដំណោះស្រាយផ្ទាល់ខ្លួន និងច្រើនទៀត។",
    opt1Title: "ស្វែងរកគំរូសន្លឹកការគូព្រេង",
    opt1Desc: "ស្វែងរកការរចនាដ៏ល្អឥតខ្ចោះសម្រាប់ពិធីមង្គលការរបស់អ្នក។",
    opt2Title: "ចង់ដំឡើងកញ្ចប់សេវាកម្ម",
    opt2Desc: "ជជែកជាមួយភ្នាក់ងារដើម្បីដំឡើងទៅកញ្ចប់មាស ឬពេជ្រ។",
    opt3Title: "ត្រូវការជំនួយបច្ចេកទេស",
    opt3Desc: "ទទួលបានគន្លឹះ និងការណែនាំសម្រាប់ការប្រើប្រាស់ប្រព័ន្ធ។",
    inputPlaceholder: "វាយបញ្ចូលសារ...",
    poweredBy: "គាំទ្រដោយ"
  }
};

export default function ChatBot() {
  const lang = useLanguageStore((state) => state.lang) || "en";
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  // Close greeting after a few seconds or when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowGreeting(false);
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="chat-window"
          >
            <div className="chat-header">
              <div className="chat-header-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{t.support}</span>
              </div>
              <button className="chat-close-btn" onClick={toggleChat}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div className="chat-body">
              <div className="chat-greeting-internal">
                {t.internal}
              </div>
              
              <div className="chat-options">
                <button className="chat-option-btn">
                  <h4>{t.opt1Title}</h4>
                  <p>{t.opt1Desc}</p>
                </button>
                <button className="chat-option-btn">
                  <h4>{t.opt2Title}</h4>
                  <p>{t.opt2Desc}</p>
                </button>
                <button className="chat-option-btn">
                  <h4>{t.opt3Title}</h4>
                  <p>{t.opt3Desc}</p>
                </button>
              </div>
            </div>

            <div className="chat-footer">
              <input type="text" placeholder={t.inputPlaceholder} className="chat-input" />
              <button className="chat-send-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="chat-powered-by">
              {t.poweredBy} <strong>Koupreng</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Greeting Bubble */}
      <AnimatePresence>
        {!isOpen && showGreeting && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="chat-greeting-bubble"
          >
            {t.greeting}
            <button className="close-bubble" onClick={() => setShowGreeting(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
