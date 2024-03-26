/* eslint-disable */
//(팀장)근태 관리-보낸 요청 목록
import { useEffect, useState } from "react";
import styled from "styled-components";
import { workRequest } from "../../Api/api.js";
import { getCookie } from "../../Cookie/cookie.js";
import Pagination from "../../Component/Pagination/Pagination.jsx";
import DatePicker from "../../Component/Date/DateTermPicker.jsx";
import { printDateTimeFormat } from "helper/value";
import { toast } from "react-toastify";
import CommonBtn from "Component/Button/CommonBtn.jsx";
import ReactTable from "../../Component/Table/ReactTable.jsx";
import MainTitle from "Component/Header/MainTitle.jsx";
import SearchForm from "Component/Layout/SearchForm.jsx";
import PageSelectBox from "Component/SelectBox/PageSelectBox.jsx";
const ButtonPosition = styled.div`
  width: 60%;
  display: flex;
  justify-content: right;
`;

function SendRequest() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [idx, setIdx] = useState(null);
  const [checkBoxIdx, setCheckBoxIdx] = useState({});
  const [selectFilter, setSelectFilter] = useState("All");
  // 출퇴근 요청
  // const [modalType, setModalType] = useState(1);
  // const [modalAttendanceTime, setModalAttendanceTime] = useState(null);
  // const [modalWorkIdx, setModalWorkIdx] = useState(null);
  const [data, setData] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const LoginData = getCookie("logindata");
  const [type, setType] = useState(2);

  function WorkRequest() {
    if (startDate !== null && endDate !== null) {
      new workRequest()
        .get(userIdx, startDate, endDate, type)
        .then((workRequest) => {
          if (workRequest.code === 200) {
            setDateRecord(workRequest.data);
          } else {
            setDateRecord([]);
          }
        });
    }
  }
  let userIdx = LoginData.data.idx;
  const [dateRecord, setDateRecord] = useState([]);

  function filter(selectedFilter) {
    if (dateRecord != undefined) {
      setSelectFilter(selectedFilter);
      setValue(
        dateRecord.filter((record) =>
          selectFilter === "All"
            ? record
            : selectFilter === "0"
            ? record.confirm === null
            : selectFilter === "1"
            ? record.confirm === 1
            : record.confirm === 0
        )
      );
    }
  }
  // confirm:0 은 거절, 1은 수락

  useEffect(() => {
    setData(WorkRequest());
    WorkRequest();
  }, [startDate, endDate]);

  useEffect(() => {
    filter(selectFilter);
  }, [dateRecord]);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    // 현재 페이지가 맨 마지막 페이지보다 큰 경우
    if (currentPage > Math.ceil(totalItems / newItemsPerPage)) {
      // 현재 페이지를 맨 마지막 페이지로 설정
      setCurrentPage(Math.ceil(totalItems / newItemsPerPage));
    }
    setItemsPerPage(newItemsPerPage); // select box에서 선택한 값으로 itemsPerPage 목록 업데이트
  };

  useEffect(() => {
    if (modalData !== null) {
      new workRequest().put(idx, userIdx, confirm).then((confirmdata) => {
        if (confirmdata.data.code === 200) {
          if (confirm !== null) {
            WorkRequest();
            alert("처리 되셨습니다.");
            setIsModalOpen(!isModalOpen);
          }
        }
      });
    }
  }, [confirm]);

  const handleCheck = (idx) => {
    //삭제
    setCheckBoxIdx({ ...checkBoxIdx, [idx]: !checkBoxIdx[idx] });
  };

  const dataDelete = async () => {
    const toDelete = Object.keys(checkBoxIdx).filter((idx) => checkBoxIdx[idx]);

    if (window.confirm("정말 취소 하시겠습니까?") == true) {
      try {
        let allRequestsSuccessful = true;

        for (let i = 0; i < toDelete.length; i++) {
          let idx = toDelete[i];
          new workRequest().delete(idx).then((deletedata) => {
            if (deletedata.data.code !== 200) {
              allRequestsSuccessful = false;
            }
          });
        }
        if (allRequestsSuccessful) {
          toast("취소 되었습니다.");
          WorkRequest();
        } else {
          alert("에러");
        }
      } catch (error) {
        // 에러 처리
        console.error(error);
      }
    }
  };

  const totalItems =
    value == undefined
      ? dateRecord && dateRecord.length
      : value && value.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    value === undefined
      ? dateRecord && dateRecord.slice(indexOfFirstItem, indexOfLastItem)
      : value && value.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    WorkRequest();
    filter(selectFilter);
  }, [confirm]);

  const columns = [
    {
      accessor: "delete",
      Header: "요청 취소",
      Cell: ({ row }) => {
        let record = row.original;
        return (
          <>
            <div>
              {record.confirm === null ? (
                <div style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    onChange={() => handleCheck(record.idx)}
                    checked={checkBoxIdx[row.original.idx] || false}
                    style={{ display: "inline-block", margin: "0 10px" }}
                  />
                </div>
              ) : (
                <div style={{ cursor: "pointer" }}>-</div>
              )}
            </div>
          </>
        );
      },
      headerWidth: "100px",
      textCenter: true,
    },
    {
      accessor: "date",
      Header: "신청 날짜",
      Cell: ({ row }) =>
        printDateTimeFormat(row.original.requestDate, "YYYY-MM-dd"),
      headerWidth: "200px",
      textCenter: true,
    },
    {
      accessor: "",
      Header: "수정 요청한 날짜",
      Cell: ({ row }) =>
        printDateTimeFormat(row.original.startDate, "YYYY-MM-dd"),
      headerWidth: "200px",
      textCenter: true,
    },
    {
      accessor: "startDate",
      Header: "출근시간",
      Cell: ({ row }) => printDateTimeFormat(row.original.startDate, "HH:mm"),
      textCenter: true,
      headerWidth: "300px",
    },
    {
      accessor: "endDate",
      Header: "퇴근시간",
      Cell: ({ row }) =>
        row.original.endDate
          ? printDateTimeFormat(row.original.endDate, "HH:mm")
          : "-",
      textCenter: true,
      headerWidth: "100px",
    },
    {
      accessor: "",
      Header: "수락한 날짜",
      Cell: ({ row }) =>
        row.original.updateDate
          ? printDateTimeFormat(row.original.updateDate, "HH:mm")
          : "-",
      textCenter: true,
    },
    {
      accessor: "타입",
      Header: LoginData.data.rankName !== "관리자" ? "타입" : "",
      Cell: ({ row }) => {
        return (
          <>
            {LoginData.data.rankName !== "관리자" && row.original.confirm === 0
              ? "요청 중"
              : row.original.confirm === 1
              ? "수락"
              : "거절"}
          </>
        );
      },
      textCenter: true,
      headerWidth: "100px",
    },
  ];

  return (
    <>
      <MainTitle title={"보낸 요청 목록"}>
        {/* <CommonBtn
          $size="m"
          onClick={() => AttendanceModalOpen(WORK_REQUEST_TYPE.CREATE)}
        >
          출퇴근 요청
        </CommonBtn> */}
      </MainTitle>

      {/*메인 타이틀*/}

      <div style={{ display: "flex", width: "100%" }}>
        <SearchForm>
          <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
          <div>
            <select
              onChange={(e) => filter(e.target.value)}
              style={{ width: "140px", height: "35px", textAlign: "center" }}
            >
              <option value="All">전체</option>
              <option value="2">요청 중</option>
              <option value="1">수락</option>
              <option value="2">거절</option>
            </select>
          </div>
        </SearchForm>
        <ButtonPosition>
          <CommonBtn $size="m" $color="red" onClick={dataDelete}>
            삭제
          </CommonBtn>
        </ButtonPosition>
      </div>
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
    </>
  );
}

export default SendRequest;
