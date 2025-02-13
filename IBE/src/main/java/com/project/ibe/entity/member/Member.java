package com.project.ibe.entity.member;

import com.project.ibe.entity.common.AuditingFields;
import com.project.ibe.entity.common.Role;
import com.project.ibe.entity.common.SocialType;
import com.project.ibe.util.Encrypt256;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PUBLIC) //protected
@Getter @Setter
@Table(name = "member")
public class Member extends  AuditingFields{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;              // pk 회원번호

    @Column(nullable = false)
    @Size(min = 2, max = 8)
    private String memberName;          // 이름

    @Column(nullable = false)
    @Size(min = 2, max = 8)
    private String memberNickName;      // 닉네임

//    @Column(nullable = false)
//    private Date memberBirth;           // 생일

    @Column(nullable = false, unique = true)
//    @Size(min=5, max = 15)
    @Convert(converter = Encrypt256.class)
    private String memberPhone;         // 전화번호

    @Convert(converter = Encrypt256.class)
    @Column(nullable = false)
    private String memberAddr;          // 주소

    @Convert(converter = Encrypt256.class)
    @Column(nullable = true)
    private String memberAddrDetail;    // 상세주소

    @Column(nullable = false, unique = true)
    private String memberEmail;         // 이메일

    @Column(nullable = false)
    private String memberPassword;      // 비밀번호

//    @Column(nullable = false)
//    @Enumerated(EnumType.STRING)
//    private Bank memberBank;            // 환급은행

//    @Column(nullable = false)
//    private String memberAccountNumber; // 환급계좌

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime entryDate;    // 가입날짜

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updateDate;   // 수정날짜

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;                  // 권한

    @Column(nullable = false)
    private Long memberPoint;           // 보유포인트

    @Column(nullable = true)
    private String memberAuthNumber;     // 인증번호

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SocialType memberSocialType;      // 회원가입 경로.

    @Column(nullable = true, unique = true)
    private String memberSocialId;            // 소셜 아이디.

    @Column(nullable = true)
    private Boolean memberDeleted;
}
