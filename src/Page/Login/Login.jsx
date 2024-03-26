/* eslint-disable */
import Logo from "../../Component/Image/Image.jsx";
import Input from "../../Component/Input/Input.jsx";
import Button from "../../Component/Button/Button.jsx";
import React, { useState } from "react";
import styled from "styled-components";
import { mainLogin } from "../../Api/api.js";
import { setCookie } from "../../Cookie/cookie.js";
import { useNavigate } from "react-router-dom";
import LogoImage from "../../Image/logo.png";

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fb;
`;

const LoginSize = styled.div`
  width: 450px;
  background: #fff;
  padding: 80px 55px;
  box-sizing: border-box;
  border-radius: 3px;
`;

function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    id: "",
    password: "",
  });

  const { id, password } = inputs;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const sendData = async () => {
    new mainLogin().post(id, password).then((logindata) => {

      if (logindata.code === 200 && logindata.data.id !== null) {
        setCookie("logindata", logindata, {
          //쿠키의 값을 저장하는 서버 경로, '/'일 경우 모든 페이지에서 쿠키에 접근할 수 있도록 설정
          path: "/",
          // true인 경우에는 https로 통신할때만 쿠키가 저장된다.
          // secure: true,
        });
        logindata.data.rankName == "관리자"
          ? navigate("/work/CommuteHistory")
          : navigate("/");
      } else if(logindata.code === 301) {
        alert("비밀번호가 잘못되었습니다.");
      }
      else {
        alert("유저 정보가 없습니다.");
      }
    });
  };


  return (
    <LoginContainer>
      {/*나중에 삭제*/}
      <p style={{ position: "absolute", bottom: "20px" }}>
        관리자 admin / 1234
        <br />
        팀장 devTeamLeader / 1234 <br />
        매니저 ayung / 1234
      </p>
      <LoginSize>
        <Logo
          src={LogoImage}
          style={{ width: "260px", margin: "0 auto 50px", display: "block" }}
        />
        <Input
          value={id}
          name="id"
          onChange={handleChange}
          placeholder={"아이디"}
        />
        <Input
          value={password}
          name="password"
          type="password"
          onChange={handleChange}
          placeholder={"비밀번호"}
          onKeyDown={(e) => {
            e.code == 'Enter' && sendData(

            )
          }}
        />
        <Button name="button" type="button" onClick={sendData}>
          로그인
        </Button>
      </LoginSize>
    </LoginContainer>
  );
}

export default Login;
