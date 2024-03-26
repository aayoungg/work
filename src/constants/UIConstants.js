export const adminMenu = [
  {
    title: "근태 관리",
    icon: "schedule",
    subMenu: [
      {
        title: "출퇴근 목록",
        link: "/work/CommuteHistory",
      },
      {
        title: "받은 요청 목록",
        link: "/work/RequestCheck",
      },
      {
        title: "직원 업무시간 목록",
        link: "/work/AdminRequest",
      },
    ],
  },
  {
    title: "휴가 관리",
    link: null,
    icon: "schedule",
    subMenu: [
      {
        title: "신청 받은 목록",
        link: "/VacationProcess",
      },
    ],
  },
  {
    title: "직원 관리",
    link: null,
    icon: "employee",
    subMenu: [
      {
        title: "계정 목록",
        link: "/account",
      },
      {
        title: "부서 목록",
        link: "/part",
      },
      {
        title: "직책 목록",
        link: "/position",
      },
      {
        title: "직급 목록",
        link: "/rank",
      },
    ],
  },
  {
    title: "마이페이지",
    link: "/mypage",
    icon: "mypage",
    subMenu: [],
  },
];
export const teamLeaderMenu = [
  {
    title: "홈",
    link: "/",
    icon: "home",
    subMenu: [],
  },
  {
    title: "근태 관리",
    link: null,
    icon: "schedule",
    subMenu: [
      {
        title: "직원 근태 관리",
        link: "/work/CreateWork",
      },
      {
        title: "출퇴근 목록",
        link: "/work/CommuteHistory",
      },
      {
        title: "받은 요청 목록",
        link: "/work/RequestCheck",
      },
      {
        title: "보낸 요청 목록",
        link: "/work/SendRequest",
      },
    ],
  },
  {
    title: "휴가 관리",
    link: null,
    icon: "schedule",
    subMenu: [
      {
        title: "휴가 신청",
        link: "/VacationReq",
      },
      {
        title: "신청 받은 목록",
        link: "/VacationProcess",
      },
    ],
  },
  {
    title: "마이페이지",
    link: "/mypage",
    icon: "mypage",
  },
];

export const TeamMemberMenu = [
  {
    title: "홈",
    link: "/",
    icon: "home",
    subMenu: [],
  },
  {
    title: "근태 관리",
    link: null,
    icon: "schedule",
    subMenu: [
      {
        title: "출퇴근 목록",
        link: "/work/CommuteHistory",
      },
      {
        title: "보낸 요청 목록",
        link: "/work/SendRequest",
      },
    ],
  },
  {
    title: "휴가 관리",
    link: null,
    icon: "schedule",
    subMenu: [
      {
        title: "휴가 신청",
        link: "/VacationReq",
      },
    ],
  },
  {
    title: "마이페이지",
    link: "/mypage",
    icon: "mypage",
    subMenu: [],
  },
];
