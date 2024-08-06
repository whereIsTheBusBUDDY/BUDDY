package com.ssafy.buddy.comment.service;

import com.ssafy.buddy.board.domain.Board;
import com.ssafy.buddy.board.repository.BoardRepository;
import com.ssafy.buddy.comment.domain.Comment;
import com.ssafy.buddy.comment.domain.request.CommentRequest;
import com.ssafy.buddy.comment.repository.CommentRepository;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;

    //댓글 쓰기
    @Transactional
    public void writeComment(Long boardId, CommentRequest commentRequest, Long memberId) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("없는 게시판"));
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new IllegalArgumentException("부적절한 사용자"));
        commentRepository.save(commentRequest.toEntity(board, member));
    }

    //댓글 수정
    @Transactional
    public void updateComment(Long commentId, CommentRequest commentRequest, Long memberId) {
        Comment comment = getComment(commentId);
        if (!comment.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("권한 없는 사용자");
        }
        comment.changeCommentContent(commentRequest.getCommentContent());
    }

    //댓글 삭제
    @Transactional
    public void deleteComment(Long commentId, Long memberId) {
        Comment comment = getComment(commentId);
        if (!comment.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("권한없는 사용자");
        }
        commentRepository.delete(comment);
    }

    private Comment getComment(Long commentId) {
        return commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("없는 아이디"));
    }
}
