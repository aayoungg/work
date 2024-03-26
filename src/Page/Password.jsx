/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { getCookie } from "../Cookie/cookie";
import { password } from "../Api/api";

const PasswordContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 23vw;
  top: 20vh;
  width: 70%;
`;
const Input = styled.input`
  width: 15vw;
  height: 4vh;
`;

const PasswordButton = styled.button`
  background-color: #3182f6;
  color: white;
  width: 15vw;
  height: 5vh;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2446ab;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Password = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const movePage = useNavigate();
  const LoginDate = getCookie("logindata");

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("새로운 비밀번호와 재확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      console.log(password);
      console.log(newPassword);
      const idx = LoginDate.data.idx;
      console.log(LoginDate.data.idx);
      console.log(password);
      console.log(newPassword);
      const response = await axios.put(`/api/v1/info/changepw?idx=${idx}`, {
        password: password,
        newPassword: newPassword,
      });

      console.log(response.data.idx);

      if (response.data.code === 200) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        movePage("/main");
      } else if (response.data.code === 401) {
        alert("현재 비밀번호가 일치하지 않습니다.");
      } else {
        alert("비밀번호 변경 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("API 호출 중 오류가 발생했습니다:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <PasswordContainer>
      <h2>비밀번호 변경</h2>
      <Container>
        <Input
          type="password"
          placeholder="현재 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <Input
          type="password"
          placeholder="새로운 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        <Input
          type="password"
          placeholder="새로운 비밀번호 재확인"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <br />
        <PasswordButton onClick={handleChangePassword}>변경</PasswordButton>
      </Container>
    </PasswordContainer>
  );
};

export default Password;
