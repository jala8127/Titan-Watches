package com.titan.watches.Service;

import com.titan.watches.Model.User;
import com.titan.watches.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(User userInput) {
        userRepository.findByEmailOrPhoneNumber(userInput.getEmail(), userInput.getPhoneNumber()).ifPresent(u -> {
            throw new IllegalStateException("User with this email or phone number already exists.");
        });

        User newUser = new User();
        newUser.setName(userInput.getName());
        newUser.setEmail(userInput.getEmail());
        newUser.setPhoneNumber(userInput.getPhoneNumber());

        return userRepository.save(newUser);
    }

    public String requestOtp(String identifier) {
        User user = userRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier));

        String otp = new Random().ints(1, 0, 10).mapToObj(String::valueOf).limit(6).collect(Collectors.joining());

        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        return otp;
    }

    public String verifyOtp(String identifier, String otp) {
        User user = userRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("User not found with identifier: " + identifier));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired.");
        }

        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
        return "OTP verified successfully. Login successful!";
    }
}

