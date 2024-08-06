package com.ssafy.buddy.comment.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.comment.domain.request.CommentRequest;
import com.ssafy.buddy.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    // 댓글 쓰기
    @PostMapping("/{boardId}")
    public ResponseEntity<Void> writeComment(@PathVariable Long boardId, @RequestBody CommentRequest commentRequest, @LoginMember Long memberId) {
        commentService.writeComment(boardId, commentRequest, memberId);
        return ResponseEntity.ok().build();
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable Long commentId, @RequestBody CommentRequest commentRequest, @LoginMember Long memberId) {
        commentService.updateComment(commentId, commentRequest, memberId);
        return ResponseEntity.ok().build();
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @LoginMember Long memberId) {
        commentService.deleteComment(commentId, memberId);
        return ResponseEntity.ok().build();
    }
}
