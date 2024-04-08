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
  const [modalStartDate, setModalStartDate] = useState(null);
  const [modalEndDate, setModalEndDate] = useState(null);
  const [inputs, setInputs] = useState({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
    type: WORK_REQUEST_TYPE.EDIT,
  });

  // 출퇴근 정보가 이미 존재하는 경우에는 수정 요청을 보낼 수 있도록 버튼을 활성화하고, 정보가 없는 경우에는 요청을 보낼 수 있도록 버튼을 비활성화
  const [isAlready, setIsAlready] = useState(false);
  // time
  const [responseData, setResponseData] = useState();
  const { type } = inputs;
  const closeModal = () => {
    setIsModalOpen(false);
    setIsAlready(false);
    setStartDate("");
  };

  dayjs.extend(customParseFormat);
  const format = "HH:mm";

  const onChange = (value, name) => {
    console.log("value", value);
    const timeString =
      value == null ? "" : value.format(format).split(":").join("");
    if (name === "start") {
      setInputs({
        ...inputs,
        startHour: timeString,
      });
    } else if (name === "end") {
      setInputs({
        ...inputs,
        endHour: timeString,
      });
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
    console.log(startDate);
    if (modalType === WORK_REQUEST_TYPE.CREATE) {
      console.log(modalType);
      sendWorkCheck();
    }
  }, [startDate]);

  useEffect(() => {
    console.log(responseData);
    setModalStartDate(
      responseData == undefined || responseData.code == 404
        ? null
        : responseData.data[0].startDate.split("T")[1].slice(0, 5)
    );

    setModalEndDate(
      responseData == undefined || responseData.code == 404
        ? null
        : responseData.data[0].endDate?.split("T")[1].slice(0, 5)
    );
  }, [responseData, startDate]);

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

  const validForm = () => {
    if (inputs.startHour === "" || inputs.endHour === "") {
      toast("시간을 입력해주세요");
      return false;
    }

    return true;
  };

  const FormattedTime = () => {
    console.log(startDate);
    console.log(responseData);

    const formattedStartTime =
      dayjs(startDate).format("YYYYMMDD") + inputs.startHour;

    const formattedEndTime =
      dayjs(startDate).format("YYYYMMDD") + inputs.endHour;

    return { formattedStartTime, formattedEndTime };
  };

  // 출퇴근 시간을 생성하기 위해 요청보내는
  const createWork = () => {
    const valid = validForm();
    if (!valid) return;

    const { formattedStartTime, formattedEndTime } = FormattedTime();

    if (isAlready) {
      toast.error(
        "이미 출퇴근을 하였거나 요청 중 입니다. 보낸 요청 목록 페이지로 가서 수정 요청을 보내주세요."
      );
      return;
    }

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
          toast.success("출퇴근 요청을 보냈습니다.");
          setIsModalOpen(false);
          navigate("/work/SendRequest");
        } else if (res.code === 400) {
          toast.error("이미 해당 기간에 출퇴근 요청이 있습니다.");
        } else {
          toast.error("출퇴근 조회가 없습니다.");
        }
      })
      .catch((err) => {
        toast.error("출퇴근 요청에 실패했습니다.");
        console.error("Error during workRequest:", err);
      });
  };

  // 출퇴근 시간 수정하는
  const editWork = () => {
    const valid = validForm();
    if (!valid) return;

    const { formattedStartTime, formattedEndTime } = FormattedTime();

    if (isAlready) {
      toast.error("이미 출퇴근 요청을 보냈습니다.");
      return;
    }

    new workRequest()
      .post(
        userIdx,
        formatDate(dayjs(formattedStartTime, "YYYYMMDDHHmm").toDate()),
        formatDate(dayjs(formattedEndTime, "YYYYMMDDHHmm").toDate()),
        WORK_REQUEST_TYPE.EDIT,
        workIdx
      )
      .then((res) => {
        if (res.code === 200) {
          setIsModalOpen(false);
          navigate("/work/SendRequest");
          toast.success("출퇴근 수정 요청을 보냈습니다.");
        } else if (res.code === 400) {
          toast.error(
            "이미 해당 기간에 출퇴근 수정 요청이 있습니다. 취소 후 재수정 요청을 해주세요."
          );
        }
      })
      .catch((err) => {
        toast.error("출퇴근 수정에 실패했습니다.");
        console.error("Error during workRequest:", err);
      });
  };
  function formatDate(dateString) {
    // 날짜 객체 생성
    var d = new Date(dateString);

    // 원하는 형식으로 날짜 및 시간 값 추출
    var year = d.getFullYear();
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    var hours = ("0" + d.getHours()).slice(-2);
    var minutes = ("0" + d.getMinutes()).slice(-2);

    // yyyyMMddHHmm 형식으로 조합하여 반환
    return year + month + day + hours + minutes;
  }
  console.log(startDate);
  console.log(modalStartDate);
  return (
    <>
      <Modal isOpen={isModalOpen}>
        <div className="modal_header">
          <h2 className="modal_title">
            출퇴근 {modalType === WORK_REQUEST_TYPE.EDIT ? "수정" : "요청"}
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
                value={
                  modalStartDate == null ? null : dayjs(modalStartDate, format)
                }
                onCalendarChange={(value) => {
                  onChange(value, "start");
                  setModalStartDate(value);
                }}
                format={format}
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
                value={
                  modalEndDate == null ? null : dayjs(modalEndDate, format)
                }
                onCalendarChange={(value) => {
                  onChange(value, "end");
                  setModalEndDate(value);
                }}
                format={format}
              />
            </li>
          </List>
          <div className={"modal_btn"}>
            {modalType === WORK_REQUEST_TYPE.CREATE ? (
              <CommonBtn $full $size="l" onClick={createWork}>
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
