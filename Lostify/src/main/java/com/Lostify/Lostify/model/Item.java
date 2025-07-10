package com.Lostify.Lostify.model;




import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
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

    private String imageUrl;
}
