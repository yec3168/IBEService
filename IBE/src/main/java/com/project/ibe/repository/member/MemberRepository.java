package com.project.ibe.repository.member;

import com.project.ibe.entity.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    boolean existsByMemberEmail(String memberEmail);
    Optional<Member> findByMemberEmail(String memberEmail);
    boolean existsByMemberPhone (String memberPhone);
    Optional<Member> findByMemberNameAndMemberPhone(String memberName, String memberPhone);
    Optional<Member> findByMemberId(Long memberId);
//    Optional<Member> findByMemberSocialId (String memberSocialId);
}
