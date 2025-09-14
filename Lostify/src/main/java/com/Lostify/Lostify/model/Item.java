package com.Lostify.Lostify.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import com.Lostify.Lostify.domain.ItemStatus;
import com.Lostify.Lostify.domain.ItemCategory;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status;


    @Column(nullable = false)
    private LocalDate dateReported;


    @Column(nullable = false)
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "university_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonProperty("university")
    private University university;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "roles"})
    @JsonProperty("user")
    private User user;

    @Column(length = 1000)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "item_photos", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "photo_url", length = 1000)
    private List<String> photoUrls = new ArrayList<>();

    @Column(length = 15)
    private String contactPhone;

    @Column(length = 100)
    private String contactEmail;
}
