package com.auth.service.Config; // Use your correct package name

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("registrationOtpCache");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                // Evict entries 10 minutes after they are written
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000)); // Max 1000 pending registrations
        return cacheManager;
    }
}