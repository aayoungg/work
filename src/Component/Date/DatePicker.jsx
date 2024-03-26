/* eslint-disable */
import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "./DatePicker.css";
import { printDateTimeFormat } from "helper/value";

const DatePicker = ({ date, setDate, ...props }) => {
  const [checkDate, setCheckDate] = useState(new Date());

  useEffect(() => {
    if (date) {
      setCheckDate(new Date(date));
    } else {
      setCheckDate(new Date());
    }
  }, [date]);

  const setChangeDate = (date) => {
    setDate(printDateTimeFormat(date, "YYYY-MM-dd"));
  };

  return (
    <ReactDatePicker
      selected={checkDate}
      selectsStart
      dateFormat="yyyy-MM-dd"
      placeholderText={"YYYY-MM-DD"}
      onChange={(date) => setChangeDate(date)}
      portalId="root-portal"
      {...props}
    />
  );
};

export default DatePicker;
