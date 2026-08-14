package com.carpooling.backend.config;

import com.carpooling.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <-- Added Import
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    // Expose AuthenticationManager as a Bean so LoginService can use it
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    // 1. ALLOW CORS PREFLIGHT REQUESTS FROM BROWSER
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                    
                    // 2. OPEN LOGIN & REGISTER ROUTES
                    .requestMatchers("/api/auth/**").permitAll() 

                    // 2b. PUBLIC READ-ONLY TESTIMONIALS FOR THE LANDING PAGE
                    .requestMatchers(HttpMethod.GET, "/api/feedback/public").permitAll()
                    
                    // 3. SECURE EVERYTHING ELSE
                    .anyRequest().authenticated() 
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}