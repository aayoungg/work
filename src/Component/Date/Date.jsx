import { useState } from "react";

function DateComponent() {
  const today = new Date();
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedDate = `${today.getFullYear()}.${
    today.getMonth() + 1
  }.${today.getDate()} (${week[today.getDay()]})`;

  return (
    <div className="Datemain">
      <p>{formattedDate}</p>
    </div>
  );
}

export default DateComponent;
