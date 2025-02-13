package com.project.ibe.dto.mypage;

import com.project.ibe.entity.common.Bank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberInfoResponse {
    private String memberName;
    private String memberEmail;
    private String memberNickName;
    private Long memberPoint;
    private String memberPhone;
    private String memberAddr;
    private String memberAddrDetail;
    private String memberAccountNumber;
    private Bank memberBank;
}
