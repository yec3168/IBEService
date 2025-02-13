import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import './Mypage.css';
import point_to_cash_icon from '../assets/images/mypage/point_to_cash_icon.png';
import { getMemberInfo } from '../service/MypageService';

const MypagePointPaybackComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [accountNumber, setAccountNumber] = useState(null);
    const [memberPoint, setMemberPoint] = useState(null);
    const [memberBankData, setMemberBankData] = useState(null);
    const [isExceeded, setIsExceeded] = useState(false);
    const [isError, setIsError] = useState(false); // 에러 메시지 상태 추가

    useEffect(() => {
        if (memberPoint !== null) {
            const inputAmount = parseInt(inputValue) || 0;
            setIsExceeded(inputAmount > memberPoint);
        }
    }, [inputValue, memberPoint]);

    useEffect(() => {
        // 포인트 조회 API 호출
        const fetchMemberPoint = async () => {
            try {
                const response = await getMemberInfo();
                console.log(response);
                if (response.data && response.data.data.memberPoint) {
                    setMemberPoint(response.data.data.memberPoint);
                }
                if (response.data && response.data.data.memberAccountNumber) {
                    setAccountNumber(response.data.data.memberAccountNumber);
                }
                if (response.data && response.data.data.memberBank) {
                    setMemberBankData(response.data.data.memberBank);
                }
            } catch (error) {
                console.error('포인트 조회 실패:', error);
            }
        };

        fetchMemberPoint();
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value.replace(/[^0-9]/g, ''));
        if (parseInt(event.target.value) < 1000) {
            setIsError(true); // 포인트가 1000 미만일 때 에러 메시지 표시
        } else {
            setIsError(false); // 유효한 포인트 입력 시 에러 메시지 제거
        }
    };

    const handleAccountNumberChange = (event) => {
        setAccountNumber(event.target.value);
    };

    const expectedPayback = inputValue ? (parseInt(inputValue) * 10).toLocaleString() : '0';

    const pointButtonEvent = () => {
        if (!inputValue || inputValue === 0 || inputValue > memberPoint || inputValue < 1000) {
            return;
        }
        document.getElementById('point-back-put-bank').style.display = 'inline';
        document.getElementById('point_input_button').style.display = 'none';
        document.getElementById('point_input').setAttribute('disabled', true);
    };

    const pointCancleButtonEvent = () => {
        document.getElementById('popup_result').innerText = '';
        document.getElementById('point-back-put-bank').style.display = 'none';
        document.getElementById('point_input_button').style.display = 'inline';
        document.getElementById('point_input').removeAttribute('disabled');
    };

    let popup;
    const pointPayBackButtonEvent = () => {
        let popupW = 750;
        let popupH = 650;
        let left = Math.ceil((window.screen.width - popupW) / 2);
        let top = Math.ceil((window.screen.height - popupH) / 2);
        if (popup) {
            popup.close();
        }
        popup = window.open('http://localhost:3000/mypage/pntpayback/confirm', '_blank',
            'width=' + popupW + ',height=' + popupH + ',left=' + left + ',top=' + top);
    };

    const accountArr = [
        // { db: "KB", name: "국민은행", num: "004" },
        // { db: "SHINHAN", name: "신한은행", num: "088" },
        // { db: "HANA", name: "하나은행", num: "081" },
        // { db: "WOORI", name: "우리은행", num: "020" },
        { db: "NH", name: "농협은행", num: "011" },
        { db: "KDB", name: "산업은행", num: "002" },
        // { db: "KAKAO", name: "카카오뱅크", num: "090" },
        // { db: "TOSS", name: "토스뱅크", num: "092" }
    ];

    return (
        <>
            <Container className="text-center my-5 mx-5 containerPCharge">
                {/* 포인트 환급 타이틀 */}
                <h1 id="h1_pointTitle">포인트 환급</h1>
                <div id="div_pointInfo" className="text-muted">포인트를 현금으로 전환할 수 있습니다.</div>

                {/* 보유 포인트 */}
                <div id="div_pointData">
                    보유 포인트&nbsp;:&nbsp;
                    <span id="span_point">{memberPoint !== null ? `${memberPoint}` : '로딩중'} </span>
                    <span id="span_p">&nbsp;P</span>
                </div>

                {/* 구분선 */}
                <hr />

                {/* 포인트 환급 금액 입력 */}
                <Container className="my-5">
                    <Row className="justify-content-center align-items-center">
                        <Col xs="auto">
                            <img src={point_to_cash_icon} alt="point_to_cash_icon"
                                style={{ width: '80px', height: '80px', marginLeft: '0px', marginRight: '10px' }} />
                        </Col>
                        <Col xs={12} md={8}>
                            <Form inline className="d-flex align-items-center">
                                <Form.Group controlId="formPointInput">
                                    <Form.Control
                                        id='point_input'
                                        type="text"
                                        placeholder="환급 받을 포인트를 입력해주세요."
                                        style={{ borderColor: '#FFB800', width: '500px', height: '50px' }}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Button onClick={() => pointButtonEvent()} id="point_input_button"
                                    style={{ backgroundColor: '#FFD54F', borderColor: '#FFEB3B', marginLeft: '20px', width: '80px', height: '50px', color: '#000435' }}
                                    disabled={isExceeded || inputValue < 1000}>
                                    입력
                                </Button>
                            </Form>
                        </Col>
                    </Row>

                    {/* 포인트 환급 예상 금액 */}
                    <div className="mb-3" id="div_afterPaybackInput">
                        {isExceeded ? (
                            <div style={{ color: 'red', marginBottom:'20px' }}>보유 포인트를 초과하였습니다.</div>
                        ) : isError ? (
                            <div style={{ color: 'red', marginBottom:'20px' }}>포인트 환급은 1000P 이상부터 가능합니다.</div>
                        ) : (
                            <div style={{ marginBottom:'20px' }}>고객님의 환급 예상 금액은 <strong>{expectedPayback}원</strong>입니다.</div>
                        )}
                    </div>
                </Container>

                <Container className="" id='point-back-put-bank' style={{ display: 'none' }}>
                    <Row className="justify-content-center align-items-center">
                        <Col xs='auto'>
                            <Form inline className="d-flex align-items-center">
                                <Form.Group controlId="formPointInput">
                                    <div className="" style={{ marginBottom:'10px' }}>
                                        {/* <strong>{inputValue}P</strong>를 환급 원하십니까? */}
                                        환급받으실 은행과 계좌번호를 확인해주세요.
                                    </div>
                                    <Row className="align-items-center">
                                        <Col sm={4}>
                                            <Form.Select 
                                                id='bank' 
                                                style={{ borderColor: '#FFB800', width: '100%', height: '35px' }}
                                            >
                                                {
                                                    accountArr.map((arr, index) => (
                                                        <React.Fragment key={index}>
                                                            {arr.db === memberBankData ? (
                                                                <option value={arr.num} selected>{arr.name}</option>
                                                            ) : (
                                                                <option value={arr.num}>{arr.name}</option>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                }
                                            </Form.Select>
                                        </Col>

                                        <Col sm={8}>
                                            <Form.Control
                                                id='account_nubmer'
                                                type="text"
                                                placeholder="계좌번호"
                                                style={{ borderColor: '#FFB800', width: '100%', height: '35px' }}
                                                value={accountNumber}
                                                onChange={handleAccountNumberChange}
                                            />
                                        </Col>
                                    </Row>

                                    <span id='popup_result'></span>

                                    <div style={{marginTop:'20px', marginLeft:'-15px'}}>
                                        <Button onClick={() => pointCancleButtonEvent()}
                                            style={{ backgroundColor: '#FFD54F', borderColor: '#FFEB3B', width: '60px', height: '35px', color: '#000435', fontWeight:'bold' }}>
                                            취소
                                        </Button>
                                        <span>&emsp;&emsp;</span>
                                        <Button onClick={() => pointPayBackButtonEvent()}
                                            style={{ backgroundColor: '#FFD54F', borderColor: '#FFEB3B', width: '60px', height: '35px', color: '#000435', fontWeight:'bold' }}>
                                            확인
                                        </Button>
                                    </div>
                                </Form.Group>

                            </Form>
                        </Col>
                    </Row>
                </Container>

                {/* 포인트 약관 */}
                <div id="div_pointTerms" style={{ marginTop: '100px' }}>
                    <div style={{ fontWeight: 'bolder' }}>아이비 포인트 이용약관</div>
                    <div>아이비 포인트 잔액을 보유한 이용자는 회사에 요청하여 본인이 보유한 아이비 포인트 잔액을 환불받을 수 있습니다.</div>
                    <div>이용자가 실제 정상적인 구매내역이 기록되는 이용대금의 결제를 통하지 않고 비정상 경로로 취득한 아이비 포인트는 환불되지 않습니다.</div>
                    <div>문의사항은 아이비 고객 센터의 1:1 문의하기를 통해 문의바랍니다.</div>
                </div>
            </Container>
        </>
    );
};

export default MypagePointPaybackComponent;
