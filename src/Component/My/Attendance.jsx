/* eslint-disable */
import { workcheck, userUpdateTime } from "../../Api/api";
import { getCookie, removeCookie, setCookie } from "../../Cookie/cookie";
import { useEffect, useState } from "react";
import AttendanceModal from "Component/Modal/AttendanceModal";
import styled from "styled-components";
import { printDateTimeFormat } from "../../helper/value";
import CommonBtn from "../Button/CommonBtn";
import { WORK_REQUEST_TYPE } from "constants/serviceConstants";
import CreateAttendanceModal from "../../Component/Modal/CreateAttendanceModal";

const BtnDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const AttendanceCard = styled.div`
  display:flex
  align-items: center;
  h2 {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const AttendanceTime = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TimeText = styled.div`
  display: flex;
  gap: 170px;
  span {
    width: 40px;
    display: block;
  }
`;

const TimeDiv = styled.div`
  display: flex;
  gap: 7px;
  flex-direction: column;
  margin-top: 20px;
`;

const MODAL_TYPE = {
  GO_WORK: "go-work",
  ATTENDANCE_REQUEST: "attendance-request",
};

const getCurrentDateFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const dayString = days[dayIndex];
  return `${month}/${day}(${dayString})`;
};

export default function Attendance({ IsworkDataState }) {
  const Logindata = getCookie("logindata");
  const [workData, setWorkData] = IsworkDataState;
  const [isGoWorkModal, setIsGoWorkModal] = useState(false);
  const [attendanceRequestModal, setAttendanceRequestModal] = useState(false);
  let [lateText, setLateText] = useState("");
  const userIdx = Logindata.data.idx;
  let now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const endDate = formattedDate;
  const startDate = formattedDate;
  const [type, setType] = useState(2);
  const [modalType, setModalType] = useState(1);
  const [modalAttendanceTime, setModalAttendanceTime] = useState(null);
  const [modalWorkIdx, setModalWorkIdx] = useState(null);
  const [inputs, setInputs] = useState({
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
    type: WORK_REQUEST_TYPE.EDIT,
  });
  const currentDateFormatted = getCurrentDateFormatted();
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  useEffect(() => {
    let workTimeData =
      workData != undefined || workData != null
        ? workData.startDate.split("T")[1].split(":").join("")
        : [];
    let startTimeData =
      Logindata.data.startTime != undefined || Logindata.data.startTime != null
        ? Logindata.data.startTime.split(":").join("")
        : [];
    let startTime = Number(startTimeData.slice(0, -2));
    let workTime = Number(workTimeData.slice(0, -2));

    if (
      startTime <= Number(`${hours}${minutes}`) ||
      workData == [] ||
      startTime < workTime
    ) {
      setLateText("지각");
    } else {
      setLateText("");
    }
  }, []);
  useEffect(() => {
    new workcheck().get(userIdx, startDate, endDate, type).then((res) => {
      if (res?.data) {
        setCookie("workdata", res.data[0], {
          path: "/",
        });
        setWorkData(res.data[0]);
      } else {
        removeCookie("workdata");
        setWorkData(null);
      }
    });
  }, []);

  useEffect(() => {
    if (workData != null) {
      const dateA = new Date(getCurrentDateFormatted());
      const dateB = new Date(workData.startDate.split("T")[0]);
      const diffMSec = dateA.getTime() - dateB.getTime();
      console.log(diffMSec);
      if (diffMSec != 0) {
        setWorkData(null);
      }
    }
  }, []);

  const toggleModalOpen = (type) => {
    if (type === MODAL_TYPE.GO_WORK) {
      setIsGoWorkModal(true);
    } else if (type === MODAL_TYPE.ATTENDANCE_REQUEST) {
      setAttendanceRequestModal(true);
    }
  };

  return (
    <AttendanceCard>
      <AttendanceTime>
        {!workData || !workData.endDate ? (
          <h2>{!workData?.startDate ? "근무 예정" : "현재 근무 중"}</h2>
        ) : (
          <>
            {/* <img
              src={HomeCalendarIcon}
              style={{ width: "30px", height: "30px" }}
            /> */}
            <h2>오늘 하루도 수고하셨습니다!</h2>
          </>
        )}

        <div className="v-line"></div>
        {/* 날짜 표시 */}
        <p>{currentDateFormatted}</p>

        {Logindata.data.startTime && Logindata.data.endTime ? (
          <p>
            {Logindata.data.startTime} AM - {Logindata.data.endTime} PM
          </p>
        ) : (
          <p>출퇴근 시간 정보가 없습니다.</p>
        )}

        <BtnDiv>
          <CommonBtn
            $size="m"
            $color={"white"}
            onClick={() => toggleModalOpen(MODAL_TYPE.ATTENDANCE_REQUEST)}
          >
            요청
          </CommonBtn>
          {/* <div className="line"></div> */}
          {/* 지각 */}
          {!workData || !workData.endDate ? (
            <CommonBtn
              style={{ width: "150px" }}
              onClick={() => toggleModalOpen(MODAL_TYPE.GO_WORK)}
              $size="m"
              $full
              $color={!workData?.startDate ? "blue" : "navy"}
            >
              {!workData?.startDate ? "출근하기" : "퇴근하기"}
            </CommonBtn>
          ) : (
            <CommonBtn style={{ width: "150px" }} $size="m" $full disabled>
              내일 만나요
            </CommonBtn>
          )}
        </BtnDiv>
        <hr className="line"></hr>
        <TimeDiv>
          {workData && (
            <>
              {/* 출근 */}
              <TimeText>
                {lateText && (
                  <TimeText style={{ color: "#FF0000" }}>
                    <div style={{ marginRight: "6px" }}>{lateText}</div>
                    {printDateTimeFormat(workData.startDate, "HH:mm")}
                  </TimeText>
                )}
                {!lateText && (
                  <TimeText style={{ color: "#616161" }}>
                    <div style={{ marginRight: "9px" }}>출근</div>
                    {printDateTimeFormat(workData.startDate, "HH:mm")}
                  </TimeText>
                )}
              </TimeText>

              {/* 퇴근 */}
              {workData.endDate && (
                <TimeText style={{ color: "#616161" }}>
                  <div style={{ marginRight: "6px" }}>퇴근</div>
                  {printDateTimeFormat(workData.endDate, "HH:mm")}
                </TimeText>
              )}
            </>
          )}
        </TimeDiv>
      </AttendanceTime>
      <AttendanceModal
        setWorkData={setWorkData}
        isModalOpen={isGoWorkModal}
        setIsModalOpen={setIsGoWorkModal}
      />
      <CreateAttendanceModal
        isModalOpen={attendanceRequestModal}
        setIsModalOpen={setAttendanceRequestModal}
        modalType={modalType}
        attendanceTime={modalAttendanceTime}
        workIdx={modalWorkIdx}
      ></CreateAttendanceModal>
    </AttendanceCard>
  );
}
