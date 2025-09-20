
package com.auth.service.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    // This tells Spring to find the service account key you just placed in the resources folder.
    @Value("classpath:serviceAccountKey.json")
    private Resource serviceAccountKey;

    /**
     * This method creates a reusable "FirebaseAuth" object that can be injected
     * into other parts of your application (like the UserService).
     */
    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        // Get the input stream for the service account key file.
        InputStream serviceAccount = serviceAccountKey.getInputStream();

        // Build the Firebase options with the credentials.
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        // This is a safety check. It ensures that you don't try to initialize
        // the Firebase app more than once, which would cause a crash.
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        // Return the initialized FirebaseAuth instance.
        return FirebaseAuth.getInstance();
    }
}

