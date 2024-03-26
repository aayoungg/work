import { getjob, addjob, updatejob } from "Api/rankapi";
import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../Component/Button/NewButton";
import Modal from "react-modal";
import Pagination from "Component/Pagination/Pagination";

const Title = styled.h2`
  color: #333;
  padding-bottom: 10px;
`;

const SecTitle = styled.h2`
  display: flex;
  text-align: center;
  flex-direction: column;
  margin: 7px;
`;
const Form = styled.form``;

const InputGroup = styled.div`
  //파트 이름과 파트 메모 사이
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  width: 191px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 3px;
`;

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;

const Li = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-align: center;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #d9d9d9;
`;

const FlexStyle = styled.div`
  display: flex;
`;
export const Select = styled.select`
  margin: 3px;
  display: block;
  width: 191px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const TotalBtn = styled.div`
  //모달창-취소,수정 버튼
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin: 8px 0px;
`;
const Btn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 5px;
`;
const Rank = () => {
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [flag, setFlag] = useState("");
  const [job, setJob] = useState([]);
  const [filterFlag, setFilterFlag] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingJobIdx, setEditingJobIdx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 페이지당 표시되는
  const totalItems = job.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = job.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    //직책 목록 조회
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
          console.log(response.data.data);
          console.log(filterFlag);
          console.log(filteredJobs);
          setJob(filteredJobs);
        } else {
          console.log(response);
          console.error("직책 목록 데이터 형식이 잘못되었습니다.");
        }
      } catch (error) {
        console.error("직책 목록 가져오기 실패:", error);
      }
    };
    fetchJob();
  }, [filterFlag]);

  const handleSubmit = () => {
    setIsEditing(false);
    openModal();
  };

  const handleAddJob = async () => {
    //직책 생성
    new addjob().post(name, memo).then();
    setName("");
    setMemo("");
    closeModal();
  };

  const handleDeleteClick = async () => {
    //초기화
    setName("");
    setMemo("");
    closeModal();
  };

  const handleUpdateJob = async () => {
    //직책 수정
    try {
      const updatedJob = job.find((jobs) => jobs.idx === editingJobIdx);
      if (!updatedJob) {
        alert("직책 정보를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put("/api/v1/updateJobTitle", {
        idx: updatedJob.idx,
        name: name,
        flag: flag,
        memo: memo,
      });

      if (response.data.code === 200) {
        alert("직책 수정 완료");
        closeModal();
      } else {
        alert("직책 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("직책 수정 중 오류가 발생했습니다.");
      return error;
    }
  };

  const handleEditClick = (jobs) => {
    //직책 수정 모달 열기
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


  return (
    <div>
      <Title>직책 목록</Title>
      <FlexStyle>
        <Select
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
        </select>

        <Btn>
          <Button type="button" onClick={handleSubmit}>
            생성
          </Button>
        </Btn>
      </FlexStyle>
      <Ul>
        <Li>
          <span>직책</span>
          <span>메모</span>
          <span>사용여부</span>
          <span>수정</span>
        </Li>
        {currentItems?.map((jobs) => (
          <Li key={jobs.idx}>
            <span>{jobs.jobtitle}</span>
            <span>{jobs.jobtitleMemo}</span>
            <span>{jobs.jobtitleFlag == 0 ? "사용안함" : "사용함"}</span>
            <div>
              <Button onClick={() => handleEditClick(jobs)}>수정</Button>
              <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={false}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Form>
                    <SecTitle>{isEditing ? "직책 수정" : "직책 생성"}</SecTitle>
                    <InputGroup>
                      <InputField
                        type="text"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="직책"
                      />
                      <InputField
                        type="text"
                        value={memo || ""}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="메모"
                      />
                      {isEditing && (
                        <Select
                          value={flag}
                          onChange={(e) => {
                            setFlag(e.target.value);
                          }}
                        >
                          <option key={jobs.flag} value={1}>
                            사용함
                          </option>
                          <option key={jobs.flag} value={0}>
                            사용 안 함
                          </option>
                        </Select>
                      )}
                    </InputGroup>
                    <TotalBtn>
                      <Button type="button" onClick={handleDeleteClick}>
                        취소
                      </Button>
                      <Button type="button" onClick={handleAddOrUpdateJob}>
                        {isEditing ? "수정" : "저장"}
                      </Button>
                    </TotalBtn>
                  </Form>
                </div>
              </Modal>
            </div>
          </Li>
        ))}
      </Ul>
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
