import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Modal from "react-modal";
import { addPart } from "../Api/api";
import Pagination from "../Component/Pagination/Pagination";
import ReactTable from "Component/Table/ReactTable";
import SelectBox from "Component/SelectBox/SelectBox";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
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
const Part = () => {
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [flag, setFlag] = useState("사용함");
  const [filterFlag, setFilterFlag] = useState(-1);
  const [parts, setParts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPartId, setEditingPartId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  const totalItems = parts.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = parts.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지

  const handleCreatePart = () => {
    //부서 생성
    openModal();
  };

  //부서 목록 조회
  const fetchParts = async () => {
    try {
      const response = await axios.get("/api/v1/getParts");
      if (Array.isArray(response.data.data)) {
        const filteredParts =
          filterFlag === -1
            ? response.data.data
            : response.data.data.filter((part) => part.partFlag === filterFlag);
        setParts(filteredParts);
      } else {
        console.log(response);
        console.error("부서 목록 데이터 형식이 잘못되었습니다.");
      }
    } catch (error) {
      console.error("부서 목록 가져오기 실패:", error);
    }
  };
  useEffect(() => {
    fetchParts();
  }, [filterFlag, currentPage]);
  const handleSavePart = async () => {
    new addPart()
      .post(name, memo)
      .then((partdata) => {
        if (partdata.code === 200) {
          closeModal();
          fetchParts();
        }
      })
      .catch((log) => {
        console.log("Error", log);
      });

    setName("");
    setMemo("");
  };
  const handleUpdatePart = async () => {
    //부서 수정
    try {
      const updatedPart = parts.find((part) => part.idx === editingPartId);
      if (!updatedPart) {
        alert("부서를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put(`/api/v1/updatePart`, {
        idx: updatedPart.idx,
        name: name,
        memo: memo,
        flag: flag,
      });

      if (response.data.code === 200) {
        Swal.fire({
          title: "부서가 수정되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
        closeModal();
        fetchParts();
      } else {
        alert("부서 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("부서 수정 중 오류가 발생했습니다:", error);
      alert("부서 수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (part) => {
    //부서 목록에 수정 버튼 클릭 시 해당 부서 정보 받아오기
    setName(part.partname);
    setMemo(part.partMemo);
    setFlag(part.partFlag);
    setEditingPartId(part.idx);
    setIsEditing(true);
    openModal();
  };

  const handleCancelEdit = () => {
    //수정 중 취소 기능
    setIsEditing(false);
    setEditingPartId(null);
    setName("");
    setMemo("");
    closeModal();
  };
  const columns = [
    {
      accessor: "partname",
      Header: "부서",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "partMemo",
      Header: "메모",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => (row.original.partMemo ? row.original.partMemo : "-"),
    },
    {
      accessor: "filterFlag",
      Header: "사용여부",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => (row.original.partFlag == 0 ? "사용안함" : "사용함"),
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
      <MainTitle title={"부서 목록"}>
        <CommonBtn $size="m" onClick={handleCreatePart}>
          생성
        </CommonBtn>
      </MainTitle>
      <SelectBox
        value={filterFlag}
        onChange={(e) => setFilterFlag(Number(e.target.value))}
      >
        <option key={1} value={1}>
          사용함
        </option>
        <option key={0} value={0}>
          사용 안 함
        </option>
        <option key={-1} value={-1}>
          전체
        </option>
      </SelectBox>
      <Ul>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal_header">
            <h2 className="modal_title">
              {isEditing ? "부서 수정" : "부서 생성"}
            </h2>
            <button className="modal_close" onClick={handleCancelEdit}></button>
          </div>
          <div className="modal_content">
            <List>
              <li>
                <p>부서</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="부서"
                />
              </li>
              <li>
                <p>메모</p>
                <input
                  type="text"
                  value={memo}
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
                onClick={isEditing ? handleUpdatePart : handleSavePart}
              >
                {isEditing ? "수정" : "생성"}
              </CommonBtn>
            </div>
          </div>
        </Modal>
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

export default Part;
