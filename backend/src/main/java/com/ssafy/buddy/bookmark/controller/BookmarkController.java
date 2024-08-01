package com.ssafy.buddy.bookmark.controller;

import com.ssafy.buddy.auth.supports.LoginMember;
import com.ssafy.buddy.bookmark.controller.response.BookmarkResponse;
import com.ssafy.buddy.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/bookmarks")
    public List<BookmarkResponse> getMyBookmarks(@LoginMember Long memberId) {
        return bookmarkService.getMyBookmarks(memberId);
    }

    @GetMapping("/routes")
    public List<BookmarkResponse> getMyBookmarks(@LoginMember Long memberId, @RequestParam("busId") int busId) {
        return bookmarkService.getStationsWithBookmarks(memberId, busId);
    }
}
