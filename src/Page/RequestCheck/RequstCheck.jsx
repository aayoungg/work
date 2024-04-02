/* eslint-disable */
//(팀장)근태 관리-받은 요청 목록
import { useEffect, useState } from "react";
import styled from "styled-components";
import { workRequest } from "../../Api/api.js";
import { getCookie } from "../../Cookie/cookie.js";
import Pagination from "../../Component/Pagination/Pagination.jsx";
import DatePicker from "../../Component/Date/DateTermPicker.jsx";
import NewModal from "../../Component/Modal/NewModal.jsx";
import ReactTable from "Component/Table/ReactTable.jsx";
import { printDateTimeFormat } from "helper/value.js";
import MainTitle from "Component/Header/MainTitle.jsx";
import SearchForm from "Component/Layout/SearchForm.jsx";
import PageSelectBox from "Component/SelectBox/PageSelectBox.jsx";
import CommonBtn from "Component/Button/CommonBtn.jsx";
import Modal from "react-modal";

const DataBox = styled.div`
  border: 1px solid var(--gray4);
  border-radius: 3px;
  height: 40px;
  padding: 0 17px;
  color: #000;
  box-sizing: border-box;
  width: 100%;
  max-width: 340px;
  display: flex;
  align-items: center;
  font-size: 14px;
  background: rgb(247, 247, 247);
`;
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
const Btn = styled.div`
  padding: 4px;
`;
const ButtonPosition = styled.div`
  display: flex;
  justify-content: center;
`;
function RequestCheck() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState();
  const [selectFilter, setSelectFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [confirm, setConfirm] = useState();
  const [idx, setIdx] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toggleModal = (record) => {
    setIsModalOpen(!isModalOpen);
    setModalData(record);
    setIdx(record.idx);
    console.log(record.idx);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const LoginData = getCookie("logindata");
  // 전체조회(2) 팀장조회(1)
  // 팀장 조회 1   전체 조회 2
  const [type, setType] = useState(1); // 1 팀원 기록 2 자신의 출퇴근 기록 조회

  // const [click, setClick] = useState(0); // 0 클릭 안함 1 클릭함

  function WorkRequest() {
    if (startDate !== null && endDate !== null) {
      new workRequest()
        .get(userIdx, startDate, endDate, type)
        .then((workRequest) => {
          if (workRequest.code === 200) {
            if (workRequest.data.length != 0) {
              setDateRecord(
                workRequest.data.filter((record) =>
                  LoginData.data.idx == record.userIdx ? "" : record
                )
              );
            } else {
              setDateRecord([]);
            }
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
          selectedFilter === "All"
            ? record
            : selectedFilter === "null"
            ? record.confirm === null
            : selectedFilter === "1"
            ? record.confirm === 1
            : record.confirm === 0
        )
      );
    }
  }
  console.log("selectFilter", selectFilter);
  useEffect(() => {
    WorkRequest();
  }, [startDate, endDate, type]);

  useEffect(() => {
    filter(selectFilter);
  }, [dateRecord]);

  // const itemsPerPage = 10;

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
            alert("처리 되셨습니다.");
            setIsModalOpen(!isModalOpen);
          }
        }
      });
    }
  }, [confirm]);

  const totalItems =
    value == undefined
      ? dateRecord && dateRecord.length
      : value && value.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    value == undefined
      ? dateRecord && dateRecord.slice(indexOfFirstItem, indexOfLastItem)
      : value && value.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    WorkRequest();
    filter(selectFilter);
  }, [confirm]);

  const columns = [
    {
      accessor: "name",
      Header: "이름",
      headerWidth: "120px",
      textCenter: true,
    },
    {
      accessor: "date",
      Header: "신청 일자",
      Cell: ({ row }) =>
        printDateTimeFormat(row.original.requestDate, "YYYY-MM-dd"),
      headerWidth: "120px",
      textCenter: true,
    },
    {
      accessor: "startDate",
      Header: "요청한 출/퇴근 시간",
      Cell: ({ row }) => {
        return (
          <>
            <span style={{ marginRight: "8px" }}>
              {printDateTimeFormat(row.original.startDate, "YYYY-MM-dd")}
            </span>
            {`${printDateTimeFormat(
              row.original.startDate,
              "HH:mm"
            )} ~ ${printDateTimeFormat(row.original.endDate, "HH:mm")}`}
          </>
        );
      },
      textCenter: true,
      headerWidth: "300px",
    },
    {
      accessor: "타입",
      Header: "타입",
      Cell: ({ row }) => {
        let record = row.original;
        return (
          <>
            {row.original.confirm === null ? (
              <CommonBtn $color={"white"} onClick={() => toggleModal(record)}>
                승인/거절
              </CommonBtn>
            ) : row.original.confirm === 1 ? (
              <div style={{ color: "#29C91C" }}>승인</div>
            ) : (
              <div style={{ color: "#FF0000" }}>거절</div>
            )}
          </>
        );
      },
      textCenter: true,
      headerWidth: "120px",
    },
  ];

  // 로그인 API에서 데이터 가져오기
  return (
    // 일단 기본 시간은 일주일인데 데이터가 있는 일주일만 표시
    // 1년까지 볼 수 있게 수정
    // for문 돌려서 나오게 하기
    <>
      <MainTitle title={"받은 요청 목록"}></MainTitle>

      <div style={{ display: "flex" }}>
        <SearchForm>
          <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
          <div>
            {LoginData.data.rankName !== "관리자" ? (
              <select
                onChange={(e) => filter(e.target.value)}
                style={{ width: "140px", height: "35px", textAlign: "center" }}
              >
                <option value="All">전체</option>
                <option value="null">
                  {type === 1 ? "승인/거절" : "요청 중"}
                </option>
                <option value="1">{type === 1 ? "승인" : "수락"}</option>
                <option value="0">거절</option>
              </select>
            ) : (
              <select
                onChange={(e) => filter(e.target.value)}
                style={{ width: "140px", height: "35px", textAlign: "center" }}
              >
                <option value="All">전체</option>
                <option value="null">
                  {type === 2 ? "승인/거절" : "요청 중"}
                </option>
                <option value="1">{type === 1 ? "승인" : "수락"}</option>
                <option value="0">거절</option>
              </select>
            )}
          </div>
        </SearchForm>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal_header">
            <h2 className="modal_title">승인 및 거절하기</h2>
            <button className="modal_close" onClick={closeModal}></button>
          </div>
          <div className="modal_content">
            <List>
              <DataBox>
                {`수정할 날짜: ${
                  modalData.startDate !== null
                    ? modalData.startDate.split(" ")[0]
                    : modalData.endDate.split(" ")[0]
                }`}
              </DataBox>
              <DataBox>
                {`요청 타입: ${
                  modalData.originalStartDate == null ||
                  (modalData.originalStartDate != null &&
                    modalData.originalEndDate != null)
                    ? "출퇴근"
                    : modalData.originalStartDate !== null
                    ? "출근"
                    : "퇴근"
                }`}
              </DataBox>
              <DataBox>
                출근시간:{" "}
                {modalData.originalStartDate != null ? (
                  <>
                    {" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginLeft: "8px",
                      }}
                    >
                      {modalData.originalStartDate.split(" ")[1].slice(0, -3)}
                    </span>{" "}
                    <span style={{ margin: "0px 8px" }}>{"->"}</span>{" "}
                    <span>
                      {modalData.startDate.split(" ")[1].slice(0, -3)}
                    </span>
                  </>
                ) : (
                  modalData.startDate.split(" ")[1].slice(0, -3)
                )}
              </DataBox>
              <DataBox>
                퇴근시간:{" "}
                {modalData.originalEndDate != null ? (
                  <>
                    {" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginLeft: "8px",
                      }}
                    >
                      {modalData.originalEndDate.split(" ")[1].slice(0, -3)}
                    </span>{" "}
                    <span style={{ margin: "0px 8px" }}>{"->"}</span>{" "}
                    <span>{modalData.endDate.split(" ")[1].slice(0, -3)}</span>
                  </>
                ) : (
                  modalData.endDate.split(" ")[1].slice(0, -3)
                )}
              </DataBox>
              <div className="modal_btn">
                <ButtonPosition>
                  <Btn>
                    <CommonBtn
                      type="button"
                      $size="l"
                      onClick={() => {
                        setConfirm(true);
                        WorkRequest();
                      }}
                      style={{ width: "8vw" }}
                    >
                      승인
                    </CommonBtn>
                  </Btn>
                  <Btn>
                    <CommonBtn
                      onClick={() => {
                        setConfirm(false);
                        WorkRequest();
                      }}
                      type="button"
                      $size="l"
                      $color="red"
                      style={{ width: "8vw" }}
                    >
                      거절
                    </CommonBtn>
                  </Btn>
                </ButtonPosition>
              </div>
            </List>
          </div>
        </Modal>
      )}

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

export default RequestCheck;
