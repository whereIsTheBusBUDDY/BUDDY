package com.ssafy.buddy.board.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.board.domain.request.BoardRequest;
import com.ssafy.buddy.board.domain.response.BoardResponse;
import com.ssafy.buddy.board.domain.response.LastNoticeResponse;
import com.ssafy.buddy.board.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    @GetMapping // 게시판 전체 조회
    public ResponseEntity<List<BoardResponse>> getAllBoards(@RequestParam String category) {
        return ResponseEntity.ok(boardService.getAllBoards(category));
    }

    @GetMapping("/{boardId}") // 게시판 상세 조회
    public ResponseEntity<BoardResponse> getBoardById(@PathVariable Long boardId) {
        return ResponseEntity.ok(boardService.getOneBoard(boardId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/notice") // 공지사항 쓰기
    public ResponseEntity<Void> createNotice(@Valid @RequestBody BoardRequest boardRequest, @LoginMember Long memberId) {
        boardService.createNotice(boardRequest, memberId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/free") // 자유게시판 쓰기
    public ResponseEntity<Void> createFreeBoard(@Valid @RequestBody BoardRequest boardRequest, @LoginMember Long memberId) {
        boardService.createFree(boardRequest, memberId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{boardId}") // 게시판 글 수정
    public ResponseEntity<Void> updateBoard(@Valid @RequestBody BoardRequest boardRequest, @LoginMember Long memberId, @PathVariable Long boardId) {
        boardService.updateBoard(boardRequest, memberId, boardId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{boardId}") // 게시판 글 삭제
    public ResponseEntity<Void> deleteBoard(@LoginMember Long memberId, @PathVariable Long boardId) {
        boardService.deleteBoard(memberId, boardId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notice/last")
    public LastNoticeResponse getLastNotice() {
        return boardService.getLastNotice();
    }
}