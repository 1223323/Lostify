package com.Lostify.Lostify.controller;

import com.Lostify.Lostify.model.University;
import com.Lostify.Lostify.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UniversityController {

    private final UniversityRepository universityRepository;

    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        return ResponseEntity.ok(universityRepository.findAll());
    }
    
    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        // Basic validation
        if (university.getName() == null || university.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check if university with the same name already exists
        if (universityRepository.findByName(university.getName()).isPresent()) {
            return ResponseEntity.status(409).build(); // 409 Conflict
        }
        
        University savedUniversity = universityRepository.save(university);
        return ResponseEntity.ok(savedUniversity);
    }
}
