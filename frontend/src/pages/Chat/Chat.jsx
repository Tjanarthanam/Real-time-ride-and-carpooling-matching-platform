import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { getConversations, getChatHistory, sendChatMessage, markMessageSeen } from '../../api/chatApi';

// Polling intervals — the backend chat API is plain REST (no WebSocket),
// so we refresh on a timer instead of pushing live updates.
const CONVERSATIONS_POLL_MS = 5000;
const MESSAGES_POLL_MS = 2000;

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const seenMessageIds = useRef(new Set());

  const selectedConversation = conversations.find((c) => c.bookingId === selectedBookingId) || null;

  const loadConversations = useCallback(async () => {
    try {
      const res = await getConversations();
      setConversations(res.data);
      setError('');
    } catch (err) {
      setError(
        err.request
          ? 'Could not reach the server. Is the backend running on port 8081?'
          : 'Could not load conversations.'
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (bookingId) => {
    try {
      const res = await getChatHistory(bookingId);
      setMessages(res.data.messages || []);
    } catch {
      // A transient poll failure isn't worth surfacing as a page-level error
    }
  }, []);

  // Initial conversations load + poll
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, CONVERSATIONS_POLL_MS);
    window.addEventListener('focus', loadConversations);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', loadConversations);
    };
  }, [loadConversations]);

  // Load + poll messages for the selected conversation
  useEffect(() => {
    if (!selectedBookingId) return;
    const refresh = () => loadMessages(selectedBookingId);
    refresh();
    const interval = setInterval(refresh, MESSAGES_POLL_MS);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refresh);
    };
  }, [selectedBookingId, loadMessages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark incoming (not-yet-seen) messages as seen once they're on screen
  useEffect(() => {
    if (!selectedConversation) return;
    messages.forEach((m) => {
      const isIncoming = m.senderId === selectedConversation.userId;
      if (isIncoming && m.status !== 'SEEN' && !seenMessageIds.current.has(m.id)) {
        seenMessageIds.current.add(m.id);
        markMessageSeen(m.id).catch(() => {
          seenMessageIds.current.delete(m.id);
        });
      }
    });
  }, [messages, selectedConversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selectedConversation) return;

    setIsSending(true);
    try {
      await sendChatMessage({
        bookingId: selectedConversation.bookingId,
        receiverId: selectedConversation.userId,
        message: text,
      });
      setDraft('');
      await loadMessages(selectedConversation.bookingId);
      loadConversations();
    } catch {
      setError('Could not send that message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 lg:px-8 pt-28 lg:pt-32 pb-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Messages</h1>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[70vh]">
        {/* Conversation list */}
        <div className="md:col-span-1 border-r border-slate-100 overflow-y-auto max-h-[75vh]">
          {isLoadingConversations ? (
            <p className="text-sm text-slate-400 font-semibold text-center py-8">Loading conversations…</p>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageCircle size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">
                No conversations yet. Chat unlocks once a booking is confirmed.
              </p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.bookingId}
                onClick={() => setSelectedBookingId(c.bookingId)}
                className={`w-full text-left px-4 py-4 border-b border-slate-50 hover:bg-slate-50 transition flex items-center gap-3 ${
                  selectedBookingId === c.bookingId ? 'bg-slate-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-slate-900 text-sm truncate">{c.userName}</p>
                    {c.lastMessageTime && (
                      <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
                        {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-blue-600 rounded-full flex-shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Message thread */}
        <div className="md:col-span-2 flex flex-col max-h-[75vh]">
          {!selectedConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageCircle size={32} className="text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">Select a conversation to start chatting.</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="font-bold text-slate-900">{selectedConversation.userName}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((m) => {
                  const isMine = m.receiverId === selectedConversation.userId;
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          isMine ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <p>{m.message}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-100' : 'text-slate-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMine && m.status === 'SEEN' ? ' • Seen' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isSending || !draft.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white p-2.5 rounded-xl transition"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
