/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
import { addRank } from "../Api/api";
import Pagination from "../Component/Pagination/Pagination";
import ReactTable from "Component/Table/ReactTable";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
import SelectBox from "Component/SelectBox/SelectBox";
import CommonBtn from "Component/Button/CommonBtn";
import MainTitle from "Component/Header/MainTitle";
import Swal from "sweetalert2";

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const Select = styled.select`
  //모달창-선택박스
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
function Position() {
  const [name, setRankName] = useState("");
  const [memo, setRankMemo] = useState("");
  const [ranks, setRanks] = useState([]);
  const [flag, setRankFlag] = useState("사용함");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRankId, setEditingRankId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filterFlag, setFilterFlag] = useState(-1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    content: {
      backgroundColor: "white",
    },
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
  const handleSubmit = () => {
    openModal();
  };

  const handleSaveRank = async () => {
    new addRank()
      .post(name, memo)
      .then((rankdata) => {
        console.log(rankdata);
        if (rankdata.code === 200) {
          fetchPositions();
          closeModal();
        }
      })
      .catch((log) => {
        console.log("Error", log);
      });
    setRankName("");
    setRankMemo("");
  };

  const handleUpdateRank = async (RankId) => {
    //직책 수정
    try {
      const updatedRank = ranks.find((rank) => rank.idx === editingRankId);
      if (!updatedRank) {
        alert("직책 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put(`/api/v1/updateRank`, {
        idx: updatedRank.idx,
        name: name,
        memo: memo,
        flag: flag,
      });

      if (response.data.code === 200) {
        Swal.fire({
          title: "직책이 수정되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
        closeModal();
        fetchPositions();
      } else {
        alert("직책 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("직책 수정 중 오류가 발생했습니다:", error);
      alert("직책 수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (rank) => {
    //직급 목록에 수정 버튼 클릭 시 해당 직급 정보 받아오기
    setRankName(rank.rankname);
    setRankMemo(rank.rankMemo);
    setRankFlag(rank.rankFlag);
    setEditingRankId(rank.idx);
    setIsEditing(true);
    openModal();
  };
  const handleCancelEdit = () => {
    //수정 중 취소 기능
    setIsEditing(false);
    setEditingRankId(null);
    setRankName("");
    setRankMemo("");
    closeModal();
  };
  //직책 목록 사용 여부 구분
  const fetchPositions = async () => {
    try {
      const response = await axios.get("/api/v1/getRanks");
      if (Array.isArray(response.data.data)) {
        const filteredRanks =
          filterFlag === -1
            ? response.data.data
            : response.data.data.filter((rank) => rank.rankFlag === filterFlag);
        setRanks(filteredRanks);
      } else {
        console.log(response);
        console.error("직책 목록 데이터 형식이 잘못되었습니다.");
      }
    } catch (error) {
      console.error("직책 목록 가져오기 실패:", error);
    }
  };
  useEffect(() => {
    fetchPositions();
  }, [filterFlag]);
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = ranks.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = ranks.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지
  const columns = [
    {
      accessor: "rankname",
      Header: "직책",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "rankMemo",
      Header: "메모",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => (row.original.rankMemo ? row.original.rankMemo : "-"),
    },
    {
      accessor: "filterFlag",
      Header: "사용여부",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => (row.original.rankFlag == 0 ? "사용안함" : "사용함"),
    },
    {
      accessor: "button",
      Header: "수정",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => {
        const rankname = row.original.rankname;
        return rankname === "관리자" ? null : (
          <CommonBtn
            $color={"white"}
            onClick={() => handleEditClick(row.original)}
          >
            수정
          </CommonBtn>
        );
      },
    },
  ];
  return (
    <>
      <MainTitle title={"직책 목록"}>
        <CommonBtn $size="m" type="button" onClick={handleSubmit}>
          생성
        </CommonBtn>
      </MainTitle>
      <SelectBox
        value={filterFlag}
        onChange={(e) => setFilterFlag(Number(e.target.value))}
      >
        <option key={ranks.rankFlag} value={1}>
          사용함
        </option>
        <option key={ranks.rankFlag} value={0}>
          사용 안 함
        </option>
        <option key={ranks.rankFlag} value={-1}>
          전체
        </option>
      </SelectBox>

      <Ul>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal_header">
            <h2 className="modal_title">
              {isEditing ? "직책 수정" : "직책 생성"}
            </h2>
            <button className="modal_close" onClick={handleCancelEdit}></button>
          </div>
          <div className="modal_content">
            <List>
              <li>
                <p>직책</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setRankName(e.target.value)}
                  placeholder="직책"
                />
              </li>
              <li>
                <p>메모</p>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setRankMemo(e.target.value)}
                  placeholder="메모"
                />
              </li>
              {isEditing && (
                <li>
                  <p>사용여부</p>
                  <select
                    class="bo_w_select"
                    value={flag}
                    onChange={(e) => {
                      setRankFlag(e.target.value);
                    }}
                  >
                    <option key={1} value={1}>
                      사용함
                    </option>
                    <option key={0} value={0}>
                      사용 안 함
                    </option>
                  </select>
                </li>
              )}
            </List>
            <div className={"modal_btn"}>
              <CommonBtn
                type="button"
                $full
                $size="l"
                onClick={isEditing ? handleUpdateRank : handleSaveRank}
                disabled={!name}
              >
                {isEditing ? "수정" : "생성"}
              </CommonBtn>
            </div>
          </div>
        </Modal>
      </Ul>
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
}

export default Position;
