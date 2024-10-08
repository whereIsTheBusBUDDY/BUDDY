package com.ssafy.buddy.comment.domain.response;

import com.ssafy.buddy.comment.domain.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long commentId;
    private String commentContent;
    private LocalDateTime createDate;
    private String nickname;
    private Long commentMemberId;// 댓글 단 사람 아이디

    public static CommentResponse createComment(Comment comment) {
        return new CommentResponse(
                comment.getCommentId(),
                comment.getCommentContent(),
                comment.getCreateDate(),
                comment.getMember().getNickname(),
                comment.getMember().getId()
        );
    }
}
