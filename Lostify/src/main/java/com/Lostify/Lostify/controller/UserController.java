package com.Lostify.Lostify.controller;

import com.Lostify.Lostify.model.User;
import com.Lostify.Lostify.dto.UserDTO;
import com.Lostify.Lostify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam("q") String query) {
        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.badRequest().build();
        }

        List<User> users = userRepository.findByUsernameContainingIgnoreCase(query.trim());
        
        List<UserDTO> userDTOs = users.stream()
                .limit(10) // Limit results to 10 users
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(this::convertToUserDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToUserDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}