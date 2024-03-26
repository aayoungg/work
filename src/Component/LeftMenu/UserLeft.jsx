import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const MenuContainer = styled.div`
  width: 240px;
  height: 86.8vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid #e7e7e7;
`;

const MenuItem = styled.div`
  margin: 43px;
  text-align: center;
  cursor: pointer;
  color: ${({ $isActive }) => ($isActive ? "blue" : "black")};
`;

const MenuLink = styled(Link)`
  text-decoration-line: none;
`;
function UserLeft() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleClick = (menu) => {
    setActiveMenu(menu);
  };
  return (
    <div>
      <MenuContainer>
        <MenuLink to="/info">
          <MenuItem
            $isActive={activeMenu === "내 정보"}
            onClick={() => handleClick("내 정보")}
          >
            내 정보
          </MenuItem>
        </MenuLink>
        <MenuLink to="/password">
          <MenuItem
            $isActive={activeMenu === "비밀번호 변경"}
            onClick={() => handleClick("비밀번호 변경")}
          >
            비밀번호 변경
          </MenuItem>
        </MenuLink>
      </MenuContainer>
    </div>
  );
}

export default UserLeft;
