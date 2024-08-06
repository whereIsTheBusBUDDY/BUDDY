package com.ssafy.buddy.comment.repository;

import com.ssafy.buddy.board.domain.Board;
import com.ssafy.buddy.comment.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByBoard(Board board);
}
