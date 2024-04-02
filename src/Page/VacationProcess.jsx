/* eslint-disable */
import React, { useState, useEffect } from "react";
import { vacationPro, vacationProNo, vacationlist } from "../Api/vacationapi";
import { getCookie } from "../Cookie/cookie";
import ReactTable from "Component/Table/ReactTable";
import Pagination from "Component/Pagination/Pagination";
import PageSelectBox from "../Component/SelectBox/PageSelectBox";
import SearchForm from "Component/Layout/SearchForm";
import DatePicker from "Component/Date/DateTermPicker.jsx";
import MainTitle from "Component/Header/MainTitle.jsx";
import CommonBtn from "Component/Button/CommonBtn";
import Swal from "sweetalert2";

function VacationProcess() {
  const [requestStart, setRequestStart] = useState("");
  const [requestEnd, setRequestEnd] = useState("");
  const [userIdx, setUserIdx] = useState("");
  const [idx, setIdx] = useState("");
  const [approveIdx, setApproveIdx] = useState();
  const [action, setAction] = useState("");
  const [vacationProcess, setVacationProcess] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectFilter, setSelectFilter] = useState("All");
  const [confirm, setConfirm] = useState(null);
  const [value, setValue] = useState();

  const loginData = getCookie("logindata");
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    //logindata 쿠키 가져옴
    if (loginData) {
      setUserIdx(loginData.data.idx);
      setIdx(loginData.data.idx);
    }
  }, []);

  const vacationRequest = function () {
    const userIdx = loginData.data.idx;
    const startDate = requestStart;
    const endDate = requestEnd;
    let type = loginData.data.rankName == "관리자" ? 2 : 1;
    if (startDate != "") {
      new vacationlist()
        .get(userIdx, startDate, endDate, type)
        .then((vacationdata) => {
          if (vacationdata.data != null) {
            setVacationProcess(
              vacationdata.data.filter((record) =>
                loginData.data.idx == record.userIdx ? "" : record
              )
            );
          } else {
            setVacationProcess([]);
          }
        });
    }
  };
  function filter(selectedFilter) {
    if (vacationProcess != undefined) {
      setSelectFilter(selectedFilter);
      setValue(
        vacationProcess.filter((record) =>
          selectedFilter === "All"
            ? record
            : selectedFilter === "1"
            ? record.vacationStatus === 1
            : selectedFilter === "2"
            ? record.vacationStatus === 2
            : record.vacationStatus === 3
        )
      );
    }
  }
  useEffect(() => {
    vacationRequest();
  }, [requestStart, requestEnd]);
  useEffect(() => {
    filter(selectFilter);
  }, [vacationProcess]);

  const totalItems = vacationProcess == undefined ? 0 : vacationProcess.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems =
    value == undefined
      ? vacationProcess &&
        vacationProcess.slice(indexOfFirstItem, indexOfLastItem)
      : value && value.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지

  const handleApprove = async (row) => {
    const approveIdx = loginData.data.rankName == "팀장" ? 2 : 1;
    const { idx, action } = row.original;
    Swal.fire({
      title: "승인되었습니다.",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        new vacationPro().put(idx, approveIdx, "approve").then((testdata) => {
          if (testdata.code === 200) {
            vacationRequest();
          }
        });
        setIdx(idx); // idx 설정
        setApproveIdx(approveIdx); // approveIdx 설정
        setAction("approve"); // action을 'approve'로 설정
      }
    });
  };

  const handleReject = async (row) => {
    const { idx } = row.original;
    Swal.fire({
      title: "반려하시겠습니까?",
      inputPlaceholder: "반려 사유를 입력하세요.",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "반려",
      showLoaderOnConfirm: true,
      preConfirm: (rejectReason) => {
        if (!rejectReason) {
          Swal.showValidationMessage("반려 사유를 입력하세요!");
        }
        return rejectReason;
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const approveIdx = loginData.data.rankName === "팀장" ? 2 : 1; // approveIdx 설정
        new vacationProNo()
          .put(idx, approveIdx, "반려", result.value) // action을 '반려'로 설정
          .then((deletedata) => {
            const updatedVacationProcess = vacationProcess.map((item) => {
              if (item.idx === idx) {
                return { ...item, action: "반려" };
              }
              return item;
            });
            if (deletedata.code === 200) {
              vacationRequest();
              Swal.fire({
                icon: "success",
                title: "반려되었습니다.",
              });
            }
            setVacationProcess(updatedVacationProcess);
          });
      }
    });
  };
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
    vacationRequest();
    filter(selectFilter);
  }, [confirm]);

  const columns = [
    {
      accessor: "name",
      Header: "이름",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "RequestDate",
      Header: "신청 날짜",
      headerWidth: "120px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${row.original.requestDate}`;
      },
    },
    {
      accessor: "VacationDate",
      Header: "휴가 날짜",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${row.original.startDate} ~ ${row.original.endDate}`;
      },
    },
    {
      accessor: "vacationType",
      Header: "휴가 종류",
      headerWidth: "120px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${
          row.original.vacationType == 1
            ? "연차"
            : row.original.vacationType == 2
            ? "반차"
            : row.original.vacationType == 3
            ? "반반차"
            : row.original.vacationType == 4
            ? "예비군훈련"
            : row.original.vacationType == 5
            ? "출산휴가"
            : row.original.vacationType == 6
            ? "배우자출산휴가"
            : row.original.vacationType == 7
            ? "생리휴가"
            : row.original.vacationType == 8
            ? "가족돌봄휴가"
            : "그 외"
        }`;
      },
    },
    {
      accessor: "reason",
      Header: "사유",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${row.original.reason}`;
      },
    },
    {
      accessor: "button",
      Header: "타입",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => {
        return (
          <>
            {row.original.vacationStatus === 1 ? (
              <>
                <CommonBtn $color={"white"} onClick={() => handleReject(row)}>
                  반려
                </CommonBtn>
                <span style={{ margin: "0 5px" }}></span>
                <CommonBtn
                  $color={"white"}
                  type="button"
                  onClick={() => handleApprove(row)}
                >
                  승인
                </CommonBtn>
              </>
            ) : row.original.vacationStatus === 2 ? (
              <div style={{ color: "#29C91C" }}>승인</div>
            ) : (
              <div style={{ color: "#FF0000" }}>반려</div>
            )}
          </>
        );
      },
    },
  ];
  return (
    <>
      <MainTitle title={"신청 받은 목록"}></MainTitle>
      <SearchForm>
        <DatePicker setStartDate={setRequestStart} setEndDate={setRequestEnd} />
        <select
          onChange={(e) => filter(e.target.value)}
          style={{ width: "140px", height: "35px", textAlign: "center" }}
        >
          <option value="All">전체</option>
          <option value="1">대기 중</option>
          <option value="2">승인</option>
          <option value="3">반려</option>
        </select>
      </SearchForm>

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

export default VacationProcess;
