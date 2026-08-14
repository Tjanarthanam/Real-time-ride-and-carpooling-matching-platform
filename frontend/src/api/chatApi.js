import apiClient from './axiosClient';

// GET /api/chat/conversations  (sidebar list — one per CONFIRMED booking)
export function getConversations() {
  return apiClient.get('/chat/conversations');
}

// GET /api/chat/history/{bookingId}
export function getChatHistory(bookingId) {
  return apiClient.get(`/chat/history/${bookingId}`);
}

// POST /api/chat/send  { bookingId, receiverId, message }
export function sendChatMessage({ bookingId, receiverId, message }) {
  return apiClient.post('/chat/send', { bookingId, receiverId, message });
}

// PUT /api/chat/seen/{messageId}
export function markMessageSeen(messageId) {
  return apiClient.put(`/chat/seen/${messageId}`);
}
