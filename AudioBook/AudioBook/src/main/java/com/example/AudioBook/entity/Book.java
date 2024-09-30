package com.example.AudioBook.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "book")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    @Column(name = "published_at")
    private String published_at;
}
