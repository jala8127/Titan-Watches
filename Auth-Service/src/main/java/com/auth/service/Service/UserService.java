package com.auth.service.Service;

import com.auth.service.Model.User;
import com.auth.service.Repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FirebaseAuth firebaseAuth;

    /**
     * Registers a new user.
     * 1. Checks if the user already exists in MongoDB.
     * 2. Creates the user in Firebase Authentication to trigger the welcome email.
     * 3. If Firebase creation is successful, saves the user to MongoDB.
     */
    public User registerUser(User userInput) throws FirebaseAuthException {
        // 1. Check for existing user in the local MongoDB database
        userRepository.findByEmailOrPhoneNumber(userInput.getEmail(), userInput.getPhoneNumber()).ifPresent(u -> {
            throw new IllegalStateException("User with this email or phone number already exists.");
        });

        // 2. Create the user in Firebase Authentication
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(userInput.getEmail())
                .setEmailVerified(false)
                .setPhoneNumber(userInput.getPhoneNumber())
                .setDisplayName(userInput.getName())
                // Firebase requires a password, so we generate a random, secure one the user won't need
                .setPassword(UUID.randomUUID().toString())
                .setDisabled(false);

        try {
            UserRecord userRecord = firebaseAuth.createUser(request);
            System.out.println("Successfully created new user in Firebase: " + userRecord.getUid());

            // 3. If Firebase creation succeeds, save the user to MongoDB
            User newUser = new User();
            newUser.setName(userInput.getName());
            newUser.setEmail(userInput.getEmail());
            newUser.setPhoneNumber(userInput.getPhoneNumber());
            // You can optionally store the Firebase UID in your User model
            // newUser.setFirebaseUid(userRecord.getUid());

            return userRepository.save(newUser);

        } catch (FirebaseAuthException e) {
            System.err.println("Error creating Firebase user: " + e.getMessage());
            // Re-throw the exception to be handled by the controller
            throw e;
        }
    }

    /**
     * Generates and saves an OTP for a user for login.
     */
    public String requestOtp(String identifier) {
        User user = userRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier));

        // Generate a random 6-digit OTP
        String otp = new Random().ints(0, 10)
                .limit(6)
                .mapToObj(String::valueOf)
                .collect(Collectors.joining());

        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5)); // OTP is valid for 5 minutes
        userRepository.save(user);

        // In a real application, you would send this OTP via email or SMS here.
        System.out.println("Generated OTP for " + identifier + ": " + otp);

        return otp;
    }

    /**
     * Verifies the provided OTP for a given user.
     */
    public String verifyOtp(String identifier, String otp) {
        User user = userRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired.");
        }

        // OTP is valid, clear it from the database
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return "OTP verified successfully. Login successful!";
    }
}
