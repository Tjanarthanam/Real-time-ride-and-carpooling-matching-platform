package com.carpooling.backend.dto;

import java.util.List;

public class ChatHistoryResponse {

    private Long bookingId;

    private List<ChatMessageResponse> messages;

    public ChatHistoryResponse() {
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public List<ChatMessageResponse> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageResponse> messages) {
        this.messages = messages;
    }
}