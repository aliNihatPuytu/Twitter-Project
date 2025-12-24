package com.twitterapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "app_user")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "password")
@EqualsAndHashCode(of = "id")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 30)
    @NotNull
    @NotBlank
    @NotEmpty
    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Size(max = 120)
    @Email
    @NotNull
    @NotBlank
    @NotEmpty
    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Size(min = 8, max = 100)
    @NotNull
    @NotBlank
    @NotEmpty
    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin;
}
