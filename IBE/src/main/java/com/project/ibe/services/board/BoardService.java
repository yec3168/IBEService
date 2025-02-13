package com.project.ibe.services.board;

import com.project.ibe.dto.board.*;
import com.project.ibe.dto.member.PrincipalDTO;
import com.project.ibe.entity.board.Board;
import com.project.ibe.entity.board.BoardComment;
import com.project.ibe.entity.board.BoardReply;
import com.project.ibe.entity.common.BoardCategory;
import com.project.ibe.entity.member.Member;
import com.project.ibe.exception.BusinessException;
import com.project.ibe.repository.board.BoardCommentRepository;
import com.project.ibe.repository.board.BoardReplyRepository;
import com.project.ibe.repository.board.BoardRepository;
import com.project.ibe.services.member.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final BoardReplyRepository boardReplyRepository;
    private final MemberService memberService;

    private final ModelMapper modelMapper;

    /**
     * 게시판 등록.
     */
    public BoardFormResponse saveBoard(BoardFormRequest boardFormRequest, PrincipalDTO principalDTO){
        // 로그인한 회원 찾기.
        Member member = memberService.getMemberByEmail(principalDTO.getMemberEmail());

        Board board = modelMapper.map(boardFormRequest, Board.class);
        board.setMember(member); // 작성자.
        board.setBoardHit(0);

        Board savedBoard = boardRepository.save(board);

        return modelMapper.map(savedBoard, BoardFormResponse.class);

    }
    
    /**
     * 게시판 상세 정보
     */
    public BoardDetailResponse getBoardDetail(Long id){
        // 게시판 정보.
        Board board = findBoardById(id);

        // 게시글 조회수 1 증가
        board.setBoardHit(board.getBoardHit()+1);
        Board savedBoard =boardRepository.save(board);

        // 상세정보 가져오기.
        BoardDetailResponse boardDetailResponse = modelMapper.map(savedBoard, BoardDetailResponse.class);
        boardDetailResponse.setBoardCommentCnt(getCommentCntByBoard(savedBoard));     //댓글 수 넣어야함.


        return boardDetailResponse;
    }

    /**
     *  게시글 목록 조회.
     */

    public List<BoardListResponse> getBoardList(){
        List<Board> boardList = boardRepository.findByBoardStatus(false);

        List<BoardListResponse> boardListResponseList = new ArrayList<>();
        for(Board board : boardList){
            BoardListResponse boardListResponse = modelMapper.map(board, BoardListResponse.class);
            boardListResponse.setMemberNickName(board.getMember().getMemberNickName());
            boardListResponse.setBoardCommentCnt(getCommentCntByBoard(board));// 댓글 수 추가 예정.
            boardListResponseList.add(boardListResponse);
        }

        return boardListResponseList;
    }

    /**
     * 댓글 목록 조회.
     */
    public List<BoardCommentResponse> getBoardCommentList(Long boardId){
        Board board = findBoardById(boardId);
        // 결과를 저장할 리스트
        List<BoardCommentResponse> boardCommentResponseList = new ArrayList<>();

        // 댓글의 리스트를 가져옴.
        List<BoardComment> boardCommentList = boardCommentRepository.findAllByBoard(board);
        for(BoardComment boardComment : boardCommentList){
            // add할 변수.
            BoardCommentResponse boardCommentResponse = modelMapper.map(boardComment, BoardCommentResponse.class);
            if(boardComment.isBoardCommentStatus()){
                boardCommentResponse.setBoardCommentContent("삭제된 댓글입니다.");
            }
            // 댓글의 대댓글 리스트를 가져옴.
            List<BoardReplyResponse> boardReplyList = boardReplyRepository.findAllByBoardComment(boardComment)
                    .stream()
                    .map(boardReply -> {
                        BoardReplyResponse map = modelMapper.map(boardReply, BoardReplyResponse.class);
                        if(boardReply.isBoardReplyStatus()){
                            map.setBoardReplyContent("삭제된 댓글입니다.");
                        }
                        return map;
                    })
                    .toList();
            boardCommentResponse.setBoardReplyResponseList(boardReplyList);

            boardCommentResponseList.add(boardCommentResponse);
        }

        return boardCommentResponseList;
    }
    /**
     * 댓글 등록.
     */
    public BoardCommentResponse saveBoardComment(BoardCommentRequest boardCommentRequest, PrincipalDTO principalDTO){
        // 댓글 작성자.
        Member member = memberService.getMemberByEmail(principalDTO.getMemberEmail());

        // 게시글
        Board board = findBoardById(boardCommentRequest.getBoardId());


        // 등록.
        BoardComment boardComment = BoardComment.builder()
                .boardCommentContent(boardCommentRequest.getBoardCommentContent())
                .board(board)
                .member(member)
                .build();

        BoardComment savedBoardComment = boardCommentRepository.save(boardComment);

        return modelMapper.map(savedBoardComment, BoardCommentResponse.class);
    }

    /**
     * 대댓글 등록.
     */
    public BoardReplyResponse saveBoardReply(BoardReplyRequest boardReplyRequest , PrincipalDTO principalDTO){
        // 작성자 정보 받아오기
        Member member = memberService.getMemberByEmail(principalDTO.getMemberEmail());

        //게시글 정보 받아오기.
        Board board = findBoardById(boardReplyRequest.getBoardId());

        //게시글 댓글 정보 받아오기
        BoardComment boardComment = boardCommentRepository.findById(boardReplyRequest.getBoardCommentId())
                .orElseThrow(
                        () -> new BusinessException("댓글 정보가 없습니다." ,HttpStatus.NOT_FOUND)
                );

        //등록.
        BoardReply boardReply = BoardReply.builder()
                .boardReplyContent(boardReplyRequest.getBoardReplyContent())
                .board(board)
                .member(member)
                .boardComment(boardComment)
                .build();
        BoardReply saveBoardReply = boardReplyRepository.save(boardReply);


        return modelMapper.map(saveBoardReply, BoardReplyResponse.class);
    }

    public boolean deleteBoardComment(Long boardCommentId){
        BoardComment comment = boardCommentRepository.findById(boardCommentId)
                .orElseThrow(() -> new BusinessException("Member not found", HttpStatus.NOT_FOUND));
        comment.setBoardCommentStatus(true);
        boardCommentRepository.save(comment);
        return true;
    }
    public boolean deleteBoardReply(Long boardReplyId){
        BoardReply reply= boardReplyRepository.findById(boardReplyId)
                .orElseThrow(() -> new BusinessException("Member not found", HttpStatus.NOT_FOUND));
        reply.setBoardReplyStatus(true);
        boardReplyRepository.save(reply);
        return true;
    }
    /**
     * 게시글 아이디로 찾기.
     */
    private Board findBoardById(Long id){
        return boardRepository.findById(id)
                .orElseThrow(
                        () -> new BusinessException("게시글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND)
                );
    }

    /**
     * 게시판 댓글 수.
     */
    private int getCommentCntByBoard(Board board){
        return boardCommentRepository.findAllByBoard(board).size()+boardReplyRepository.countByBoard(board);
    }


//    게시글 삭제
    public boolean deleteBoard(BoardReplyRequest boardReplyRequest) {
        Board existBoard = boardRepository.findByBoardId(boardReplyRequest.getBoardId())
                .orElseThrow(() -> new BusinessException("게시글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND)
        );
        existBoard.setBoardStatus(true);
        boardRepository.save(existBoard);
        return true;
    }


    // 제목으로 검색
    public List<BoardListResponse> searchBoardTitle(String category, String type, String value){
        List<BoardListResponse> boardListResponseList;
        List<Board> boardList;
        log.info("category = "+category);
        log.info("type = "+type);
        log.info("value = "+value);
        if(type.equals("title")) {
            if (category.equals("ALL")) {
                boardList = boardRepository.findByBoardStatusAndBoardTitleContaining(false, value);
            } else {
                boardList = boardRepository.findByBoardStatusAndBoardCategoryAndBoardTitleContaining(false,BoardCategory.valueOf(category) , value);
            }
        }else if(type.equals("name")) {
            if (category.equals("ALL")){
                if (value.isEmpty()) {
                    boardList = boardRepository.findByBoardStatus(false);
                }else
            boardList = boardRepository.findByBoardStatusAndMember_MemberNickName(false, value);
            }
            else{
                if(value.isEmpty()){
                    boardList = boardRepository.findByBoardStatusAndBoardCategory(false,BoardCategory.valueOf(category));
                }else
                boardList = boardRepository.findByBoardStatusAndBoardCategoryAndMember_MemberNickName(false,BoardCategory.valueOf(category),value);
            }

        }else{
            throw new BusinessException("type error", HttpStatus.NOT_FOUND);
        }
        boardListResponseList = new ArrayList<>();
        for (Board board : boardList) {
            BoardListResponse boardListResponse = modelMapper.map(board, BoardListResponse.class);
            boardListResponse.setMemberNickName(board.getMember().getMemberNickName());
            boardListResponse.setBoardCommentCnt(getCommentCntByBoard(board));// 댓글 수 추가 예정.
            boardListResponseList.add(boardListResponse);
        }
        return boardListResponseList;
    }

    // 게시글 수정
    public BoardDetailResponse updateBoard(Long boardId, @Valid BoardFormRequest boardFormRequest) {
        Board board = findBoardById(boardId);
        // 제목, 카테고리, 내용
        board.setBoardTitle(boardFormRequest.getBoardTitle());
        board.setBoardContent(boardFormRequest.getBoardContent());
        board.setBoardCategory(boardFormRequest.getBoardCategory());
        Board savedBoard =boardRepository.save(board);
        BoardDetailResponse boardDetailResponse = modelMapper.map(savedBoard, BoardDetailResponse.class);
        boardDetailResponse.setBoardCommentCnt(getCommentCntByBoard(savedBoard));
        return boardDetailResponse;
    }
}
