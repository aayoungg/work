/* eslint-disable */
import Calender from "Component/Date/Calender/Calender";
import styled from "styled-components";
import { getCookie } from "Cookie/cookie";
import { workcheck } from "Api/api";
import { useEffect, useState } from "react";
import Attendance from "../../Component/My/Attendance";

const HomeWrap = styled.div`
  width: 30%;
`;
const CalenderPosition = styled.div`
  width: 60vw;
  height: 670px;
  background: #fff;
  padding: 23px;
`;

const Card = styled.div`
  width: 100%;
  background: #fff;
  height: fit-content;
  padding: 28px;
  margin-bottom: 8px;
  border-radius: 3px;
`;

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Home({ IsworkDataState }) {
  const [workcheckData, setWorkcheckData] = useState([]);

  const LoginDate = getCookie("logindata");
  let userIdx = LoginDate.data.idx;
  let date = new Date();
  let nowstartDate = new Date(date.getFullYear(), date.getMonth(), 1);
  let nowendDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDate = formatDate(nowstartDate);
  const endDate = formatDate(nowendDate);

  const fetchWorkcheckData = async () => {
    const type = 2;
    try {
      const WorkDataChack = await new workcheck().get(
        userIdx,
        startDate,
        endDate,
        type
      );
      setWorkcheckData(WorkDataChack);
    } catch (error) {
      console.error("Error fetching workcheck data:", error);
    }
  };
  useEffect(() => {
    // 페이지 로드 시에 workcheck 데이터를 가져옴
    fetchWorkcheckData();
  }, []); // 빈 배열은 한 번만 실행되도록 함

  return (
    <HomeWrap>
      <Card>
        <Attendance IsworkDataState={IsworkDataState}></Attendance>
      </Card>
      <CalenderPosition>
        <Calender workcheckData={workcheckData} />
      </CalenderPosition>
    </HomeWrap>
  );
}

export default Home;
