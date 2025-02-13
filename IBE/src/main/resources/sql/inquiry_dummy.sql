INSERT INTO inquiry (inquiry_category, inquiry_title, inquiry_content, inquiry_created_at, member_id) VALUES
('DELIVERY', '배송 지연 확인 요청', '최근 주문한 상품의 배송이 지연되고 있습니다. 확인 부탁드립니다.', NOW(), 1),
('PRODUCT_DEFECT', '구매한 상품의 결함', '구매한 상품에 흠이 있어 환불 요청합니다.', NOW(), 2),
('POINT_CHARGE', '포인트 충전 방법', '포인트 충전 방법을 설명해주세요.', NOW(), 1),
('POINT_PAYBACK', '포인트 환급 문의', '포인트 환급 방법을 설명해주세요.', NOW(), 3),
('INQ_MISC', '기타 문의 사항', '사이트 회원 수가 궁금합니다.', NOW(), 1),
('DELIVERY', '배송 주소 변경 요청', '배송 주소를 변경하고 싶습니다.', NOW(), 2),
('PRODUCT_DEFECT', '물품 불량 문제', '받은 상품이 불량입니다. 환불해주세요.', NOW(), 3),
('POINT_PAYBACK', '포인트 환급 문의', '포인트 환급금 이체가 지연되고 있습니다.', NOW(), 2),
('INQ_MISC', '기타 질문', '제품 사용법에 대해 질문 있습니다.', NOW(), 1),
('DELIVERY', '배송 추적 문의', '내 주문의 배송 상태를 알고 싶습니다.', NOW(), 3),
('PRODUCT_DEFECT', '제품 교환 요청', '구매한 제품의 색상이 사진과 다릅니다. 환불해 주세요.', NOW(), 1),
('POINT_CHARGE', '포인트 잔여 확인', '내 포인트 잔여량을 확인하고 싶습니다.', NOW(), 2),
('POINT_PAYBACK', '환급 문의', '포인트 환급이 잘못되었습니다.', NOW(), 3),
('INQ_MISC', '회원 가입 문의', '회원 가입 과정에서 문제가 발생했습니다.', NOW(), 1),
('DELIVERY', '배송비 문의', '배송비가 착불로 청구되었습니다.', NOW(), 2),
('PRODUCT_DEFECT', '하자 있는 제품 문의', '구입한 제품이 파손된 상태입니다.', NOW(), 1),
('POINT_PAYBACK', '환급 기간 문의', '포인트 환급 소요 기간이 얼마나 될까요?', NOW(), 2),
('INQ_MISC', '기타 서비스 문의', '서비스 이용에 대한 문의입니다.', NOW(), 1),
('INQ_MISC', '배송 주소 확인', '배송 주소를 다시 한 번 확인하고 싶습니다.', NOW(), 1),
('INQ_MISC', '도배 유저 신고', '누가 제 판매 게시글에 도배하고 있어요. 제제해주세요.', NOW(), 1)
;

INSERT INTO inquiry_answer (inquiry_answer_content, inquiry_answer_created_at, inquiry_id, member_id) VALUES
('배송이 지연된 이유는 물류 센터의 처리 지연입니다. 빠른 시일 내에 배송이 완료될 예정입니다.', NOW(), 1, 2),
('해당 제품은 결함이 확인되었습니다. 환불 또는 교환을 원하시면 고객센터로 문의 부탁드립니다.', NOW(), 2, 3),
('포인트 충전은 마이페이지에서 충전 버튼을 눌러 주시면 됩니다. 카드 결제나 계좌 이체를 통해 가능합니다.', NOW(), 3, 1),
('포인트 환급은 지급된 포인트 내역에서 확인하실 수 있습니다. 지급 완료된 포인트는 일정 기간 내에 환급됩니다.', NOW(), 4, 2),
('사이트 회원 수는 현재 약 500,000명 이상입니다. 회원 가입은 무료로 진행하실 수 있습니다.', NOW(), 5, 3),
('배송 주소 변경은 고객센터를 통해 신청하시면 처리가 가능합니다. 번거로우시겠지만 다시 한 번 확인 부탁드립니다.', NOW(), 6, 1),
('상품 불량에 대해서 사과의 말씀 드리며, 환불 절차는 고객센터에서 도와드리겠습니다.', NOW(), 7, 2),
('포인트 환급에 지연이 발생한 점 사과드리며, 현재 처리 중에 있습니다. 빠른 시일 내에 환급이 완료될 예정입니다.', NOW(), 8, 3),
('제품 사용법에 대한 문의는 사용자 매뉴얼을 참조하시거나 고객센터로 문의 주시면 도움을 드리겠습니다.', NOW(), 9, 2),
('배송 상태는 운송장 번호로 실시간 조회가 가능합니다. 자세한 내용은 해당 운송사의 사이트에서 확인 가능합니다.', NOW(), 10, 1),
('구매한 제품이 색상 차이가 있었습니다. 해당 문제에 대해 교환을 도와드리겠습니다.', NOW(), 11, 3),
('포인트 잔여량은 마이페이지에서 확인하실 수 있습니다. 잔여 포인트가 적다면 충전이 필요할 수 있습니다.', NOW(), 12, 2),
('환급이 잘못 처리된 것 같다면 고객센터로 문의 부탁드립니다. 신속하게 처리해드리겠습니다.', NOW(), 13, 1),
('회원 가입 과정에서 오류가 발생한 점 사과드립니다. 해당 문제는 고객센터에서 처리해 드리겠습니다.', NOW(), 14, 3),
('배송비가 착불로 청구된 것은 주문 시 선택된 결제 방식에 따라 결정됩니다. 자세한 사항은 마이페이지에서 확인 가능합니다.', NOW(), 15, 2),
('구입한 제품이 파손된 상태로 배송된 점 사과드립니다. 교환 또는 환불을 원하시면 고객센터로 문의해주세요.', NOW(), 16, 1),
('환급 소요 기간은 약 3~5일 정도 걸릴 수 있습니다. 더 빠른 처리가 필요하시면 고객센터로 문의 부탁드립니다.', NOW(), 17, 3),
('서비스 이용 관련 문의는 고객센터로 직접 문의해 주시면 안내드리겠습니다. 감사합니다.', NOW(), 18, 1),
('배송 주소를 다시 확인하실 필요가 있으면 고객센터에 문의해 주세요. 주소 수정은 직접 가능합니다.', NOW(), 19, 2)
;

UPDATE inquiry SET inquiry_answered = true WHERE inquiry_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19);

