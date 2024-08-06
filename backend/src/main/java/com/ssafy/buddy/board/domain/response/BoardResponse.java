package com.ssafy.buddy.board.domain.response;

import com.ssafy.buddy.board.domain.Board;
import com.ssafy.buddy.comment.domain.Comment;
import com.ssafy.buddy.comment.domain.response.CommentResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class BoardResponse {
    private Long boardId;
    private String boardContent;
    private String title;
    private String category;
    private LocalDateTime createDate;
    private String boardMemberNickname;
    private List<CommentResponse> comments;

    public BoardResponse(Long boardId, String boardContent, String title, String category, LocalDateTime createDate, String boardMemberNickname) {
        this.boardId = boardId;
        this.boardContent = boardContent;
        this.title = title;
        this.category = category;
        this.createDate = createDate;
        this.boardMemberNickname = boardMemberNickname;
    }

    public static BoardResponse toDto(Board board, String nickname) {
        return new BoardResponse(board.getBoardId(), board.getContent(),
                board.getTitle(), board.getCategory(), board.getCreateDate(), nickname);
    }

    public static BoardResponse toDto(Board board, String nickname, List<CommentResponse> comment) {
        return new BoardResponse(board.getBoardId(), board.getContent(),
                board.getTitle(), board.getCategory(), board.getCreateDate(), nickname, comment);
    }
}
