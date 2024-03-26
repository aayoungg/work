/* eslint-disable */
import NickName from "../NickName/Nickname.jsx";
import Logo from "../Image/Image.jsx";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../Image/logo.png";
import { ensureCookie } from "../../Cookie/cookiecheck.js";
import { useEffect } from "react";
import UserMenu from "./UserMenu";

const Menu = styled.div`
  display: flex;
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
  padding: 0 20px;
`;

const MenuLogout = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 18px;
  gap: 20px;
  height: 100%;
`;

const Menuflex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const LogoWrap = styled.div`
  width: 280px;
  cursor: pointer;
`;

function HeaderMenu({ IsworkDataState }) {
  const Cookiecheck = ensureCookie("logindata");
  let now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookiecheck == formattedDate) {
      navigate("/");
    }
  }, []);


  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <Menu>
        <Menuflex>
          <LogoWrap onClick={goHome}>
            <Logo src={LogoImage} style={{ height: "30px" }} />
          </LogoWrap>
        </Menuflex>

        {/*우측 메뉴*/}
        <MenuLogout>
          <UserMenu IsworkDataState={IsworkDataState} ></UserMenu>
        </MenuLogout>
      </Menu>
    </>
  );
}

export default HeaderMenu;
