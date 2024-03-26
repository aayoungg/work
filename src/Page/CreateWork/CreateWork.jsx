/* eslint-disable */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { userUpdateTime, workTimeUnit } from "../../Api/api.js";
import { getCookie } from "../../Cookie/cookie.js";
import Pagination from "../../Component/Pagination/Pagination.jsx";
import NewModal from "../../Component/Modal/NewModal.jsx";
import ReactTable from "Component/Table/ReactTable.jsx";
import MainTitle from "Component/Header/MainTitle.jsx";
import PageSelectBox from "Component/SelectBox/PageSelectBox.jsx";
import { toast } from "react-toastify";
import CommonBtn from "Component/Button/CommonBtn.jsx";
import Modal from "react-modal";
import ModalSelect from "Component/SelectBox/ModalSelectBox.jsx";

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
function RequestCheck() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [timeDataCopy, setTimeDataCopy] = useState();
  const [value, setValue] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const LoginData = getCookie("logindata");
  let userIdx = LoginData.data.idx;
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const toggleModal = (record) => {
    setIsModalOpen(!isModalOpen);
    setModalData(record);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [dateRecord, setDateRecord] = useState([]);

  function UserUpdateTime() {
    new userUpdateTime().get(userIdx).then((workTimeRequest) => {
      setDateRecord(workTimeRequest.data);
    });
  }

  useEffect(() => {
    //팀원들의 업무시간 조회
    UserUpdateTime();
    // 수정 버튼 클릭 시 select Box 조회를 위한 API
    new workTimeUnit().get().then((TimeDataCheck) => {
      if (TimeDataCheck.code === 200) {
        setTimeDataCopy(TimeDataCheck.data);
      }
    });
  }, []);

  // const itemsPerPage = 10; // 페이지당 표시되는
  const totalItems = dateRecord && dateRecord.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems =
    dateRecord && dateRecord.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value); // select box에서 선택한 값으로 itemsPerPage 목록 업데이트
  };
  function IdxCheck(e) {
    const selectedIdx = e.target.value;
    setValue(
      timeDataCopy.find((TimeCheck) => selectedIdx === TimeCheck.idx.toString())
    );
  }

  function WorkChange() {
    const UpdateIdx = modalData.idx;
    if (value == undefined) {
      toast("근무 시간을 수정해주세요");
      return;
    }
    const idx = value.idx;
    new userUpdateTime().put(userIdx, UpdateIdx, idx).then((userUpdateDate) => {
      if (userUpdateDate.code === 200) {
        UserUpdateTime();
        alert("업무시간이 수정 됐습니다.");
        setValue(undefined);
        setIsModalOpen(!isModalOpen);
      }
    });
  }

  const columns = [
    {
      accessor: "name",
      Header: "이름",
      headerWidth: "100px",
      textCenter: true,
    },
    {
      accessor: "date",
      Header: "직급",
      Cell: ({ row }) => {
        return row.original.rank === 1
          ? "관리자"
          : row.original.rank === 2
          ? "팀장"
          : row.original.rank === 3
          ? "선임매니저"
          : "매니저";
      },
      headerWidth: "100px",
      textCenter: true,
    },
    {
      accessor: "startDate",
      Header: "근무 시간대 출근시간",
      Cell: ({ row }) => {
        return row.original.startTime != null
          ? `${row.original.startTime} ~ ${row.original.endTime}`
          : "-";
      },
      textCenter: true,
      headerWidth: "120px",
    },
    {
      accessor: "타입",
      Header: LoginData.data.rankName !== "관리자" ? "타입" : "",
      Cell: ({ row }) => {
        let record = row.original;
        return (
          <>
            <CommonBtn $color={"white"} onClick={() => toggleModal(record)}>
              수정하기
            </CommonBtn>
          </>
        );
      },
      textCenter: true,
      headerWidth: "100px",
    },
  ];

  return (
    <>
      <MainTitle title={"직원 근태 관리"}></MainTitle>

      <div>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              closeModal();
            }}
            modalData={modalData}
          >
            <div className="modal_header">
              <div className="modal_title">직원 근태 관리 수정하기</div>
              <div className="modal_close" onClick={closeModal}></div>
            </div>
            <div className="modal_content">
              <List>
                <input
                  type="text"
                  defaultValue={`이름: ${modalData.name}`}
                  readOnly
                />
                <div>
                  <ModalSelect onChange={IdxCheck}>
                    {timeDataCopy
                      .filter(
                        (TimeCheck) =>
                          TimeCheck.startTime === modalData.startTime
                      )
                      .map((TimeCheck, index) => (
                        <option key={index} value={TimeCheck.idx}>
                          {`근무시간: ${TimeCheck.startTime} ~ ${TimeCheck.endTime}`}
                        </option>
                      ))}
                    {/* 시작 시간이 modalData.startTime과 일치하지 않는 옵션 */}
                    {timeDataCopy
                      .filter(
                        (TimeCheck) =>
                          TimeCheck.startTime !== modalData.startTime
                      )
                      .map((TimeCheck, index) => (
                        <option key={index} value={TimeCheck.idx}>
                          {`근무시간: ${TimeCheck.startTime} ~ ${TimeCheck.endTime}`}
                        </option>
                      ))}
                  </ModalSelect>
                </div>
              </List>
              <div className="modal_btn">
                <CommonBtn
                  type="button"
                  $full
                  $size="l"
                  onClick={() => {
                    WorkChange();
                  }}
                >
                  수정하기
                </CommonBtn>
              </div>
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
      </div>
    </>
  );
}

export default RequestCheck;
