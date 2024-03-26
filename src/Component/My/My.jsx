/* eslint-disable */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getCookie } from "../../Cookie/cookie";

const MyInfo = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    height: 30px;
  }

  span {
    width: 100px;
    display: block;
    font-size: 14px;
    font-weight: 500;
  }

  div {
    font-size: 14px;
    font-weight: 400;
  }
`;

const Img = styled.img`
  width: 40px;
  padding: 0px 16px 0px 0px;
`;

const My = ({ updateAccountData }) => {
  const LoginDate = getCookie("logindata");
  // console.log(LoginDate);
  const value = updateAccountData;
  return (
    <MyInfo>
      <li>
        <span>이름</span>
        <div>
          {value === undefined || value === null
            ? LoginDate.data.name
            : value.data.data.name}
        </div>
      </li>
      <li>
        <span>전화번호</span>
        <div>
          {value === undefined || value === null
            ? LoginDate.data.phone
            : value.data.data.phone}
        </div>
      </li>
      <li>
        <span>이메일</span>
        <div>
          {value === undefined || value === null
            ? LoginDate.data.email
            : value.data.data.email}
        </div>
      </li>
      <li>
        <span>부서</span>
        <div>{LoginDate.data.partName}</div>
      </li>
      <li>
        <span>직급</span>
        <div>{LoginDate.data.rankName}</div>
      </li>
    </MyInfo>
  );
};

export default My;
