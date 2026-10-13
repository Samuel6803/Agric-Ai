import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../services/api';
import Markdown from 'react-markdown';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  User,
  RotateCcw,
  Sprout,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    createNewChatSession,
    addMessageToCurrentSession,
    deleteChatSession,
    renameChatSession,
    userProfile,
    initialAssistantQuery,
    setInitialAssistantQuery,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitleValue, setNewTitleValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentSession = chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, loading]);

  // Handle incoming initial prompt if set from another tab
  useEffect(() => {
    if (initialAssistantQuery && initialAssistantQuery.trim()) {
      const q = initialAssistantQuery.trim();
      setInitialAssistantQuery('');
      handleSend(q);
    }
  }, [initialAssistantQuery]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || loading) return;

    setInputMessage('');
    setErrorMessage(null);

    // Add user message to current session
    addMessageToCurrentSession('user', text);
    setLoading(true);

    try {
      // Build history for context
      const history = (currentSession?.messages || [])
        .slice(-8)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const reply = await sendChatMessage(text, history, {
        location: `${userProfile.location.city}, ${userProfile.location.country}`,
        currency: userProfile.currency,
        experience: userProfile.farmingExperience,
        farmingType: userProfile.farmingInterests.join(', '),
      });

      addMessageToCurrentSession('assistant', reply);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        err.message || 'Something went wrong while processing your request. Please try again.'
      );
      addMessageToCurrentSession(
        'assistant',
        `⚠️ **Notice**: I encountered a temporary network or processing delay. Please check your connection or try rephrasing your question.\n\n*Error details: ${err.message || 'Service unavailable'}*`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      // Strip markdown hashes and asterisks for natural reading
      const cleanText = text
        .replace(/###/g, '')
        .replace(/##/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 1000));
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDownloadTranscript = () => {
    if (!currentSession) return;
    const content = currentSession.messages
      .map((m) => `[${m.role.toUpperCase()}] (${new Date(m.timestamp).toLocaleString()}):\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriAI_Consultation_${currentSession.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickPrompts = [
    'I have ₦500,000 and want to start poultry farming. What should I do?',
    'Why are the leaves on my tomato plant turning yellow?',
    'How do I calculate my farm profit and break-even point?',
    'How much NPK fertilizer do I need for 2 hectares of maize?',
    'How do I control fall armyworm organically?',
    'What should I do if my crops are affected by a disease?',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Sidebar: Conversation History & Context */}
      <div className="hidden lg:flex flex-col bg-white rounded-3xl border border-stone-200 p-4 shadow-xs overflow-hidden">
        {/* New Chat Button */}
        <button
          onClick={createNewChatSession}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>New Farm Consultation</span>
        </button>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 mb-1">
            Recent Consultations ({chatSessions.length})
          </p>

          {chatSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = editingTitleId === session.id;

            return (
              <div
                key={session.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                    : 'text-stone-700 hover:bg-stone-50 border border-transparent'
                }`}
                onClick={() => !isEditing && setActiveSessionId(session.id)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={newTitleValue}
                      onChange={(e) => setNewTitleValue(e.target.value)}
                      onBlur={() => {
                        if (newTitleValue.trim()) {
                          renameChatSession(session.id, newTitleValue.trim());
                        }
                        setEditingTitleId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (newTitleValue.trim()) {
                            renameChatSession(session.id, newTitleValue.trim());
                          }
                          setEditingTitleId(null);
                        }
                      }}
                      autoFocus
                      className="w-full bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs focus:outline-none"
                    />
                  ) : (
                    <p className="truncate">{session.title}</p>
                  )}
                  <span className="text-[10px] text-stone-400 font-normal">
                    {session.messages.length} messages
                  </span>
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTitleId(session.id);
                        setNewTitleValue(session.title);
                      }}
                      className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Context Preview */}
        <div className="pt-3 border-t border-stone-100 mt-2 text-[11px] text-stone-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Location:</span>
            <span className="font-semibold text-stone-800">{userProfile.location.city}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Currency:</span>
            <span className="font-semibold text-stone-800">{userProfile.currency}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Experience:</span>
            <span className="font-semibold text-stone-800">{userProfile.farmingExperience}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Chat Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-stone-900">AgriAI Assistant</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate max-w-xs sm:max-w-md">
                {currentSession?.title || 'Farm Consultation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTranscript}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
              title="Download Conversation Transcript"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={createNewChatSession}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {currentSession?.messages.map((message) => {
            const isUser = message.role === 'user';
            const isSpeaking = speakingId === message.id;

            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-stone-800 text-white'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-xs shadow-xs w-full'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  ) : (
                    <div>
                      <div className="markdown-body">
                        <Markdown>{message.text}</Markdown>
                      </div>

                      {/* Action Bar for AI response */}
                      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-stone-200/60 text-stone-400">
                        <button
                          onClick={() => handleSpeak(message.id, message.text)}
                          className={`p-1 rounded hover:bg-stone-200/50 transition-colors ${
                            isSpeaking ? 'text-emerald-700 bg-emerald-100' : 'text-stone-500'
                          }`}
                          title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopy(message.id, message.text)}
                          className="p-1 rounded text-stone-500 hover:bg-stone-200/50 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center gap-2 text-xs text-stone-500">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">AgriAI is analyzing your agricultural question...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {(!currentSession || currentSession.messages.length <= 1) && (
          <div className="px-4 pb-2">
            <p className="text-[11px] font-bold text-stone-400 mb-1.5">Try asking:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-left text-[11px] px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-stone-50 rounded-2xl border border-stone-200 px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about crops, livestock, feeding, soil, disease, prices..."
              className="w-full text-xs sm:text-sm bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none py-1.5"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                inputMessage.trim() && !loading
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-stone-400 text-center mt-2">
            AgriAI provides agronomic &amp; business guidance. Distinguish estimates from facts. Consult certified veterinarians for critical animal health emergencies.
          </p>
        </div>
      </div>
    </div>
  );
};
