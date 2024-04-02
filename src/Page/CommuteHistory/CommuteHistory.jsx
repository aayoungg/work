/* eslint-disable */
// (관리자)근태관리-직원 업무시간 목록
// (팀장)근태관리-출퇴근 목록
import React, { useEffect, useState } from "react";
import DatePicker from "Component/Date/DateTermPicker.jsx";
import { workcheck } from "Api/api.js";
import { getCookie } from "Cookie/cookie.js";
import SearchForm from "Component/Layout/SearchForm";
import MainTitle from "Component/Header/MainTitle";
import ReactTable from "Component/Table/ReactTable";
import { printDateTimeFormat } from "helper/value";
import Pagination from "../../Component/Pagination/Pagination";
import CommonBtn from "../../Component/Button/CommonBtn";
import CreateAttendanceModal from "../../Component/Modal/CreateAttendanceModal";
import { WORK_REQUEST_TYPE } from "../../constants/serviceConstants";
import PageSelectBox from "Component/SelectBox/PageSelectBox";

function CommuteHistory() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRecordAll, setDateRecordAll] = useState([]);
  const [dateRecord, setDateRecord] = useState([]);
  const LoginData = getCookie("logindata");
  const [type, setType] = useState(2); // 1 팀원 기록 2 자신의 출퇴근 기록 조회
  const [click, setClick] = useState(0); // 0 클릭 안함 1 클릭함
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(1);
  const [modalAttendanceTime, setModalAttendanceTime] = useState(null);
  const [modalWorkIdx, setModalWorkIdx] = useState(null);
  const [myRecord, setMyRecord] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  let userIdx = LoginData.data.idx;
  let rankName = LoginData.data.rankName;
  const totalItems = dateRecord == null ? 0 : dateRecord.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    dateRecord == null
      ? []
      : dateRecord.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value); // select box에서 선택한 값으로 itemsPerPage 목록 업데이트
  };
  useEffect(() => {
    if (rankName === "팀장" && click !== 1) {
      setType(1);
    }
    if (startDate !== null && endDate !== null) {
      new workcheck()
        .get(userIdx, startDate, endDate, type)
        .then((workdata) => {
          if (type === 1) {
            setDateRecordAll(workdata.data);
          } else {
            setDateRecord(workdata.data);
          }
        });
    }
  }, [startDate, endDate, click]);

  useEffect(() => {
    paginate(1);
    if (dateRecordAll != null) {
      if (myRecord) {
        setDateRecord(
          dateRecordAll.filter((record) => LoginData.data.name === record.name)
        );
      } else {
        dateRecordAll != null
          ? setDateRecord(
              dateRecordAll.filter(
                (record) => LoginData.data.name !== record.name
              )
            )
          : setDateRecord([]);
      }
    } else {
      setDateRecord([]);
    }
  }, [dateRecordAll, myRecord]);

  const columns = [
    {
      accessor: "name",
      Header: "이름",
      headerWidth: "170px",
      textCenter: true,
    },
    {
      accessor: "date",
      Header: "날짜",
      Cell: ({ row }) =>
        printDateTimeFormat(row.original.startDate, "YYYY-MM-dd"),
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "startDate",
      Header: "출근시간",
      Cell: ({ row }) => printDateTimeFormat(row.original.startDate, "HH:mm"),
      textCenter: true,
      headerWidth: "150px",
    },
    {
      accessor: "endDate",
      Header: "퇴근시간",
      headerWidth: "150px",
      Cell: ({ row }) =>
        row.original.endDate
          ? printDateTimeFormat(row.original.endDate, "HH:mm")
          : "-",
      textCenter: true,
    },
    {
      accessor: "termDate",
      Header: "근로시간",
      headerWidth: "150px",
      Cell: ({ row }) => {
        const startDate = new Date(row.original.startDate);
        const endDate = new Date(row.original.endDate);
        const diff = new Date(endDate - startDate);
        const hours = diff.getUTCHours();
        const minutes = diff.getUTCMinutes();

        return (
          <span>{row.original.endDate ? `${hours}시 ${minutes}분` : "-"}</span>
        );
      },
      textCenter: true,
    },
    LoginData.data.rankName !== "관리자"
      ? {
          accessor: "edit",
          Header: myRecord == true ? "관리" : "",
          Cell: ({ row }) => {
            return (
              <>
                {myRecord == true && (
                  <CommonBtn
                    $color={"white"}
                    onClick={() =>
                      AttendanceModalOpen(WORK_REQUEST_TYPE.EDIT, row.original)
                    }
                  >
                    수정
                  </CommonBtn>
                )}
              </>
            );
          },
          textCenter: true,
          headerWidth: "150px",
        }
      : {
          accessor: "edit",
          Header: "",
          textCenter: true,
          headerWidth: "0px",
        },
  ];

  const AttendanceModalOpen = (type, item) => {
    setIsModalOpen(true);
    setModalType(type);
    if (WORK_REQUEST_TYPE.EDIT === type) {
      console.log("실행");
      setModalAttendanceTime({
        startDate: item.startDate,
        endDate: item.endDate,
      });
      setModalWorkIdx(item.idx);
    } else {
      setModalAttendanceTime(null);
      setModalWorkIdx(null);
    }
  };

  return (
    <>
      {/*메인 타이틀*/}
      {LoginData.data.rankName !== "관리자" ? (
        <MainTitle title={"출퇴근 목록"}>
          <CommonBtn
            $size="m"
            onClick={() => AttendanceModalOpen(WORK_REQUEST_TYPE.CREATE)}
          >
            출퇴근 요청
          </CommonBtn>
        </MainTitle>
      ) : (
        <MainTitle title={"직원 업무시간 목록"}></MainTitle>
      )}

      {/*필터, 소팅*/}
      <SearchForm>
        <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
        {rankName === "팀장" && (
          <>
            <input
              type="checkbox"
              id="MyRecord"
              checked={myRecord}
              onChange={() => setMyRecord((prevState) => !prevState)}
            />
            <label htmlFor="MyRecord">내 기록 보기</label>
          </>
        )}
      </SearchForm>

      {/*테이블*/}
      <ReactTable columns={columns} data={currentItems} />
      <PageSelectBox onChange={handleItemsPerPageChange}>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </PageSelectBox>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        paginate={paginate}
      />
      <CreateAttendanceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalType={modalType}
        attendanceTime={modalAttendanceTime}
        workIdx={modalWorkIdx}
      ></CreateAttendanceModal>
    </>
  );
}

export default CommuteHistory;
