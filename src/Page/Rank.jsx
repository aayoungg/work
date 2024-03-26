import { getjob, addjob, updatejob } from "Api/rankapi";
import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import Pagination from "Component/Pagination/Pagination";
import ReactTable from "Component/Table/ReactTable";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
import SelectBox from "Component/SelectBox/SelectBox";
import CommonBtn from "Component/Button/CommonBtn";
import MainTitle from "Component/Header/MainTitle";
import ModalSelect from "Component/SelectBox/ModalSelectBox";
import Swal from "sweetalert2";

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;
export const Select = styled.select`
  margin: 3px;
  display: block;
  width: 191px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
const Rank = () => {
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [flag, setFlag] = useState("사용함");
  const [job, setJob] = useState([]);
  const [filterFlag, setFilterFlag] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobIdx, setEditingJobIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalItems = job.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = job.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    // 현재 페이지가 맨 마지막 페이지보다 큰 경우
    if (currentPage > Math.ceil(totalItems / newItemsPerPage)) {
      // 현재 페이지를 맨 마지막 페이지로 설정
      setCurrentPage(Math.ceil(totalItems / newItemsPerPage));
    }
    setItemsPerPage(newItemsPerPage); // select box에서 선택한 값으로 itemsPerPage 목록 업데이트
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  //직급 목록 조회
  const fetchJob = async () => {
    try {
      const response = await axios.get("/api/v1/getJobTitles");

      if (Array.isArray(response.data.data)) {
        const filteredJobs =
          filterFlag === -1
            ? response.data.data
            : response.data.data.filter(
                (job) => job.jobtitleFlag === filterFlag
              );
        setJob(filteredJobs);
      } else {
        console.log(response);
        console.error("직급 목록 데이터 형식이 잘못되었습니다.");
      }
    } catch (error) {
      console.error("직급 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [filterFlag]);

  const handleSubmit = () => {
    setIsEditing(false);
    openModal();
  };

  const handleAddJob = async () => {
    //직급 생성
    new addjob()
      .post(name, memo)
      .then((jobdata) => {
        if (jobdata.code === 200) {
          closeModal();
          fetchJob();
        }
      })
      .catch((log) => {
        console.log("Error", log);
      });
    setName("");
    setMemo("");
  };

  const handleCancelEdit = async () => {
    //초기화
    setName("");
    setMemo("");
    closeModal();
  };

  const handleUpdateJob = async () => {
    //직급 수정
    try {
      const updatedJob = job.find((jobs) => jobs.idx === editingJobIdx);
      if (!updatedJob) {
        alert("직급 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put("/api/v1/updateJobTitle", {
        idx: updatedJob.idx,
        name: name,
        flag: flag,
        memo: memo,
      });

      if (response.data.code === 200) {
        Swal.fire({
          title: "직급이 수정되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
        closeModal();
        fetchJob();
      } else {
        alert("직급 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("직급 수정 중 오류가 발생했습니다.");
      return error;
    }
  };

  const handleEditClick = (jobs) => {
    //직급 수정 모달 열기
    setName(jobs.jobtitle);
    setMemo(jobs.jobtitleMemo);
    setFlag(jobs.jobtitleFlag);
    setEditingJobIdx(jobs.idx);
    setIsEditing(true); // 수정 모드로 설정
    openModal();
  };

  const handleAddOrUpdateJob = async () => {
    if (isEditing) {
      handleUpdateJob();
    } else {
      handleAddJob();
    }
  };
  const columns = [
    {
      accessor: "jobtitle",
      Header: "직급",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "jobtitleMemo",
      Header: "메모",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) =>
        row.original.jobtitleMemo ? row.original.jobtitleMemo : "-",
    },
    {
      accessor: "filterFlag",
      Header: "사용여부",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) =>
        row.original.jobtitleFlag == 0 ? "사용안함" : "사용함",
    },
    {
      accessor: "button",
      Header: "수정",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => (
        <CommonBtn
          $color={"white"}
          onClick={() => handleEditClick(row.original)}
        >
          수정
        </CommonBtn>
      ),
    },
  ];
  return (
    <div>
      <MainTitle title={"직급 목록"}>
        <CommonBtn $size="m" type="button" onClick={handleSubmit}>
          생성
        </CommonBtn>
      </MainTitle>
      <SelectBox
        value={filterFlag}
        onChange={(e) => setFilterFlag(Number(e.target.value))}
      >
        <option key="1" value="1">
          사용함
        </option>
        <option key="0" value="0">
          사용 안 함
        </option>
        <option key="-1" value="-1">
          전체
        </option>
      </SelectBox>
      <Ul>
        <div>
          <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={false}
          >
            <div className="modal_header">
              <h2 className="modal_title">
                {isEditing ? "직급 수정" : "직급 생성"}
              </h2>
              <button
                className="modal_close"
                onClick={handleCancelEdit}
              ></button>
            </div>
            <div className="modal_content">
              <List>
                <li>
                  <p>직급</p>
                  <input
                    type="text"
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="직급"
                  />
                </li>
                <li>
                  <p>메모</p>
                  <input
                    type="text"
                    value={memo || ""}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="메모"
                  />
                </li>
                {isEditing && (
                  <li>
                    <p>사용여부</p>
                    <ModalSelect
                      value={flag}
                      onChange={(e) => {
                        setFlag(e.target.value);
                      }}
                    >
                      <option key={1} value={1}>
                        사용함
                      </option>
                      <option key={0} value={0}>
                        사용 안 함
                      </option>
                    </ModalSelect>
                  </li>
                )}
              </List>
              <div className={"modal_btn"}>
                <CommonBtn
                  type="button"
                  $full
                  $size="l"
                  onClick={handleAddOrUpdateJob}
                >
                  {isEditing ? "수정" : "생성"}
                </CommonBtn>
              </div>
            </div>
          </Modal>
        </div>
      </Ul>
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
  );
};

export default Rank;
