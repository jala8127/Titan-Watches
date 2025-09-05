package com.titan.watches.Controller;

import com.titan.watches.Model.User;
import com.titan.watches.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
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
            return ResponseEntity.ok("OTP sent successfully. (OTP for testing: " + otp + ")");
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
