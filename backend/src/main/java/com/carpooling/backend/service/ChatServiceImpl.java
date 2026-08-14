package com.carpooling.backend.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carpooling.backend.dto.ChatHistoryResponse;
import com.carpooling.backend.dto.ChatMessageRequest;
import com.carpooling.backend.dto.ChatMessageResponse;
import com.carpooling.backend.dto.ConversationResponse;
import com.carpooling.backend.entity.Message;
import com.carpooling.backend.entity.MessageStatus;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.MessageRepository;
import com.carpooling.backend.repository.UserRepository;

import com.carpooling.backend.entity.Booking;
import com.carpooling.backend.repository.BookingRepository;

@Service
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    private final BookingRepository bookingRepository;
    
    public ChatServiceImpl(MessageRepository messageRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository) {

this.messageRepository = messageRepository;
this.userRepository = userRepository;
this.bookingRepository = bookingRepository;
}
    
    @Override
    public ChatMessageResponse sendMessage(String userEmail,
                                           ChatMessageRequest request) {

        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();

        message.setBookingId(request.getBookingId());
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setMessage(request.getMessage());
        message.setStatus(MessageStatus.SENT);

        Message savedMessage = messageRepository.save(message);

        return convertToResponse(savedMessage);
    }

    @Override
    public ChatHistoryResponse getChatHistory(Long bookingId) {

        List<Message> messages =
                messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);

        ChatHistoryResponse response = new ChatHistoryResponse();

        response.setBookingId(bookingId);

        response.setMessages(
                messages.stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList())
        );

        return response;
    }
    
    @Override
    public void markMessageAsSeen(Long messageId) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new RuntimeException("Message not found"));

        message.setStatus(MessageStatus.SEEN);

        messageRepository.save(message);
    }
    
//    @Override
//    public List<ConversationResponse> getConversations(String userEmail) {
//
//        User currentUser = userRepository.findByEmail(userEmail)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        List<Message> messages =
//                messageRepository.findBySender_IdOrReceiver_IdOrderByCreatedAtDesc(
//                        currentUser.getId(),
//                        currentUser.getId()
//                );
//
//        Map<Long, ConversationResponse> conversations = new LinkedHashMap<>();
//
//        for (Message message : messages) {
//
//            // Keep only the latest message for each booking
//            if (conversations.containsKey(message.getBookingId())) {
//                continue;
//            }
//
//            User otherUser;
//
//            if (message.getSender().getId().equals(currentUser.getId())) {
//                otherUser = message.getReceiver();
//            } else {
//                otherUser = message.getSender();
//            }
//
//            ConversationResponse conversation = new ConversationResponse();
//
//            conversation.setBookingId(message.getBookingId());
//            conversation.setUserId(otherUser.getId());
//            conversation.setUserName(otherUser.getName());
//            conversation.setLastMessage(message.getMessage());
//            conversation.setLastMessageTime(message.getCreatedAt());
//
//            // Unread count (temporary)
//            conversation.setUnread(0);
//
//            conversations.put(message.getBookingId(), conversation);
//        }
//
//        return new ArrayList<>(conversations.values());
//    }
//    
    @Override
    public List<ConversationResponse> getConversations(String userEmail) {

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ConversationResponse> conversations = new ArrayList<>();

        // Passenger's confirmed bookings
        List<Booking> passengerBookings =
                bookingRepository.findByPassengerAndBookingStatus(
                        currentUser,
                        "CONFIRMED"
                );

        for (Booking booking : passengerBookings) {

            User driver = booking.getRide().getDriver();

            ConversationResponse response = new ConversationResponse();

            response.setBookingId(booking.getId());
            response.setUserId(driver.getId());
            response.setUserName(driver.getName());

            List<Message> messages =
                    messageRepository.findByBookingIdOrderByCreatedAtAsc(
                            booking.getId()
                    );

            if (!messages.isEmpty()) {
                Message last = messages.get(messages.size() - 1);

                response.setLastMessage(last.getMessage());
                response.setLastMessageTime(last.getCreatedAt());
            } else {
                response.setLastMessage("Start chatting...");
            }

            response.setUnread(0);

            conversations.add(response);
        }

        // Driver's confirmed bookings
        List<Booking> driverBookings =
                bookingRepository.findByRide_DriverAndBookingStatus(
                        currentUser,
                        "CONFIRMED"
                );

        for (Booking booking : driverBookings) {

            User passenger = booking.getPassenger();

            ConversationResponse response = new ConversationResponse();

            response.setBookingId(booking.getId());
            response.setUserId(passenger.getId());
            response.setUserName(passenger.getName());

            List<Message> messages =
                    messageRepository.findByBookingIdOrderByCreatedAtAsc(
                            booking.getId()
                    );

            if (!messages.isEmpty()) {
                Message last = messages.get(messages.size() - 1);

                response.setLastMessage(last.getMessage());
                response.setLastMessageTime(last.getCreatedAt());
            } else {
                response.setLastMessage("Start chatting...");
            }

            response.setUnread(0);

            conversations.add(response);
        }

        conversations.sort((a, b) -> {

            if (a.getLastMessageTime() == null &&
                    b.getLastMessageTime() == null)
                return 0;

            if (a.getLastMessageTime() == null)
                return 1;

            if (b.getLastMessageTime() == null)
                return -1;

            return b.getLastMessageTime()
                    .compareTo(a.getLastMessageTime());
        });

        return conversations;
    }
    private ChatMessageResponse convertToResponse(Message message) {

        ChatMessageResponse response = new ChatMessageResponse();

        response.setId(message.getId());
        response.setBookingId(message.getBookingId());

        response.setSenderId(message.getSender().getId());
        response.setSenderName(message.getSender().getName());

        response.setReceiverId(message.getReceiver().getId());
        response.setReceiverName(message.getReceiver().getName());

        response.setMessage(message.getMessage());
        response.setStatus(message.getStatus().name());
        response.setCreatedAt(message.getCreatedAt());

        return response;
    }

}

    