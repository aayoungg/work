/* eslint-disable */
import { workcheck } from "../../Api/api";
import { getCookie, removeCookie, setCookie } from "../../Cookie/cookie";
import { useEffect, useState } from "react";
import AttendanceModal from "Component/Modal/AttendanceModal";
import styled from "styled-components";
import { printDateTimeFormat } from "../../helper/value";
import CommonBtn from "../Button/CommonBtn";

const AttendanceCard = styled.div`
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const AttendanceTime = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  // flex-direction: row;
  // margin-bottom: 30px;
  
`;

const TimeText = styled.div`
  display: flex;

  span {
    width: 40px;
    display: block;
  }
`;

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Attendance({ IsworkDataState }) {
  const Logindata = getCookie("logindata");
  const [workData, setWorkData] = IsworkDataState;

  const [isModalOpen, setIsModalOpen] = useState(false);
  let [lateText, setLateText] = useState("");
  const userIdx = Logindata.data.idx;
  let now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const endDate = formattedDate;
  const startDate = formattedDate;
  const [type, setType] = useState(2);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // 상태를 현재와 반대로 토글
  };

  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  useEffect(() => {

    let workTimeData = workData != undefined || workData != null ? workData.startDate.split("T")[1].split(":").join("") : []
    let startTimeData = Logindata.data.startTime != undefined || Logindata.data.startTime != null ? Logindata.data.startTime.split(":").join("") : [];
    let startTime = Number(startTimeData.slice(0, -2))
    let workTime = Number(workTimeData.slice(0, -2))

    if (startTime <= Number(`${hours}${minutes}`) || workData == [] || startTime < workTime) {
      setLateText("지각");
    } else {
      setLateText("")
    }
  }, [])
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
      const dateA = new Date(getToday());
      const dateB = new Date(workData.startDate.split("T")[0]);
      const diffMSec = dateA.getTime() - dateB.getTime();
      console.log(diffMSec)
      if (diffMSec != 0) {
        setWorkData(null);
      }
    }
  }, [])

  return (
    <AttendanceCard>
      <AttendanceTime>
        {/* 지각 */}
        {!workData || !workData.endDate ? (
          <CommonBtn style={{ width: "150px" }} onClick={toggleModal} $size="m" $line $full>
            {!workData?.startDate ? "출근하기" : "퇴근하기"}
          </CommonBtn>
        ) : (
          <CommonBtn style={{ width: "150px" }} $size="m" $full disabled>
            퇴근완료
          </CommonBtn>
        )}

        {workData && (
          <>
            {/* 출근 */}
            <TimeText style={{ color: "#3788d8" }}>
              {lateText && <TimeText><div style={{ marginRight: "6px" }}>{lateText}</div></TimeText>}
              {printDateTimeFormat(workData.startDate, "HH시 mm분")}
            </TimeText>
            ~
            {/* 퇴근 */}
            {workData.endDate && (
              <TimeText style={{ color: "#ff6060" }}>
                {printDateTimeFormat(workData.endDate, "HH시 mm분")}
              </TimeText>
            )}
          </>
        )}
      </AttendanceTime>
      <AttendanceModal
        setWorkData={setWorkData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </AttendanceCard>
  );
}
