/* eslint-disable */
// App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "Page/Login/Login";
import Home from "Page/Home/Home";
import CommuteHistory from "Page/CommuteHistory/CommuteHistory.jsx";
import Header from "Component/Header/Header.jsx";
import SendRequest from "Page/RequestCheck/SendRequest.jsx";
import RequestCheck from "Page/RequestCheck/RequstCheck.jsx";
import { getCookie } from "Cookie/cookie.js";
import CreateWork from "Page/CreateWork/CreateWork.jsx";
import AdminRequest from "Page/CreateWork/AdminRequest.jsx";
// 아영님 코드
import Password from "Page/Password.jsx";
import Part from "Page/Part";
import Position from "Page/Position";
import Info from "Page/Info";
import Account from "Page/Account";
import My from "Component/My/My.jsx";
import MyPage from "Page/MyPage/Index";
import VacationReq from "Page/VacationReq";
import Modal from "react-modal";
import SideBar from "Component/Header/SideBar";
import styled from "styled-components";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rank from "Page/Rank";
import VacationDel from "Page/VacationDel";
import VacationProcess from "Page/VacationProcess";

const ContainerWrap = styled.div`
  display: flex;

  .main-wrap {
    padding: 32px 30px 0 30px;
    width: 100%;
    background: #f7f9fb;
  }
`;

function App() {
  Modal.setAppElement("#root");
  const user = getCookie("logindata");
  const navigate = useNavigate();
  const IsworkDataState = useState(getCookie("workdata"));
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Header IsworkDataState={IsworkDataState} />
          <ContainerWrap>
            <SideBar></SideBar>
            <main className={`main-wrap`}>
              <Routes>
                {/*홈*/}
                <Route
                  path="/"
                  element={<Home IsworkDataState={IsworkDataState} />}
                />
                {/*마이페이지*/}
                <Route path="/mypage" element={<MyPage />}></Route>
                {/*근태관리*/}

                <Route
                  path="/work/CommuteHistory"
                  element={<CommuteHistory />}
                />
                <Route path="/work/SendRequest" element={<SendRequest />} />
                <Route path="/work/RequestCheck" element={<RequestCheck />} />
                <Route path="/work/CreateWork" element={<CreateWork />} />
                <Route path="/work/AdminRequest" element={<AdminRequest />} />
                {/* 아영님 Page*/}
                <Route path="/password" element={<Password />}></Route>
                <Route path="/account" element={<Account />}></Route>
                <Route path="/part" element={<Part />}></Route>
                <Route path="/position" element={<Position />}></Route>
                <Route path="/rank" element={<Rank />}></Route>
                <Route path="/vacationreq" element={<VacationReq />}></Route>
                <Route path="/vacationdel" element={<VacationDel />}></Route>
                <Route
                  path="/vacationprocess"
                  element={<VacationProcess />}
                ></Route>

                {/*안쓰는 것*/}
                <Route path="/info" element={<Info />}></Route>
                <Route path="/my" element={<My />}></Route>
              </Routes>
            </main>
            <ToastContainer
              position="bottom-center"
              hideProgressBar
              autoClose={2000}
              theme="dark"
              transition={Slide}
            />
          </ContainerWrap>
        </>
      )}
    </div>
  );
}

export default App;
