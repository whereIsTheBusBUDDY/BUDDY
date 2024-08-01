package com.ssafy.buddy.bookmark.domain;

import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.station.domain.Station;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@Table(name = "bookmark")
@NoArgsConstructor(access = PROTECTED)
public class Bookmark {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    public Bookmark(Member member, Station station) {
        this.member = member;
        this.station = station;
    }
}
