package com.auth.service.Controller;

import com.auth.service.Model.User;
import com.auth.service.Service.UserService;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth") // The base path for all authentication-related endpoints
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * NEW REGISTRATION STEP 1:
     * Receives user details, creates a temporary record, and triggers an OTP email.
     */
    @PostMapping("/register/request")
    public ResponseEntity<String> requestRegistrationOtp(@RequestBody User user) {
        try {
            userService.requestRegistrationOtp(user);
            return ResponseEntity.ok("Verification OTP sent to your email.");
        } catch (IllegalStateException e) {
            // This happens if the email/phone is already in use
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            // Handle other potential errors during the process
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    /**
     * NEW REGISTRATION STEP 2:
     * Receives the email and OTP, verifies them, and finalizes the user account.
     */
    @PostMapping("/register/verify")
    public ResponseEntity<?> verifyAndCreateUser(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String otp = payload.get("otp");
            if (email == null || otp == null) {
                return ResponseEntity.badRequest().body("Email and OTP are required.");
            }
            User createdUser = userService.verifyRegistrationAndCreateUser(email, otp);
            // On success, return the newly created user object with a 201 status
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Firebase error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * LOGIN STEP 1: Requests an OTP for an existing, verified user.
     */
    @PostMapping("/login/request")
    public ResponseEntity<String> requestLoginOtp(@RequestBody Map<String, String> payload) {
        try {
            String identifier = payload.get("identifier");
            if (identifier == null || identifier.isBlank()) {
                return ResponseEntity.badRequest().body("Identifier is required.");
            }
            userService.requestLoginOtp(identifier);
            return ResponseEntity.ok("Login OTP has been sent to your email.");
        } catch (RuntimeException e) {
            // Catches errors like "User not found" or "Account not verified"
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * LOGIN STEP 2: Verifies the OTP and returns the user data for login.
     */
    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyLoginOtp(@RequestBody Map<String, String> payload) {
        try {
            String identifier = payload.get("identifier");
            String otp = payload.get("otp");
            if (identifier == null || otp == null) {
                return ResponseEntity.badRequest().body("Identifier and OTP are required.");
            }
            User user = userService.verifyLoginOtp(identifier, otp);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            // Catches errors like "Invalid OTP" or "OTP has expired"
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

