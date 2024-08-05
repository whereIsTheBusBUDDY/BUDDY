package com.ssafy.buddy.board.service;

import com.ssafy.buddy.board.domain.Board;
import com.ssafy.buddy.board.domain.request.BoardRequest;
import com.ssafy.buddy.board.domain.response.BoardResponse;
import com.ssafy.buddy.board.repository.BoardRepository;
import com.ssafy.buddy.member.domain.Member;
import com.ssafy.buddy.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {


    private static final String BOARD_NOT_FOUND_MESSAGE = "게시글을 찾을 수 없습니다.";
    private static final String MEMBER_NOT_FOUND_MESSAGE = "회원 정보를 찾을 수 없습니다.";
    private static final String UNAUTHORIZED_MESSAGE = "본인만 수정할 수 있습니다.";

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public List<BoardResponse> getAllBoards(String category) {
        List<Board> boards = boardRepository.findByCategory(category);
        List<BoardResponse> responses = new ArrayList<>();

        for (Board board : boards) {
            String name = board.getMember().getName();
            responses.add(BoardResponse.toDto(board, name));
        }
        return responses;
    }

    public BoardResponse getOneBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        String memberName = board.getMember().getName();

        return new BoardResponse(
                board.getBoardId(),
                board.getTitle(),
                board.getContent(),
                board.getCategory(),
                board.getCreateDate(),
                memberName
        );
    }




    @Transactional //공지사항
    public void createNotice(BoardRequest boardRequest, Long memberId) {
        createBoard(boardRequest, "notice", memberId);
    }

    @Transactional // 자유게시판
    public void createFree(BoardRequest boardRequest, Long memberId) {
        createBoard(boardRequest, "free", memberId);
    }

    @Transactional
    public void createBoard(BoardRequest request, String category, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException(MEMBER_NOT_FOUND_MESSAGE));

        Board board = new Board(request.getContent(), request.getTitle(), category, member);
        boardRepository.save(board);
    }

    @Transactional
    public void updateBoard(BoardRequest request, Long memberId, Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException(BOARD_NOT_FOUND_MESSAGE));

        if (!board.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException(UNAUTHORIZED_MESSAGE);
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        boardRepository.save(board);
    }

    @Transactional
    public void deleteBoard(Long memberId, Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException(BOARD_NOT_FOUND_MESSAGE));

        if (!board.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException(UNAUTHORIZED_MESSAGE);
        }
        boardRepository.delete(board);
    }
}
