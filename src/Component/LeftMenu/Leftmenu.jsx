import CommuteBtn from "../Button/CommuteBtn/Commutebtn.jsx";
import { useEffect, useState } from "react";
import styled from "styled-components";
import AttendanceModal from "../Modal/AttendanceModal.jsx";
import { getCookie, setCookie } from "../../Cookie/cookie.js";
import { ensureCookie } from "../../Cookie/cookiecheck.js";
import { NavLink, useLocation } from "react-router-dom";
import MenuSvg from "../../Image/svg/menuSvg.jsx";
import { workcheck } from "../../Api/api.js";

const MenuLeft = styled.div`
  width: 230px;
  height: 92vh;
  border-right: 1px solid #e7e7e7;
  padding: 0px 20px 0px 20px;
`;

const Late = styled.div`
  padding-top: 12px;
`;
const LateContent = styled.div`
  width: 100%;
  height: 150px;
  padding: 20px 0px 0px 0px;
`;

const NavStyle = styled(NavLink)`
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  background-color: #d9d3d3;
  margin-bottom: 12px;
  text-decoration-line: none;
  color: black;
  font-style: bold;
`;
const NavContent = styled.div`
  font-family: Abhaya Libre ExtraBold;
  font-size: 16px;
  font-weight: 800;
  line-height: normal;
`;
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    timeZoneName: "short",
  });
}

function Leftmenu({ workdataState }) {
  const Cookiecheck = ensureCookie("workdata");
  const Logindata = getCookie("logindata");
  const userIdx = Logindata.data.idx;
  let rankName = Logindata.data.rankName;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pathname } = useLocation();
  const [type, setType] = useState(2);

  let [lateText, setLateText] = useState("");
  // let [leaveText, setLeaveText] = useState('');
  let now = new Date();
  let nowDate = now.getDate();
  // let today = now.getDate();
  let nowHours = now.getHours();
  let nowMinutes = now.getMinutes();
  let nowTime = nowHours * 60 + nowMinutes;

  const formattedDate = now.toISOString().split("T")[0];
  const endDate = formattedDate;
  const startDate = formattedDate;
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // 상태를 현재와 반대로 토글
  };

  useEffect(() => {
    const check = async () => {
      if (Cookiecheck == formattedDate) {
        try {
          const workdata = await new workcheck().get(
            userIdx,
            startDate,
            endDate,
            type,
          );
          // 여기서 workdata가 변경되었을 때 쿠키를 업데이트합니다.
          setCookie("workdata", workdata.data[0], {
            path: "/",
            // secure: true,
          });
          setWorkdata(getCookie("workdata"));
        } catch (error) {
          // 에러 처리 로직 추가 (예: console.error(error);)
        }
      }
    };

    check();
  }, []);

  const [workdata, setWorkdata] = workdataState;
  const WorkData = getCookie("workdata");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 오늘 날짜
  const tomorrow = new Date(today); // 내일 날짜
  tomorrow.setDate(tomorrow.getDate() + 1); // 내일 날짜 설정
  const todayButtonTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    11,
    59,
    59,
  ); // 오늘 오전 9시

  useEffect(() => {
    // 오늘 오전 9시와 내일 오전 6시의 시간 계산
    const todayNineAM = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      9,
      0,
      0,
    ); // 오늘 오전 9시
    const tomorrowSixAM = new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      6,
      0,
      0,
    ); // 내일 오전 6시
    if (now >= todayNineAM && now < tomorrowSixAM) {
      {
        WorkData == undefined
          ? setLateText(nowDate + "일 지각")
          : WorkData.startDate > Logindata.data.startTime
            ? setLateText(nowDate + "일 지각")
            : setLateText("");
      }
    }
  }, [Logindata.data.startTime, nowTime]);

  // 서브 메뉴가 열려야 할 메뉴 id, ""이면 닫기

  const [isContentVisible, setIsContentVisible] = useState("");
  const toggleContentVisibility = (id) => {
    if (isContentVisible == id) {
      setIsContentVisible("");
    } else {
      setIsContentVisible(id);
    }
  };

  const menuList = [
    // 홈
    ...(rankName !== "관리자"
      ? [
        {
          id: 1,
          name: "홈",
          link: "/work/Home",
        },
      ]
      : []),

    // 출근/퇴근 기록
    {
      id: 2, // Change the id to a unique value, e.g., 2
      name: "출근/퇴근 기록",
      link: "/work/CommuteHistory",
      subMenu: null,
    },
    // 업무시간 수정 요청
    {
      id: 3, // Change the id to a unique value, e.g., 3
      name: "업무시간 수정 요청",
      link: null,
      subMenu: [
        ...(rankName !== "관리자"
          ? [
            {
              id: 4, // Change the id to a unique value, e.g., 4
              name: "출근/퇴근 요청",
              link: "/work/SendRequest",
            },
          ]
          : []),
        {
          id: 5, // Change the id to a unique value, e.g., 5
          name: rankName == "매니저" ? "출근/퇴근 요청 조회" : "요청조회",
          link: "/work/RequestCheck",
        },
      ],
    },
    ...(rankName === "팀장" || rankName === "관리자"
      ? [
        {
          id: 6, // Change the id to a unique value, e.g., 6
          name:
            rankName === "관리자"
              ? "직원 업무시간 생성"
              : "직원 업무시간 수정",
          link:
            rankName === "관리자" ? "/work/AdminRequest" : "/work/CreateWork",
        },
      ]
      : []),
  ];

  return (
    <>
      <MenuLeft>
        <LateContent>
          {/* 지각 */}
          <Late>{lateText}</Late>
          {/* 출근 */}
          {/* 출근 퇴근 부분 함 확인 요망 */}
          <Late>
            {workdata !== "undefined" && workdata !== undefined
              ? "출근시간 " +
              workdata.startDate
                .split("T")[1]
                .split(":")
                .slice(0, 2)
                .join("시") +
              "분"
              : ""}
          </Late>
          {/* 퇴근 */}
          <Late>
            {workdata !== "undefined" &&
              workdata !== undefined &&
              workdata.endDate !== null
              ? "퇴근시간 " +
              workdata.endDate
                .split("T")[1]
                .split(":")
                .slice(0, 2)
                .join("시") +
              "분"
              : ""}
          </Late>
        </LateContent>
        {/* <Late>{leaveText}</Late> */}

        {(workdata && workdata.length === 0) ||
          workdata === undefined ||
          workdata.endDate == null ? (
          <CommuteBtn onClick={toggleModal}>
            {(workdata && workdata.length === 0) ||
              workdata == undefined ||
              workdata.startDate == null
              ? "출근하기"
              : "퇴근하기"}
          </CommuteBtn>
        ) : (
          "퇴근 하셨습니다."
        )}
        {isModalOpen && (
          <Modal IsWorkData={setWorkdata} onClose={toggleModal} />
        )}

        {menuList.map((menu) => (
          <div key={menu.id}>
            <NavStyle
              to={menu.link}
              onClick={() => {
                menu.subMenu != null &&
                  menu.subMenu.length > 0 &&
                  toggleContentVisibility(menu.id);
              }}
              style={{
                background: pathname == menu.link ? "#ECF2FF" : "#FFFFFF",
                color: pathname == menu.link ? "#0055FB" : "#000000",
              }}
            >
              <MenuSvg color={pathname == menu.link ? "#0055FB" : "#000000"} />
              <NavContent>{menu.name}</NavContent>
            </NavStyle>
            {menu.subMenu != null && menu.subMenu.length > 0 && (
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: isContentVisible == menu.id ? "200px" : "0",
                  transition: "max-height 0.5s ease",
                }}
              >
                {menu.subMenu.map((sub) => (
                  <NavLink
                    key={sub.id}
                    to={sub.link}
                    style={{
                      textDecorationLine: "none",
                      color: "black",
                      margin: "0px 0px 10px 55px",
                      opacity: isContentVisible == menu.id ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </MenuLeft>
    </>
  );
}

export default Leftmenu;
