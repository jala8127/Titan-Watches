package com.auth.service.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    // NEW: Add a logger
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("classpath:serviceAccountKey.json")
    private Resource serviceAccountKey;

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        try {
            logger.info("Attempting to load Firebase service account key from: {}", serviceAccountKey.getURL());

            if (!serviceAccountKey.exists()) {
                // This will give a very clear error on startup if the file is not found
                logger.error("FATAL: Firebase service account key not found in classpath!");
                throw new IOException("serviceAccountKey.json not found. Please ensure it is in src/main/resources and the project has been rebuilt.");
            }

            InputStream serviceAccount = serviceAccountKey.getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase application has been initialized successfully.");
            } else {
                logger.warn("Firebase application was already initialized.");
            }

            return FirebaseAuth.getInstance();

        } catch (IOException e) {
            // This will catch any other IO errors during file processing
            logger.error("An error occurred while initializing Firebase.", e);
            throw e; // Re-throw the exception to prevent the application from starting in a broken state
        }
    }
}

