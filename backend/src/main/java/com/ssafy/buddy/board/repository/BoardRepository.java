package com.ssafy.buddy.board.repository;

import com.ssafy.buddy.board.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByCategory(String category);
}
