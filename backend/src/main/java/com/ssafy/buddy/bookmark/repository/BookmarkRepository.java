package com.ssafy.buddy.bookmark.repository;

import com.ssafy.buddy.bookmark.domain.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    void deleteByMemberIdAndStationId(Long memberId, int stationId);
    List<Bookmark> findAllByMemberId(Long memberId);
    Boolean existsByMemberIdAndStationId(Long memberId, int stationId);
    @Query("SELECT b.member.id FROM Bookmark b WHERE b.station.id = :stationId")
    List<Long> findMemberIdsByStationId(@Param("stationId") int stationId);
}
