/* eslint-disable */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { vacationReq, vacationlist } from "../Api/vacationapi";
import { getCookie } from "../Cookie/cookie";
import ReactTable from "Component/Table/ReactTable";
import Pagination from "Component/Pagination/Pagination";
import MainTitle from "Component/Header/MainTitle";
import SearchForm from "Component/Layout/SearchForm";
import DatePicker from "Component/Date/DateTermPicker.jsx";
import axios from "axios";
import CommonBtn from "Component/Button/CommonBtn";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
import Swal from "sweetalert2";

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

      &::after {
        content: "*";
        color: #ff7b02;
      }
    }
  }
`;
const VacationReq = () => {
  const [vacations, setVacations] = useState([]);
  const [userIdx, setUserIdx] = useState("");
  const [startDate, setStartDate] = useState("");
  const [requestStart, setRequestStart] = useState("");
  const [requestEnd, setRequestEnd] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vacationType, setVacationType] = useState("0");
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vacation, setVacation] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const loginData = getCookie("logindata");
  const [vacationIdx, setVacationIdx] = useState(null);
  const [selectFilter, setSelectFilter] = useState("All");
  const [data, setData] = useState();
  const [confirm, setConfirm] = useState(null);
  const [value, setValue] = useState();
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems =
    value == undefined ? vacation && vacation.length : value && value.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems =
    value == undefined
      ? vacation && vacation.slice(indexOfFirstItem, indexOfLastItem)
      : value && value.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지
  useEffect(() => {
    //logindata 쿠키 가져옴
    if (loginData) {
      setUserIdx(loginData.data.idx);
      setIdx(loginData.data.idx);
    }
  }, []);
  const vacationRequest = function () {
    //신청한 휴가 목록을 조회
    const userIdx = loginData.data.idx;
    const startDate = requestStart;
    const endDate = requestEnd;
    let type = 2;
    if (startDate != "") {
      new vacationlist()
        .get(userIdx, startDate, endDate, type)
        .then((vacationdata) => {
          setVacation(vacationdata.data);
        });
    }
  };

  function filter(selectedFilter) {
    if (vacation != undefined) {
      setSelectFilter(selectedFilter);
      setValue(
        vacation.filter((record) =>
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
  // vacationStatus : 2 -> 승인 / 1: 대기 중 / 3: 반려

  useEffect(() => {
    filter(selectFilter);
  }, [vacation]);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const saveVacation = async () => {
    // 휴가 신청
    new vacationReq()
      .post(userIdx, vacationType, startDate, endDate, reason)
      .then((vacationdata) => {
        if (vacationdata.code === 200) {
          closeModal();
          vacationRequest();
        }
      })
      .catch((log) => {
        console.log("Error:", log);
      });
    setVacationType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    vacationRequest();
  };
  useEffect(() => {
    vacationRequest();
  }, [requestStart, requestEnd]);
  const handleCancelEdit = () => {
    setStartDate("");
    setEndDate("");
    setVacationType("");
    setReason("");
    closeModal();
  };
  const request = () => {
    //휴가 신청 버튼 클릭 시 모달 open
    openModal();
  };

  const handleDelete = async (idx) => {
    if (!idx) {
      Swal.fire({
        icon: "error",
        title: "휴가 idx를 가져올 수 없습니다.",
      });
      return;
    }
    const swalResult = await Swal.fire({
      icon: "question",
      title: "신청한 휴가를 취소하시겠습니까?",
      confirmButtonColor: "#d33",
      confirmButtonText: "확인",
      showLoaderOnConfirm: false,
      allowOutsideClick: false,
    });

    if (swalResult.isConfirmed) {
      try {
        let allRequestsSuccessful = true;
        setVacationIdx(idx);

        const response = await axios.delete(
          `/api/v1/vacation-app/delete?idx=${idx}`
        );

        Swal.fire({
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          title: response.data.msg,
        });
        vacationRequest();
        if (allRequestsSuccessful) {
        }
      } catch (error) {
        console.error("API 처리 중 오류 발생: ", error);
        Swal.fire({
          icon: "error",
          title: "서버와 통신 중 오류가 발생했습니다.",
        });
      }
    }
  };
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    // 현재 페이지가 맨 마지막 페이지보다 큰 경우
    if (currentPage > Math.ceil(totalItems / newItemsPerPage)) {
      //   // 현재 페이지를 맨 마지막 페이지로 설정
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
      headerWidth: "170px",
      textCenter: true,
    },
    {
      accessor: "RequestDate",
      Header: "신청 날짜",
      headerWidth: "100px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${row.original.requestDate}`;
      },
    },
    {
      accessor: "VacationDate",
      Header: "휴가 날짜",
      headerWidth: "200px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${row.original.startDate} ~ ${row.original.endDate}`;
      },
    },
    {
      accessor: "vacationType",
      Header: "휴가 종류",
      headerWidth: "150px",
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
      Header: "요청 사유",
      headerWidth: "140px",
      textCenter: true,
      Cell: ({ row }) => {
        return `${row.original.reason}`;
      },
    },
    {
      accessor: "rejectionReason",
      Header: "반려 사유",
      headerWidth: "140px",
      textCenter: true,
      Cell: ({ row }) => {
        return row.original.rejectionReason
          ? row.original.rejectionReason
          : "-";
      },
    },
    {
      accessor: "",
      Header: "타입",
      headerWidth: "80px",
      textCenter: true,
      Cell: ({ row }) => {
        return row.original.vacationStatus == 1 ? (
          "대기 중"
        ) : row.original.vacationStatus == 2 ? (
          <span style={{ color: "#29C91C" }}>승인</span>
        ) : (
          <span style={{ color: "#FF0000" }}>반려</span>
        );
      },
    },
    {
      accessor: "button",
      Header: "",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => {
        const vacationStatus = row.original.vacationStatus;
        return vacationStatus === 1 ? (
          <CommonBtn
            $color="red"
            onClick={() => handleDelete(row.original.idx)}
          >
            취소
          </CommonBtn>
        ) : null;
      },
    },
  ];

  return (
    <>
      <div>
        {vacations.map((vacation) => (
          <div key={vacation.idx} onClick={() => handleDelete(vacation.idx)}>
            {vacation.idx} - {vacation.startDate} ~ {vacation.endDate}
          </div>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal_header">
          <h2 className="modal_title">휴가 신청</h2>
          <button className="modal_close" onClick={handleCancelEdit}></button>
        </div>
        <div className="modal_content">
          <List>
            <li>
              <p>시작일</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </li>
            <li>
              <p>종료일</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </li>
            <li>
              <p>휴가 유형</p>
              <select
                class="bo_w_select"
                value={vacationType ? vacationType : 0}
                onChange={(e) => setVacationType(e.target.value)}
              >
                <option value="0">선택안됨</option>
                <option value="1">연차</option>
                <option value="2">반차</option>
                <option value="3">반반차</option>
                <option value="4">예비군훈련</option>
                <option value="5">출산휴가</option>
                <option value="6">배우자출산휴가</option>
                <option value="7">생리휴가</option>
                <option value="8">가족돌봄휴가</option>
                <option value="9">그 외</option>
              </select>
            </li>
            <li>
              <p>사유</p>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </li>
          </List>
          <div className={"modal_btn"}>
            <CommonBtn
              $full
              $size="l"
              onClick={saveVacation}
              disabled={!startDate || !endDate || !vacationType || !reason}
            >
              신청
            </CommonBtn>
          </div>
        </div>
      </Modal>

      <MainTitle title={"휴가 신청"}>
        <CommonBtn $size="m" onClick={request}>
          신청
        </CommonBtn>
      </MainTitle>
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

      <div className="scroll-table" style={{ height: "calc(100vh - 380px)" }}>
        <ReactTable columns={columns} data={currentItems} />
      </div>
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
};

export default VacationReq;
