import { Container, Row, Col, Button, Form, Nav, Tab, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Mypage.css';
import { getInquiries } from '../service/InquiryService';

const MypageInquiryListComponent = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [startDate, setStartDate] = useState('2024-10-25');
    const [endDate, setEndDate] = useState('2024-11-08');
    
    const handleDateChange = () => {
        setLoading(true);
        setError(null);

        const endDateAdjusted = new Date(endDate);
        endDateAdjusted.setHours(23, 59, 59, 999); // 자정까지의 게시글 조회

        getInquiries()
            .then(response => {
                if (response && response.data.data.data && Array.isArray(response.data.data.data)) {
                    const filteredInquiries = response.data.data.data.filter(inquiry => {
                        const inquiryDate = new Date(inquiry.inquiryCreatedAt);
                        const start = new Date(startDate);
                        const end = endDateAdjusted;
                        return inquiryDate >= start && inquiryDate <= end;
                    });

                    setInquiries(filteredInquiries);
                } else {
                    setError('문의 내역을 가져오는 데 실패했습니다. 데이터 형식이 올바르지 않습니다.');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('문의 내역을 가져오는 데 실패했습니다.');
                setLoading(false);
            });
    };

    useEffect(() => {
        handleDateChange();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container className="mt-5 text-center containerInqList">
            {/* 1:1 문의 타이틀 */}
            <h1 id="h1_inqListTitle">문의 내역</h1>

            {/* 구분선 */}
            <hr />

            <Row className="align-items-center mt-4">
                {/* 날짜 선택 */}
                <Col md={3}>
                    <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </Col>
                <Col md="auto" className="text-center">
                    <span>~</span>
                </Col>
                <Col md={3}>
                    <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </Col>

                {/* 조회 버튼 */}
                <Col md="auto">
                    <Button id="button_inqSearchDate" onClick={handleDateChange}>
                        조회
                    </Button>
                </Col>
            </Row>

            {/* 탭 */}
            <Tab.Container defaultActiveKey="inqAll">
                {/* 탭 메뉴 */}
                <Nav variant="tabs" className="mt-4" id="nav_inqListTab">
                    <Nav.Item>
                        <Nav.Link eventKey="inqAll" className="inqListTab">전체</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="inqProcessing" className="inqListTab">답변 대기</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="inqComplete" className="inqListTab">답변 완료</Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* 문의 내역 */}
                <Tab.Content className="mt-3">
                    {/* 전체 탭에 모든 문의 내용 표시 */}
                    <Tab.Pane eventKey="inqAll" className="tabpane_inqList">
                        {inquiries.map(inquiry => (
                            <div key={inquiry.inquiryTitle} className="p-3 border rounded d-flex align-items-center mb-2">
                                {/* 상태에 따라 배지 표시 */}
                                <Badge pill className={`me-2 badge_${inquiry.inquiryAnswered ? 'complete' : 'processing'}`}>
                                    {inquiry.inquiryAnswered ? '답변 완료' : '답변 대기'}
                                </Badge>
                                {/* 문의 내용 */}
                                <Link to={`/mypage/inquiry/answer/${inquiry.inquiryTitle}`} className="text-decoration-none">
                                    <span className="hover-highlight">{inquiry.inquiryTitle}</span>
                                </Link>
                            </div>
                        ))}
                    </Tab.Pane>

                    {/* 답변 대기 탭 */}
                    <Tab.Pane eventKey="inqProcessing" className="tabpane_inqList">
                        {inquiries.filter(inquiry => !inquiry.inquiryAnswered).map(inquiry => (
                            <div key={inquiry.inquiryTitle} className="p-3 border rounded d-flex align-items-center mb-2">
                                <Badge pill className="me-2 badge_processing">답변 대기</Badge>
                                <Link to={`/mypage/inquiry/answer/${inquiry.inquiryTitle}`} className="text-decoration-none">
                                    <span className="hover-highlight">{inquiry.inquiryTitle}</span>
                                </Link>
                            </div>
                        ))}
                    </Tab.Pane>

                    {/* 답변 완료 탭 */}
                    <Tab.Pane eventKey="inqComplete" className="tabpane_inqList">
                        {inquiries.filter(inquiry => inquiry.inquiryAnswered).map(inquiry => (
                            <div key={inquiry.inquiryTitle} className="p-3 border rounded d-flex align-items-center mb-2">
                                <Badge pill className="me-2 badge_complete">답변 완료</Badge>
                                <Link to={`/mypage/inquiry/answer/${inquiry.inquiryTitle}`} className="text-decoration-none">
                                    <span className="hover-highlight">{inquiry.inquiryTitle}</span>
                                </Link>
                            </div>
                        ))}
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default MypageInquiryListComponent;
