package com.ssafy.buddy.bookmark.repository;

import com.ssafy.buddy.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    void deleteByMemberIdAndStationId(Long memberId, int stationId);
}
