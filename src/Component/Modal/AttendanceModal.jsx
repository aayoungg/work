/* eslint-disable */
import React, { useEffect, useState } from "react";
import Map from "Component/Map/Map.jsx";
import CommonBtn from "Component/Button/CommonBtn.jsx";
import { getCookie, setCookie } from "Cookie/cookie.js";
import { work } from "Api/api.js";
import Modal from "react-modal";

function getCookies(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function AttendanceModal({ setWorkData, isModalOpen, setIsModalOpen }) {
  const isInCircleState = useState(false);
  const [isInCircle, setIsInCircle] = isInCircleState;
  const [typework, setTypework] = useState(0);
  const workdataCookie = getCookies("workdata");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const LoginDate = getCookie("logindata");
  const userIdx = LoginDate.data.idx;
  const workdata = getCookie("workdata");
  useEffect(() => {
    if (workdata == undefined || workdata.length === 0) {
      setTypework(1);
    } else if (workdata.startDate !== null && workdata.endDate === null) {
      setTypework(2);
    }
  });

  const idx = typework === 2 ? workdata?.idx : null;
  const toggleText = async () => {
    if (!isInCircle) {
      alert("회사 범위 밖에 있습니다.");
      return;
    }
    const setData = setWorkData;

    new work().post(idx, userIdx, typework).then((res) => {
      if (res.code === 200) {
        setCookie("workdata", res.data, {
          path: "/",
          // secure: true,
        });
        setData(res.data);

        closeModal();
      }
    });
  };

  return (
    <>
      <Modal isOpen={isModalOpen}>
        <div className="modal_header">
          <h2 className="modal_title">
            {typework == 2 ? "퇴근하기" : "출근하기"}
          </h2>
          <button className="modal_close" onClick={closeModal}></button>
        </div>
        <div className="modal_content">
          <Map isInCircleState={isInCircleState} />
          <div className={"modal_btn"}>
            <CommonBtn onClick={toggleText} $full $size="l">
              {/* 출근 안 찍음 0 출근 찍음 1 퇴근 찍음 2 */}
              {typework == 2 ? "퇴근하기" : "출근하기"}
            </CommonBtn>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AttendanceModal;
