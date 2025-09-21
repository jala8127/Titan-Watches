package com.auth.service.Service;

import com.auth.service.Model.User;
import com.auth.service.Repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FirebaseAuth firebaseAuth;
    private final JavaMailSender mailSender;
    private final CacheManager cacheManager;

    private record OtpData(String otp, User userDetails) {}

    public void requestRegistrationOtp(User userInput) {
        // Trim whitespace from email
        if (userInput.getEmail() != null) {
            userInput.setEmail(userInput.getEmail().trim());
        }

        // --- NEW LOGIC TO FORMAT THE PHONE NUMBER ---
        String phoneNumber = userInput.getPhoneNumber();
        if (phoneNumber != null && !phoneNumber.isBlank()) {
            // If the number doesn't already start with a '+', prepend the country code.
            // We are assuming +91 for India here.
            if (!phoneNumber.startsWith("+")) {
                userInput.setPhoneNumber("+91" + phoneNumber.replaceAll("\\s+", "")); // Also removes any spaces
            }
        } else {
            // Ensure blank phone numbers are stored as null
            userInput.setPhoneNumber(null);
        }
        // --- END OF NEW LOGIC ---

        // Check if a VERIFIED user already exists.
        if (userRepository.findByEmail(userInput.getEmail()).isPresent()) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        String otp = generateOtp();
        String email = userInput.getEmail();

        // Store OTP and formatted user details in the cache
        Cache otpCache = cacheManager.getCache("registrationOtpCache");
        if (otpCache != null) {
            otpCache.put(email, new OtpData(otp, userInput));
        }

        sendOtpEmail(email, otp, "Your Titan Watches Verification Code");
    }

    // The rest of your UserService file remains exactly the same.
    // ... verifyRegistrationAndCreateUser, requestLoginOtp, etc. ...
    // No changes are needed in the other methods.
    public User verifyRegistrationAndCreateUser(String email, String otp) throws FirebaseAuthException {
        Cache otpCache = cacheManager.getCache("registrationOtpCache");
        OtpData storedData = (otpCache != null) ? otpCache.get(email, OtpData.class) : null;

        if (storedData == null) {
            throw new RuntimeException("No registration process found or it has expired. Please try again.");
        }

        if (!Objects.equals(storedData.otp(), otp)) {
            throw new RuntimeException("The code you entered is incorrect.");
        }

        User userDetails = storedData.userDetails();

        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(userDetails.getEmail())
                .setEmailVerified(true)
                .setPhoneNumber(userDetails.getPhoneNumber()) // This will now be in E.164 format
                .setDisplayName(userDetails.getName())
                .setPassword(UUID.randomUUID().toString())
                .setDisabled(false);

        try {
            firebaseAuth.createUser(request);

            User newUser = new User();
            newUser.setName(userDetails.getName());
            newUser.setEmail(userDetails.getEmail());
            newUser.setPhoneNumber(userDetails.getPhoneNumber());
            newUser.setVerified(true);

            otpCache.evict(email);

            return userRepository.save(newUser);

        } catch (FirebaseAuthException e) {
            System.err.println("Firebase user creation failed for: " + email + ". Error: " + e.getMessage());
            if(otpCache != null) {
                otpCache.evict(email);
            }
            throw e;
        }
    }

    public void requestLoginOtp(String identifier) {
        User user = userRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("No account found with this email or phone number."));

        if (!user.isVerified()) {
            throw new IllegalStateException("This account has not been verified yet. Please complete the registration process.");
        }

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
        sendOtpEmail(user.getEmail(), otp, "Your Titan Watches Login Code");
    }

    public User verifyLoginOtp(String identifier, String otp) {
        User user = userRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found."));

        verifyOtpLogic(user, otp);

        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return user;
    }

    private String generateOtp() {
        return new Random().ints(0, 10)
                .limit(6)
                .mapToObj(String::valueOf)
                .collect(Collectors.joining());
    }

    private void sendOtpEmail(String email, String otp, String subject) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText("Your verification code is: " + otp);
        mailSender.send(message);
        System.out.println("Sent OTP to " + email);
    }

    private void verifyOtpLogic(User user, String otp) {
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("The code you entered is incorrect.");
        }
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Your code has expired. Please request a new one.");
        }
    }
}
