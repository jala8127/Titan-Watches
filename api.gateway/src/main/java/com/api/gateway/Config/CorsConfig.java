package com.api.gateway.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * This class provides a centralized CORS (Cross-Origin Resource Sharing) configuration
 * for the entire API Gateway. This is the recommended, programmatic way to handle CORS
 * in a reactive Spring Cloud Gateway.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {

        final CorsConfiguration corsConfig = new CorsConfiguration();

        // Allow requests specifically from your Angular application's origin
        corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));

        // Set the cache max age for pre-flight requests
        corsConfig.setMaxAge(3600L);

        // Allow all standard HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers to be sent
        corsConfig.addAllowedHeader("*");

        // Allow credentials (like cookies, authorization headers)
        corsConfig.setAllowCredentials(true);

        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Apply this CORS configuration to all routes in the gateway ("/**")
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}

