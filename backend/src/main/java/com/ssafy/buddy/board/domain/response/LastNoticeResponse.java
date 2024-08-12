package com.ssafy.buddy.board.domain.response;

import com.ssafy.buddy.board.domain.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@AllArgsConstructor
public class LastNoticeResponse {
    private Long boardId;
    private String title;
    private String createdAt;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("M/d HH:mm");

    public static LastNoticeResponse from(Board board) {
        return new LastNoticeResponse(
                board.getBoardId(), board.getTitle(), board.getCreateDate().format(FORMATTER)
        );
    }
}
