package com.leadplatform.leadmanagement.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leadplatform.leadmanagement.dto.AuthResponse;
import com.leadplatform.leadmanagement.dto.LoginRequest;
import com.leadplatform.leadmanagement.dto.LoginResponse;
import com.leadplatform.leadmanagement.dto.RegisterRequest;
import com.leadplatform.leadmanagement.entity.Role;
import com.leadplatform.leadmanagement.entity.User;
import com.leadplatform.leadmanagement.repository.UserRepository;
import com.leadplatform.leadmanagement.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "A user with this email already exists"
            );
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));

        Role selectedRole =
                request.role() == null ? Role.MEMBER : request.role();

        user.setRole(selectedRole);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "User registered successfully"
        );
    }
    public LoginResponse login(LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    email,
                    request.password()
            )
        );

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);

        return new LoginResponse(
            token,
            "Bearer",
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }
}