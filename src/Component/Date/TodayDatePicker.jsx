/* eslint-disable */
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Date/DatePicker.css";

function formatDate(date) {
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

const TodayDatePicker = ({ IstodayDate, props }) => {
  const [startDate, setStartDate] = useState(new Date());

  // IstodayDate 배열에서 첫 번째 요소를 상태 값으로, 두 번째 요소를 업데이트 함수로 추출
  const [isDate, setIsDate] = IstodayDate;
  useEffect(() => {
    // 업데이트 함수를 사용하여 isDate 상태 값을 업데이트
    setIsDate(formatDate(startDate));
  }, [startDate]);

  return (
    <div>
      <DatePicker
        selected={startDate}
        className="custom-datepicker"
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy-MM-dd"
        locale={ko}
        maxDate={new Date()}
        portalId="root-portal"
      />
    </div>
  );
};
export default TodayDatePicker;
