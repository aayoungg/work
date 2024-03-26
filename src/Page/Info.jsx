/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import My from "../Component/My/My";
import Button from "../Component/Button/NewButton";
import Modal from "react-modal";
import { getCookie, setCookie } from "../Cookie/cookie";
import { updateAccount } from "../Api/api";
// import axios, { Axios } from 'axios';
const InfoContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 23vw;
  top: 20vh;
  width: 70%;
`;

const Container = styled.div`
  margin: 50px 550px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
const SecTitle = styled.h2`
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  //파트 이름과 파트 메모 사이
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  //파트 이름 칸
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 3px;
`;

export const Select = styled.select`
  //모달창-선택박스
  margin: 3px;
  display: block;
  width: 185px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const TotalBtn = styled.div`
  //모달창-취소,수정 버튼
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const Info = () => {
  const user = getCookie("logindata");

  const [updateAccountData, setUpdateAccountData] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.2)",
      width: "100%",
      height: "100vh",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "360px",
      height: "250px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "white",
      justifyContent: "center",
    },
  };
  useEffect(() => {
    const logindata = getCookie("logindata");
    // console.log(logindata);
    if (logindata) {
      setName(logindata.name);
      setPhone(logindata.phone);
      setEmail(logindata.email);
    }
  }, []);

  const handleUpdateAccount = async (event) => {
    event.preventDefault();

    const accountdata = await new updateAccount().put(idx, name, phone, email);
    if (accountdata.data.code === 200) {
      closeModal();
      setUpdateAccountData(accountdata);
      setCookie(
        "logindata",
        { ...user, data: { ...user.data, name, phone, email } },
        { path: "/" }
      );
    }
  };

  const EditClick = () => {
    openModal();
    setName(
      updateAccountData === undefined || updateAccountData === null
        ? user.data.name
        : updateAccountData.data.data.name
    );
    setPhone(
      updateAccountData === undefined || updateAccountData === null
        ? user.data.phone
        : updateAccountData.data.data.phone
    );
    setEmail(
      updateAccountData === undefined || updateAccountData === null
        ? user.data.email
        : updateAccountData.data.data.email
    );
  };

  const idx = user.data.idx;

  return (
    <InfoContainer>
      <h2>마이페이지</h2>
      <Button onClick={EditClick}>수정</Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <Form>
          <SecTitle>계정 수정</SecTitle>
          <InputGroup>
            <InputField
              type="text"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
            />
            <InputField
              type="text"
              defaultValue={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호"
            />
            <InputField
              type="email"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
            />
          </InputGroup>
          <TotalBtn>
            <Button onClick={closeModal}>취소</Button>
            <Button onClick={handleUpdateAccount}>수정</Button>
          </TotalBtn>
        </Form>
      </Modal>
      <Container>
        <My updateAccountData={updateAccountData} />
      </Container>
    </InfoContainer>
  );
};

export default Info;
