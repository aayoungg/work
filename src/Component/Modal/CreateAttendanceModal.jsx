/* eslint-disable */
// 근태 관리-출퇴근 목록 : 출퇴근 요청 및 수정 클릭 시 생기는 모달창
import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import CommonBtn from "Component/Button/CommonBtn";
import { getCookie } from "Cookie/cookie";
import { workcheck, workRequest } from "../../Api/api";
import { printDateTimeFormat } from "../../helper/value";
import DatePicker from "../Date/DatePicker";
import styled from "styled-components";
import { toast } from "react-toastify";
import { WORK_REQUEST_TYPE } from "constants/serviceConstants";
// Time
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
import { useNavigate } from "react-router-dom";

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

function formatDate(date) {
  if (date !== null) {
    const formattedDate =
      date.split("T")[1].split(":").slice(0, 2).join("시") + "분";
    return formattedDate;
  }
}

export default function CreateAttendanceModal({
  isModalOpen,
  setIsModalOpen,
  modalType,
  attendanceTime,
  workIdx,
}) {
  const [startDate, setStartDate] = useState("");
  const navigate = useNavigate();
  const LoginDate = getCookie("logindata");
  const userIdx = LoginDate.data.idx;

  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [inputs, setInputs] = useState({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
    type: WORK_REQUEST_TYPE.EDIT,
  });
  const [isAlready, setIsAlready] = useState(false);
  const { type } = inputs;

  // time
  const [responseData, setResponseData] = useState();
  dayjs.extend(customParseFormat);
  const format = "HH:mm";

  const onChange = (value, name) => {
    console.log("value", value);
    const timeString =
      value == null ? "" : value.format(format).split(":").join("");
    if (name === "start") {
      setStartHour(timeString);
    } else if (name === "end") {
      setEndHour(timeString);
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;

    if (modalType === WORK_REQUEST_TYPE.CREATE) {
      setStartDate(new Date().toISOString().split("T")[0]);
    } else {
      setStartDate(attendanceTime.startDate);
      timeInjection(attendanceTime.startDate, attendanceTime.endDate || null);
    }
  }, [isModalOpen]);
  useEffect(() => {
    if (!isModalOpen) return;

    if (modalType === WORK_REQUEST_TYPE.CREATE) {
      sendWorkCheck();
    }
  }, [startDate]);

  const sendWorkCheck = () => {
    new workcheck()
      .get(userIdx, startDate, startDate, type)
      .then((res) => {
        setResponseData(res);
        if (res?.data && res.data[0]) {
          const { startDate, endDate } = res.data[0];
          timeInjection(startDate, endDate);
          setIsAlready(true);
        } else {
          timeInjection(null, null);
          setIsAlready(false);
        }
      })
      .catch((err) => {
        console.error("Error during workcheck:", err);
      });
  };

  const timeInjection = (start, end) => {
    setInputs({
      ...inputs,
      startHour: printDateTimeFormat(start, "H") || "",
      endHour: printDateTimeFormat(end, "H") || "",
    });
  };

  //유효성 검사
  console.log("");
  const validForm = () => {
    if (startHour == "" || endHour == "") {
      toast("시간을 입력해주세요");
      return false;
    }

    // const startTime = new Date(0, 0, 0, startHour, startMinute); // 시작 시간 생성
    // const endTime = new Date(0, 0, 0, endHour, endMinute); // 종료 시간 생성

    // if (startTime >= endTime) {
    //   toast("시작 시간은 종료 시간보다 이전이어야 합니다.");
    //   return false;
    // }

    return true;
  };

  const FormattedTime = () => {
    const formattedStartTime =
      startHour === ""
        ? dayjs(startDate).format("YYYYMMDD") +
          attendanceTime.startDate.split("T")[1].split(":").slice(0, 2).join("")
        : dayjs(startDate).format("YYYYMMDD") + startHour;
    const formattedEndTime =
      endHour === ""
        ? dayjs(startDate).format("YYYYMMDD") +
          attendanceTime.endDate.split("T")[1].split(":").slice(0, 2).join("")
        : dayjs(startDate).format("YYYYMMDD") + endHour;

    return { formattedStartTime, formattedEndTime };
  };

  const editWork = () => {
    const valid = validForm();
    if (!valid) return;

    const { formattedStartTime, formattedEndTime } = FormattedTime();

    new workRequest()
      .post(
        userIdx,
        dayjs(formattedStartTime, "YYYYMMDDHHmm").toDate(),
        dayjs(formattedEndTime, "YYYYMMDDHHmm").toDate(),
        WORK_REQUEST_TYPE.EDIT,
        workIdx
      )
      .then((res) => {
        if (res.code === 200) {
          setIsModalOpen(false);
          navigate("/work/SendRequest");
          toast("출퇴근 수정 요청을 보냈습니다.");
        }
      })
      .catch((err) => {
        toast("출퇴근 수정에 실패했습니다.");
        console.error("Error during workRequest:", err);
      });
  };

  const createWork = () => {
    const valid = validForm();
    if (!valid) return;

    const { formattedStartTime, formattedEndTime } = FormattedTime();

    new workRequest()
      .post(
        userIdx,
        formattedStartTime,
        formattedEndTime,
        WORK_REQUEST_TYPE.CREATE,
        ""
      )
      .then((res) => {
        if (res.code === 200) {
          toast("출퇴근 요청을 보냈습니다.");
          navigate("/work/SendRequest");
        }
      })
      .catch((err) => {
        toast("출퇴근 요청에 실패했습니다.");
        console.error("Error during workRequest:", err);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAlready(false);
    setStartDate("");
  };

  useEffect(() => {
    setModalStartDate(
      responseData == undefined || responseData.code == 404
        ? null
        : responseData.data[0].startDate.split("T")[1].slice(0, 5)
    );
    setModalEndDate(
      responseData == undefined || responseData.code == 404
        ? null
        : responseData.data[0].endDate.split("T")[1].slice(0, 5)
    );
  }, [responseData, startDate]);

  const [modalStartDate, setModalStartDate] = useState(null);
  const [modalEndDate, setModalEndDate] = useState(null);
  console.log(
    responseData == undefined || responseData.code == 404
      ? "출근시간"
      : responseData.data[0].startDate.split("T")[1].slice(0, 5)
  );
  return (
    <>
      <Modal isOpen={isModalOpen}>
        <div className="modal_header">
          <h2 className="modal_title">
            출퇴근 {modalType === WORK_REQUEST_TYPE.EDIT ? "수정" : "생성"}
          </h2>
          <button className="modal_close" onClick={closeModal}></button>
        </div>
        <div className="modal_content">
          <List>
            <li>
              <p>날짜</p>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                maxDate={new Date()}
                disabled={modalType === WORK_REQUEST_TYPE.EDIT}
              />
            </li>
            <li>
              <p>출근 시간</p>
              <TimePicker
                name="start"
                placeholder={
                  attendanceTime == null || attendanceTime.startDate == null
                    ? responseData == undefined || responseData.code == 404
                      ? "출근시간"
                      : formatDate(responseData.data[0].startDate)
                    : attendanceTime.startDate
                        .split("T")[1]
                        .split(":")
                        .slice(0, 2)
                        .join(":")
                }
                // value={attendanceTime && attendanceTime.startDate ? dayjs(attendanceTime.startDate) : null}
                onChange={(value) => {
                  onChange(value, "start");
                  setModalStartDate(value);
                }}
                // defaultOpenValue={dayjs("00:00", format)}
                value={
                  modalStartDate == null ? null : dayjs(modalStartDate, format)
                }
                format={format}
                changeOnScroll
                needConfirm={false}
              />
            </li>
            <li>
              <p>퇴근 시간</p>
              <TimePicker
                name="end"
                placeholder={
                  attendanceTime == null || attendanceTime.endDate == null
                    ? responseData === undefined ||
                      responseData.code === 404 ||
                      responseData.data[0].endDate == null
                      ? "퇴근시간"
                      : formatDate(responseData.data[0].endDate)
                    : attendanceTime.endDate
                        .split("T")[1]
                        .split(":")
                        .slice(0, 2)
                        .join(":")
                }
                // value={attendanceTime && attendanceTime.endDate ? dayjs(attendanceTime.endDate) : null}
                onChange={(value) => {
                  onChange(value, "end");
                  setModalEndDate(value);
                }}
                // defaultOpenValue={dayjs("00:00", format)}
                value={
                  modalEndDate == null ? null : dayjs(modalEndDate, format)
                }
                format={format}
                changeOnScroll
                needConfirm={false}
              />
            </li>
          </List>
          <div className={"modal_btn"}>
            {modalType === WORK_REQUEST_TYPE.CREATE ? (
              <CommonBtn
                $full
                $size="l"
                disabled={isAlready}
                onClick={createWork}
              >
                요청하기
              </CommonBtn>
            ) : modalType === WORK_REQUEST_TYPE.EDIT ? (
              <CommonBtn $full $size="l" onClick={editWork}>
                수정 요청하기
              </CommonBtn>
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
