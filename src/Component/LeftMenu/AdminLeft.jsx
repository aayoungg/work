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
const AdminLeft = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <MenuContainer>
      <MenuLink to="/account">
        <MenuItem
          $isActive={activeMenu === "계정"}
          onClick={() => handleClick("계정")}
        >
          계정
        </MenuItem>
      </MenuLink>
      <MenuLink to="/part">
        <MenuItem
          $isActive={activeMenu === "부서"}
          onClick={() => handleClick("부서")}
        >
          부서
        </MenuItem>
      </MenuLink>
      <MenuLink to="/rank">
        <MenuItem
          $isActive={activeMenu === "직급"}
          onClick={() => handleClick("직급")}
        >
          직급
        </MenuItem>
      </MenuLink>
    </MenuContainer>
  );
};

export default AdminLeft;
