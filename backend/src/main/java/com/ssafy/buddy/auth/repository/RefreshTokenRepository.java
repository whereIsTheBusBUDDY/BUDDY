package com.ssafy.buddy.auth.repository;

import com.ssafy.buddy.auth.controller.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
}
