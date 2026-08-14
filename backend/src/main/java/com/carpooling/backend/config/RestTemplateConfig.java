package com.carpooling.backend.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {

    // Used by RouteServiceImpl to call Nominatim (geocoding) and OSRM
    // (routing). Timeouts mirror the frontend's old REQUEST_TIMEOUT_MS so a
    // slow/unreachable map service fails fast instead of hanging the request.
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(10))
                .build();
    }
}
