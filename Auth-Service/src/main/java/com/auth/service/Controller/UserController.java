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
@RequestMapping("/auth") // Simplified path. The "/api" is handled by the gateway.
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (FirebaseAuthException e) {
            // Handle Firebase-specific errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Firebase error: " + e.getMessage());
        } catch (IllegalStateException e) {
            // Handle existing user errors
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            // Handle any other unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @PostMapping("/login/request")
    public ResponseEntity<String> requestOtp(@RequestBody Map<String, String> payload) {
        try {
            String identifier = payload.get("identifier");
            if (identifier == null || identifier.isBlank()) {
                return ResponseEntity.badRequest().body("Identifier (email or phone) is required.");
            }
            String otp = userService.requestOtp(identifier);
            // In a real app, you would NOT return the OTP in the response.
            return ResponseEntity.ok("OTP sent successfully. For testing, the OTP is: " + otp);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/login/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> payload) {
        try {
            String identifier = payload.get("identifier");
            String otp = payload.get("otp");
            if (identifier == null || otp == null) {
                return ResponseEntity.badRequest().body("Identifier and OTP are required.");
            }
            String result = userService.verifyOtp(identifier, otp);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
