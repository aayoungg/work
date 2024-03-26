// 요청받은 휴가 승인/반려 시, 휴가 요청할 시, 출퇴근 요청 시, 요청 받은 출퇴근을 승인/거절 시 생기는 모달창
/* eslint-disable */
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "./DatePicker.css";
import { printDateTimeFormat } from "helper/value";
import { ko } from "date-fns/locale";

const DateForm = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--gray7);
`;

const DatePickerComponent = ({ setStartDate, setEndDate }) => {
  const [checkStartDate, setCheckStartDate] = useState(new Date());
  const [checkEndDate, setCheckEndDate] = useState(new Date());

  useEffect(() => {
    // 컴포넌트가 마운트될 때와 setStartDate 또는 setEndDate가 변경될 때 실행
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate());

    setCheckStartDate(startDate);
    setCheckEndDate(endDate);
    setStartDate(printDateTimeFormat(startDate, "YYYY-MM-dd"));
    setEndDate(printDateTimeFormat(endDate, "YYYY-MM-dd"));
  }, [setStartDate, setEndDate]); // 의존성 배열에 setStartDate와 setEndDate 추가

  const setChangeStartDate = (date) => {
    setCheckStartDate(date);
    setStartDate(printDateTimeFormat(date, "YYYY-MM-dd"));
  };

  const setChangeEndDate = (date) => {
    setCheckEndDate(date);
    setEndDate(printDateTimeFormat(date, "YYYY-MM-dd"));
  };

  return (
    <DateForm>
      <DatePicker
        selected={checkStartDate}
        selectsStart
        startDate={checkStartDate}
        endDate={checkEndDate}
        dateFormat="yyyy-MM-dd"
        placeholderText={"YYYY-MM-DD"}
        onChange={(date) => setChangeStartDate(date)}
        locale={ko}
      />
      <span>~</span>
      <DatePicker
        selected={checkEndDate}
        selectsEnd
        startDate={checkStartDate}
        endDate={checkEndDate}
        dateFormat="yyyy-MM-dd"
        placeholderText={"YYYY-MM-DD"}
        onChange={(date) => setChangeEndDate(date)}
        minDate={checkStartDate}
        locale={ko}
      />
    </DateForm>
  );
};

export default DatePickerComponent;
