package com.ssafy.buddy.member.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.EnumType.STRING;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name = "member")
@NoArgsConstructor(access = PROTECTED)
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "favorite_line", nullable = false)
    private int favoriteLine;

    @Enumerated(value = STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    public Member(String name, String studentId, String nickname, String email, String password, int favoriteLine, Role role) {
        this.name = name;
        this.studentId = studentId;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.favoriteLine = favoriteLine;
        this.role = role;
    }

    public void update(String nickname, int favoriteLine) {
        this.nickname = nickname;
        this.favoriteLine = favoriteLine;
    }

    public void updatePassword(String password) {
        this.password = password;
    }
}
