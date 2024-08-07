package com.ssafy.buddy.bookmark.service;

import com.ssafy.buddy.bookmark.controller.response.BookmarkResponse;
import com.ssafy.buddy.bookmark.domain.Bookmark;
import com.ssafy.buddy.bookmark.repository.BookmarkRepository;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.repository.MemberRepository;
import com.ssafy.buddy.station.domain.Station;
import com.ssafy.buddy.station.repository.StationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookmarkService {
    private final MemberRepository memberRepository;
    private final StationRepository stationRepository;
    private final BookmarkRepository bookmarkRepository;

    public void addBookmark(Long memberId, int stationId) {
        Member member = findByMemberId(memberId);
        Station station = findByStationId(stationId);
        if (bookmarkRepository.existsByMemberIdAndStationId(memberId, stationId)) {
            throw new IllegalArgumentException("이미 등록된 북마크.");
        }
        Bookmark bookmark = new Bookmark(member, station);
        bookmarkRepository.save(bookmark);
    }

    public void removeBookmark(Long memberId, int stationId) {
        bookmarkRepository.deleteByMemberIdAndStationId(memberId, stationId);
    }

    public List<BookmarkResponse> getMyBookmarks(Long memberId) {
        List<Bookmark> bookmarks = bookmarkRepository.findAllByMemberId(memberId);

        return bookmarks.stream()
                .map(bookmark -> new BookmarkResponse(
                        bookmark.getStation().getId(),
                        bookmark.getStation().getStationName(),
                        true
                ))
                .collect(Collectors.toList());
    }

    public List<BookmarkResponse> getStationsWithBookmarks(Long memberId, int busLine) {
        List<Station> stations = stationRepository.findAllByBusLine(busLine);
        List<Bookmark> bookmarks = bookmarkRepository.findAllByMemberId(memberId);

        List<Integer> bookmarkedStationIds = bookmarks.stream()
                .map(bookmark -> bookmark.getStation().getId())
                .toList();

        return stations.stream()
                .map(station -> new BookmarkResponse(
                        station.getId(),
                        station.getStationName(),
                        bookmarkedStationIds.contains(station.getId())
                ))
                .collect(Collectors.toList());
    }

    private Member findByMemberId(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원(memberId: " + memberId + ")이 존재하지 않습니다."));
    }

    private Station findByStationId(int stationId) {
        return stationRepository.findById(stationId)
                .orElseThrow(() -> new EntityNotFoundException("정거장(memberId: " + stationId + ")이 존재하지 않습니다."));
    }
}
