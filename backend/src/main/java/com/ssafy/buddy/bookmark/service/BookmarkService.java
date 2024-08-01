package com.ssafy.buddy.bookmark.service;

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
        Bookmark bookmark = new Bookmark(member, station);
        bookmarkRepository.save(bookmark);
    }

    public void removeBookmark(Long memberId, int stationId) {
        bookmarkRepository.deleteByMemberIdAndStationId(memberId, stationId);
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
