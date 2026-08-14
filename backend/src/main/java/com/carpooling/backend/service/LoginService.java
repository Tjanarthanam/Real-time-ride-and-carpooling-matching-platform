package com.carpooling.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.carpooling.backend.dto.LoginRequest;
import com.carpooling.backend.dto.LoginResponse;
import com.carpooling.backend.entity.User;
import com.carpooling.backend.repository.UserRepository;
import com.carpooling.backend.security.JwtUtil;
import com.carpooling.backend.security.CustomUserDetailsService; // <-- Added this missing import!

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return new LoginResponse(null, null, null, "User Not Found");
        }

        User user = userOptional.get();

        // Check if role matches what they selected on frontend
        if (!user.getRole().equalsIgnoreCase(request.getRole())) {
            return new LoginResponse(null, null, null, "Invalid Role");
        }

        try {
            // Authenticate credentials via Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return new LoginResponse(null, null, null, "Invalid Password");
        }

        // Generate JWT Token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        return new LoginResponse(jwt, user.getEmail(), user.getRole(), "Login Successful");
    }
}