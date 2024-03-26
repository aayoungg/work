import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Modal from "react-modal";
import Pagination from "../Component/Pagination/Pagination";
import { addAccount } from "../Api/api";
import ReactTable from "Component/Table/ReactTable";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
import { getCookie, removeCookie } from "Cookie/cookie";
import { useNavigate } from "react-router-dom";
import CommonBtn from "Component/Button/CommonBtn";
import MainTitle from "Component/Header/MainTitle";
import Swal from "sweetalert2";
import ModalSelect from "Component/SelectBox/ModalSelectBox";
import TextArea from "Component/SelectBox/TextArea";

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;
const Btn = styled.div`
  padding: 4px;
`;
const ButtonPosition = styled.div`
  display: flex;
  justify-content: flex-end;
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
    textarea {
      width: 201px;
      height: 69px;
    }
  }
`;
const Account = () => {
  const navigate = useNavigate();
  const [userIdx, setUserIdx] = useState("");
  const [idx, setIdx] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [partidx, setPartIdx] = useState("");
  const [rankidx, setRankIdx] = useState("");
  const [flag, setFlag] = useState("사용함");
  const [filterFlag, setFilterFlag] = useState(-1);
  const [accounts, setAccounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccountId, setEdigingAccountId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [checkedAccounts, setCheckedAccounts] = useState({});
  const [part, setPart] = useState({ data: { data: [] } });
  const [position, setPosition] = useState({ data: { data: [] } });
  const [jobTitle, setJobTitle] = useState({ data: { data: [] } });
  const [jobTitleIdx, setJobTitleIdx] = useState("");
  const [firstDay, setFirstDay] = useState("");
  const loginData = getCookie("logindata");
  useEffect(() => {
    //logindata 쿠키 가져옴
    if (loginData) {
      setUserIdx(loginData.data.idx);
      setIdx(loginData.data.idx);
    }
  }, []);

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

  useEffect(() => {
    //수정 시 부서 select Box
    const fetchParts = async () => {
      const response = await axios.get("/api/v1/getParts");
      setPart(response);
      setPartIdx(response.data.data[0].idx);
    };
    fetchParts();
  }, []);
  useEffect(() => {
    const fetchPositions = async () => {
      const response = await axios.get("/api/v1/getRanks");
      setPosition(response);
      setRankIdx(response.data.data[0].idx);
    };
    fetchPositions();
  }, []);
  useEffect(() => {
    const fetchJobTitles = async () => {
      const response = await axios.get("/api/v1/getJobTitles");
      console.log(response);
      setJobTitle(response);
      setJobTitleIdx(response.data.data[0].idx);
    };
    fetchJobTitles();
  }, []);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = accounts.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = accounts.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    // 현재 페이지가 맨 마지막 페이지보다 큰 경우
    if (currentPage > Math.ceil(totalItems / newItemsPerPage)) {
      // 현재 페이지를 맨 마지막 페이지로 설정
      setCurrentPage(Math.ceil(totalItems / newItemsPerPage));
    }
    setItemsPerPage(newItemsPerPage); // select box에서 선택한 값으로 itemsPerPage 목록 업데이트
  };

  const handleCreateAccount = () => {
    // 계정 생성 시 모든 상태 초기화
    setId("");
    setPassword("");
    setName("");
    setPhone("");
    setEmail("");
    setFirstDay("");
    setPartIdx("");
    setRankIdx("");
    setJobTitleIdx("");
    setMemo("");
    setIsEditing(false);
    openModal();
  };

  const handleSaveAccount = async () => {
    try {
      if (
        !id.trim() ||
        !password.trim() ||
        !name.trim() ||
        !partidx.trim() ||
        !rankidx.trim() ||
        !jobTitleIdx.trim() ||
        !firstDay.trim()
      ) {
        alert("입력하지 않은 칸이 있습니다.");
        return;
      }

      const accountdata = await new addAccount().post(
        id,
        password,
        name,
        phone,
        email,
        partidx,
        rankidx,
        jobTitleIdx,
        firstDay,
        memo
      );

      if (accountdata.code === 200) {
        closeModal();
        fetchAccount();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const updatedAccount = accounts.find(
        (account) => account.idx === editingAccountId
      );
      if (!updatedAccount) {
        alert("계정을 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put(`/api/v1/changeemployee`, {
        idx: updatedAccount.idx,
        id: id,
        name: name,
        phone: phone,
        email: email,
        partIdx:
          partidx === undefined || partidx === ""
            ? part.data.data[0].idx
            : partidx,
        rankIdx:
          rankidx === undefined || rankidx === ""
            ? position.data.data[0].idx
            : rankidx,
        jobTitle:
          jobTitleIdx === null || jobTitleIdx === ""
            ? jobTitle.data.data[0].idx
            : jobTitleIdx,
        firstDay: firstDay,
        memo: memo,
        flag: flag,
      });
      console.log(response);
      if (response.data.code === 200) {
        Swal.fire({
          title: "계정이 수정되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
        fetchAccount();
        closeModal();
        if (loginData.data.idx === editingAccountId) {
          alert("로그인 페이지로 이동합니다.");
          removeCookie("logindata");
          navigate("/login");
        }
      } else {
        alert("계정 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("계정 수정 중 오류가 발생했습니다:", error);
      alert("계정 수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (account) => {
    //계정 목록에 수정 버튼 클릭 시 해당 계정 정보 받아오기
    setId(account.id);
    setName(account.name);
    setPhone(account.phone);
    setEmail(account.email);
    setMemo(account.memo);
    setFirstDay(account.firstDay);
    setPartIdx(account.part);
    setRankIdx(account.rankValue);
    setJobTitleIdx(account.jobTitleIdx);
    setEdigingAccountId(account.idx);
    setIsEditing(true);
    openModal();
  };

  const handleCheck = (idx) => {
    // 계정 체크 상태 업데이트
    setCheckedAccounts({ ...checkedAccounts, [idx]: !checkedAccounts[idx] });
  };

  const handleDeleteAccounts = async () => {
    // 선택된 계정 필터링
    const toDelete = Object.keys(checkedAccounts).filter(
      (idx) => checkedAccounts[idx]
    );

    const result = await Swal.fire({
      icon: "question",
      title: "정말 삭제하시겠습니까?",
      confirmButtonText: "확인",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      if (toDelete.length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "선택된 계정이 없습니다.",
          text: "삭제할 계정을 선택해주세요.",
          confirmButtonText: "확인",
          allowOutsideClick: false,
        });
        return;
      }

      try {
        let allRequestsSuccessful = true;

        for (let i = 0; i < toDelete.length; i++) {
          const response = await axios.delete("/api/v1/deleteUser", {
            params: {
              idx: toDelete[i],
            },
          });

          if (response.status !== 200) {
            allRequestsSuccessful = false;
            break;
          }
        }

        if (allRequestsSuccessful) {
          Swal.fire({
            icon: "success",
            confirmButtonText: "확인",
            allowOutsideClick: false,
            title: "성공적으로 삭제되었습니다.",
          });
          fetchAccount();
          setCheckedAccounts({});
        } else {
          Swal.fire({
            icon: "error",
            confirmButtonText: "확인",
            allowOutsideClick: false,
            title: "계정 삭제에 실패하였습니다.",
          });
        }
      } catch (error) {
        console.error("계정 삭제 실패:", error);
      }
    }
  };

  const isDeleteButtonDisabled = Object.values(checkedAccounts).every(
    (account) => !account
  );

  useEffect(() => {
    fetchAccount();
  }, [filterFlag, currentPage]);

  const fetchAccount = async () => {
    try {
      const response = await axios.get("/api/v1/getUsers");
      if (Array.isArray(response.data.data)) {
        const filteredAccounts =
          filterFlag === -1
            ? response.data.data
            : response.data.data.filter(
                (account) => account.AccountFlag === filterFlag
              );
        setAccounts(filteredAccounts);
      } else {
        console.log(response);
        console.error("계정 목록 데이터 형식이 잘못되었습니다.");
      }
    } catch (error) {
      console.error("계정 목록 가져오기 실패:", error);
    }
  };
  const columns = [
    {
      accessor: "checkbox",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) => (
        <input
          type="checkbox"
          onChange={() => handleCheck(row.original.idx)}
          checked={checkedAccounts[row.original.idx] || false}
          style={{ display: "inline-block", margin: "0 10px" }}
        />
      ),
    },
    {
      accessor: "id",
      Header: "아이디",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "name",
      Header: "이름",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "partName",
      Header: "부서",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "rankName",
      Header: "직책",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "jobTitleName",
      Header: "직급",
      headerWidth: "150px",
      textCenter: true,
      Cell: ({ row }) =>
        row.original.jobTitleName ? row.original.jobTitleName : "-",
    },
    {
      accessor: "firstDay",
      Header: "입사일",
      headerWidth: "150px",
      textCenter: true,
    },
    {
      accessor: "button",
      Header: "",
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
    <>
      <MainTitle title={"계정 목록"}>
        <ButtonPosition>
          <Btn>
            <CommonBtn $size="m" onClick={handleCreateAccount}>
              생성
            </CommonBtn>
          </Btn>
          <Btn>
            <CommonBtn
              $size="m"
              $color="red"
              onClick={handleDeleteAccounts}
              disabled={isDeleteButtonDisabled}
            >
              삭제
            </CommonBtn>
          </Btn>
        </ButtonPosition>
      </MainTitle>
      <Ul>
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal_header">
            <h2 className="modal_title">
              {isEditing ? "계정 수정" : "계정 생성"}
            </h2>
            <button className="modal_close" onClick={closeModal}></button>
          </div>
          <div className="modal_content">
            <List>
              <li>
                <p>아이디</p>
                <input
                  type="text"
                  defaultValue={id}
                  onChange={(e) => (isEditing ? null : setId(e.target.value))}
                  placeholder="아이디"
                  disabled={isEditing}
                />
              </li>
              {isEditing || (
                <li>
                  <p>비밀번호</p>
                  <input
                    type="password"
                    defaultValue={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                  />
                </li>
              )}
              <li>
                <p>이름</p>
                <input
                  type="name"
                  defaultValue={name}
                  onChange={(e) => (isEditing ? null : setName(e.target.value))}
                  placeholder="이름"
                  disabled={isEditing}
                />
              </li>
              <li>
                <p>전화번호</p>
                <input
                  type="phone"
                  defaultValue={phone}
                  onChange={(e) =>
                    isEditing ? null : setPhone(e.target.value)
                  }
                  placeholder="전화번호"
                  disabled={isEditing}
                />
              </li>
              <li>
                <p>이메일</p>
                <input
                  type="email"
                  defaultValue={email}
                  onChange={(e) =>
                    isEditing ? null : setEmail(e.target.value)
                  }
                  placeholder="이메일"
                  disabled={isEditing}
                />
              </li>
              <li>
                <p>입사일</p>
                <input
                  type="date"
                  value={firstDay}
                  onChange={(e) => setFirstDay(e.target.value)}
                />
              </li>
              <li>
                <p>부서</p>
                <ModalSelect
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPartIdx(e.target.value);
                  }}
                  value={partidx}
                >
                  <option value={0}>선택 안 됨</option>
                  {part.data.data.map((data) => (
                    <option key={`part${data.idx}`} value={data.idx}>
                      {data.partname}
                    </option>
                  ))}
                </ModalSelect>
              </li>
              <li>
                <p>직책</p>
                <ModalSelect
                  onChange={(e) => setRankIdx(e.target.value)}
                  value={rankidx}
                >
                  <option value={0}>선택 안 됨</option>
                  {position.data.data.map((data) => (
                    <option key={`rank${data.idx}`} value={data.idx}>
                      {data.rankname}
                    </option>
                  ))}
                </ModalSelect>
              </li>
              <li>
                <p>직급</p>
                <ModalSelect
                  onChange={(e) => setJobTitleIdx(e.target.value)}
                  value={jobTitleIdx}
                >
                  <option value={0}>선택 안 됨</option>
                  {jobTitle.data.data.map((data) => (
                    <option key={`jobtitle${data.idx}`} value={data.idx}>
                      {data.jobtitle}
                    </option>
                  ))}
                </ModalSelect>
              </li>
              <li>
                <p>메모</p>
                <TextArea
                  value={memo}
                  onChange={(e) => (isEditing ? null : setMemo(e.target.value))}
                  placeholder="메모"
                  disabled={isEditing}
                />
              </li>
            </List>

            <div className={"modal_btn"}>
              <CommonBtn
                type="button"
                $full
                $size="l"
                onClick={isEditing ? handleUpdateAccount : handleSaveAccount}
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
    </>
  );
};

export default Account;
