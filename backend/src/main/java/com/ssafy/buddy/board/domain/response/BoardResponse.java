package com.ssafy.buddy.board.domain.response;

import com.ssafy.buddy.board.domain.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BoardResponse {
    private Long boardId;
    private String content;
    private String title;
    private String category;
    private LocalDateTime createDate;
    private String memberID;

    public BoardResponse(Long boardId, String titie, String content, String category, String memberName) {
    }

    public static BoardResponse toDto(Board board, String name) {
        return new BoardResponse(board.getBoardId(), board.getContent(), board.getTitle(), board.getCategory(), board.getCreateDate(), name);
    }
}
