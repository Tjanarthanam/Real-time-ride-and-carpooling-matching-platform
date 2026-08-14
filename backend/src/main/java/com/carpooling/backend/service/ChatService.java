package com.carpooling.backend.service;

import java.util.List;

import com.carpooling.backend.dto.ChatHistoryResponse;
import com.carpooling.backend.dto.ChatMessageRequest;
import com.carpooling.backend.dto.ChatMessageResponse;
import com.carpooling.backend.dto.ConversationResponse;

public interface ChatService {

    /**
     * Send a chat message
     */
    ChatMessageResponse sendMessage(String userEmail,
                                    ChatMessageRequest request);

    /**
     * Get all messages for a booking
     */
    ChatHistoryResponse getChatHistory(Long bookingId);

    /**
     * Mark a message as seen
     */
    void markMessageAsSeen(Long messageId);

    /**
     * Get all conversations of the logged-in user
     */
    List<ConversationResponse> getConversations(String userEmail);

}