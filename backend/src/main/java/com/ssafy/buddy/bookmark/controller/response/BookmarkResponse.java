package com.ssafy.buddy.bookmark.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BookmarkResponse {
    private int stationId;
    private String stationName;
    private boolean isBookmarked;
}
