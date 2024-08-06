package com.ssafy.buddy.comment.domain.request;


import com.ssafy.buddy.board.domain.Board;
import com.ssafy.buddy.comment.domain.Comment;
import com.ssafy.buddy.member.domain.Member;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {
    private String commentContent;

    public Comment toEntity(Board board, Member member) {
        return Comment.builder()
                .commentContent(commentContent)
                .board(board)
                .member(member)
                .build();
    }
}
