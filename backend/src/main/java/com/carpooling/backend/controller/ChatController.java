package com.carpooling.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carpooling.backend.dto.ChatHistoryResponse;
import com.carpooling.backend.dto.ChatMessageRequest;
import com.carpooling.backend.dto.ChatMessageResponse;
import com.carpooling.backend.dto.ConversationResponse;
import com.carpooling.backend.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Send Message
    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @RequestBody ChatMessageRequest request,
            Principal principal) {

        ChatMessageResponse response =
                chatService.sendMessage(principal.getName(), request);

        return ResponseEntity.ok(response);
    }

    // Chat History
    @GetMapping("/history/{bookingId}")
    public ResponseEntity<ChatHistoryResponse> getChatHistory(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(chatService.getChatHistory(bookingId));
    }

    // Mark Message as Seen
    @PutMapping("/seen/{messageId}")
    public ResponseEntity<String> markSeen(
            @PathVariable Long messageId) {

        chatService.markMessageAsSeen(messageId);

        return ResponseEntity.ok("Message marked as seen.");
    }

    // Get Conversations for Sidebar
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            Principal principal) {

        return ResponseEntity.ok(
                chatService.getConversations(principal.getName())
        );
    }
}