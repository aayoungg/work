import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
import { getCookie, setCookie } from "Cookie/cookie";
import { updateAccount } from "Api/api";
import { useNavigate } from "react-router-dom";
import MainTitle from "Component/Header/MainTitle";
import { toast } from "react-toastify";
import CommonBtn from "Component/Button/CommonBtn";

const Container = styled.div`
  background: #fff;
  padding: 28px;
  border-radius: 5px;
  max-width: 400px;
  margin-bottom: 20px;

  .sub-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
    height: 32px;

    p {
      font-size: 16px;
      font-weight: bold;
    }
  }
`;
const Input = styled.input`
  width: 100%;
`;
const MyInfo = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    height: 40px;
  }

  span {
    width: 100px;
    display: block;
    font-size: 14px;
    font-weight: 500;
    flex: 0 0 100px;
  }

  div {
    font-size: 14px;
    font-weight: 400;
  }

  &.password {
    margin-bottom: 40px;
  }
`;
const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    width: 300px;
    gap: 10px;

    p {
      width: 100px;
      flex: 0 0 100px;
    }
  }
`;
const Info = () => {
  const user = getCookie("logindata");
  const movePage = useNavigate();
  const LoginDate = getCookie("logindata");
  const [updateAccountData, setUpdateAccountData] = useState();
  const [name, setName] = useState(LoginDate.data.name);
  const [phone, setPhone] = useState(LoginDate.data.phone);
  const [email, setEmail] = useState(LoginDate.data.email);
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const idx = user.data.idx;

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const logindata = getCookie("logindata");
    if (logindata) {
      setName(logindata.name);
      setPhone(logindata.phone);
      setEmail(logindata.email);
    }
  }, []);

  // 본인 이름, 전화번호, 이메일 수정
  const handleUpdateAccount = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast("이름을 입력하세요");
      return;
    }

    const accountdata = await new updateAccount().put(idx, name, phone, email);
    if (accountdata && accountdata.data && accountdata.data.code === 200) {
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

  const handleChangePassword = async () => {
    if (!password.trim()) {
      toast("현재 비밀번호를 입력해주세요");
      return;
    }

    if (
      !newPassword ||
      !confirmNewPassword ||
      newPassword !== confirmNewPassword
    ) {
      toast("새로운 비밀번호와 재확인 비밀번호가 일치하지 않습니다");
      return;
    }
    if (password === newPassword) {
      toast(
        "현재 비밀번호와 새 비밀번호가 동일합니다. 다른 비밀번호를 입력해주세요."
      );
      return;
    }

    try {
      const idx = LoginDate.data.idx;
      const response = await axios.put(`/api/v1/info/changepw?idx=${idx}`, {
        password: password,
        newPassword: newPassword,
      });

      if (response.data.code === 200) {
        toast("비밀번호가 성공적으로 변경되었습니다.");
        movePage("/");
      } else if (response.data.code === 401) {
        toast("현재 비밀번호가 일치하지 않습니다.");
      } else {
        toast("비밀번호 변경 중 오류가 발생했습니다.");
      }
    } catch (error) {
      toast("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <MainTitle title={"마이페이지"}></MainTitle>

      <Container>
        <div className={`sub-title`}>
          <p>내 정보</p>
          {LoginDate.data.rankName !== "관리자" && (
            <CommonBtn onClick={EditClick} $size="s" $width={80} $line>
              수정하기
            </CommonBtn>
          )}
        </div>
        <MyInfo>
          <li>
            <span>이름</span>
            <div>{LoginDate.data.name}</div>
          </li>
          {LoginDate.data.rankName !== "관리자" && (
            <>
              <li>
                <span>전화번호</span>
                <div>{LoginDate.data.phone ? LoginDate.data.phone : "-"}</div>
              </li>
              <li>
                <span>이메일</span>
                <div>{LoginDate.data.email ? LoginDate.data.email : "-"}</div>
              </li>
              <li>
                <span>부서</span>
                <div>{LoginDate.data.partName}</div>
              </li>
              <li>
                <span>직급</span>
                <div>{LoginDate.data.rankName}</div>
              </li>
            </>
          )}
        </MyInfo>
      </Container>

      <Container>
        <div className={`sub-title`}>
          <p>비밀번호 변경</p>
        </div>
        <MyInfo className={"password"}>
          <li>
            <span>현재 비밀번호</span>
            <Input
              type="password"
              placeholder="현재 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
          <li>
            <span>새 비밀번호</span>
            <Input
              type="password"
              placeholder="새로운 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </li>
          <li>
            <span>비밀번호 확인</span>
            <Input
              type="password"
              placeholder="새로운 비밀번호 확인"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </li>
        </MyInfo>
        <CommonBtn onClick={handleChangePassword} $size="m" $full>
          비밀번호 변경
        </CommonBtn>
      </Container>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal_header">
          <h2 className="modal_title">계정 수정</h2>
          <button className="modal_close" onClick={closeModal}></button>
        </div>
        <div className="modal_content">
          <List>
            <li>
              <p>이름</p>
              <input
                type="text"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
              />
            </li>
            <li>
              <p>전화번호</p>
              <input
                type="text"
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호"
              />
            </li>
            <li>
              <p>이메일</p>
              <input
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
              />
            </li>
          </List>
          <div className={"modal_btn"}>
            <CommonBtn onClick={handleUpdateAccount} $full $size={"m"}>
              수정
            </CommonBtn>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Info;
