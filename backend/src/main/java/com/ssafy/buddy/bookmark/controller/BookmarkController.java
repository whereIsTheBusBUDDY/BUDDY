package com.ssafy.buddy.bookmark.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @PostMapping("/bookmarks")
    public void addBookmark(@LoginMember Long memberId, @RequestParam("stationId") int stationId) {
        bookmarkService.addBookmark(memberId, stationId);
    }

    @DeleteMapping("/bookmarks")
    public void removeBookmark(@LoginMember Long memberId, @RequestParam("stationId") int stationId) {
        bookmarkService.removeBookmark(memberId, stationId);
    }
}
