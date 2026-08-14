package com.carpooling.backend.dto;

import java.time.LocalDateTime;

public class ConversationResponse {

    private Long bookingId;

    private Long userId;

    private String userName;

    private String lastMessage;

    private LocalDateTime lastMessageTime;

    private int unread;

    public ConversationResponse() {
    }

    public ConversationResponse(Long bookingId,
                                Long userId,
                                String userName,
                                String lastMessage,
                                LocalDateTime lastMessageTime,
                                int unread) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.userName = userName;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.unread = unread;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public int getUnread() {
        return unread;
    }

    public void setUnread(int unread) {
        this.unread = unread;
    }

}