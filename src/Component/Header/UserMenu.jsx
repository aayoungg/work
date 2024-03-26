/* eslint-disable */
import { getCookie, removeCookie, setCookie } from "Cookie/cookie.js";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactComponent as DownIcon } from "assets/icon/system/arrow-down-s-line.svg";
import { workcheck } from "../../Api/api";

const UserInfo = styled.div`
  position: relative;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;

  & > .menu {
    display: none;
  }

  &:hover .menu {
    display: block;
  }

  .menu {
    position: absolute;
    right: 0;
    top: 70px;
    width: 140px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
    background: #fff;
    z-index: 10;
  }
`;

const UserStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & > p {
    font-weight: 500;
  }

  & > svg {
    color: #555;
    margin-left: -5px;
  }
`;

const NavStyle = styled.button`
  color: black;
  font-size: 16px;
  text-decoration-line: none;
  padding: 14px 10px;
  display: block;
  text-align: left;
  background: #fff;
  width: 100%;

  &:hover {
    color: var(--main-color);
    font-weight: bold;
  }
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;

  &.start {
    background: var(--sub-color);
    color: var(--main-color);
  }

  &.end {
    background: var(--gray1);
    color: var(--gray7);
  }
`;

function UserMenu({ IsworkDataState }) {
  const navigate = useNavigate();
  const [user] = useState(getCookie("logindata")?.data);
  const [workData, setWorkData] = IsworkDataState;
  let now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const endDate = formattedDate;
  const startDate = formattedDate;
  const [type, setType] = useState(2);

  //나중에 store로 이동해야 함
  useEffect(() => {
    new workcheck().get(user.idx, startDate, endDate, type).then((res) => {
      if (res?.data) {
        setWorkData(res.data[0]);
      } else {
        setWorkData(null);
      }
    });
  }, [user]);

  const goMyPage = () => {
    navigate("/mypage");
  };

  const logout = () => {
    removeCookie("logindata");
    navigate("/login");
  };

  return (
    <UserInfo>
      <UserStyle>
        <p>{user.name}</p>
        {workData?.startDate && workData?.endDate ? (
          <UserStatus className={"end"}>퇴근완료</UserStatus>
        ) : workData?.startDate && !workData?.endDate ? (
          <UserStatus className={"start"}>근무 중</UserStatus>
        ) : (
          ""
        )}
        <DownIcon width={24}></DownIcon>
      </UserStyle>
      <ul className={"menu"}>
        <li>
          <NavStyle onClick={goMyPage}>마이페이지</NavStyle>
        </li>
        <li>
          <NavStyle onClick={logout}>로그아웃</NavStyle>
        </li>
      </ul>
    </UserInfo>
  );
}

export default UserMenu;
