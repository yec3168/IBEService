package com.project.ibe.dto.product;

import lombok.Data;

@Data
public class ProductListResponse {
    private Long productId;
    private String productCategory; // 카테고리
    private String productTitle;    //타이틀
    private int productHit; // 조회수
    private int productCommentCnt;//댓글수 예정
    private String productConditionState;
    private String productTradeState; // 거래상태
    private Long productPoint;

    private String thumbnail;// 썸네일.
}
