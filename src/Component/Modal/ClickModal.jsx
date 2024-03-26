import React from "react";
import { useState } from "react";
import Button from "../components/Button";
import Modal from "react-modal";
import styled from "styled-components";
import axios from "axios";
const PartContainer = styled.div`
  overflow: hidden;
  width: 50vw;
  position: absolute;
  right: 24%;
  bottom: 40%;
`;

const Title = styled.h2`
  color: #333;
`;
const SecTitle = styled.h2`
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  //파트 이름과 파트 메모 사이
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  //파트 이름 칸
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 3px;
`;

const TextAreaField = styled.textarea`
  //파트 메모 칸
  padding: 20px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

const ButtonPosition = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
`;
const FlexStyle = styled.div`
  display: flex;
`;
export const Select = styled.select`
  //모달창-선택박스
  margin: 3px;
  display: block;
  width: 185px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const TotalBtn = styled.div`
  //모달창-취소,수정 버튼
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;
function ClickModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [flag, setFlag] = useState("사용함");
  const [filterFlag, setFilterFlag] = useState(-1);
  const [parts, setParts] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingPartId, setEditingPartId] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.2)",
      width: "100%",
      height: "100vh",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "360px",
      height: "250px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "white",
      justifyContent: "center",
    },
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
        alert("부서 수정 완료");
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
  };

  return (
    <PartContainer>
      <Ul>
        {parts?.map((part) => (
          <Li key={part.idx}>
            <span>{part.partname}</span>
            <span>{part.partMemo}</span>
            <span>{part.partFlag == 0 ? "사용안함" : "사용함"}</span>

            <div>
              <Button onClick={() => handleEditClick(part)}>수정</Button>
              <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                shouldCloseOnOverlayClick={false}
              >
                <Form>
                  <SecTitle>부서 수정</SecTitle>
                  <InputGroup>
                    <InputField
                      type="text"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <InputField
                      type="text"
                      defaultValue={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                    <Select
                      defaultValue={flag}
                      onChange={(e) => {
                        setFlag(e.target.value);
                      }}
                    >
                      <option key={part.partFlag} defaultValue={1}>
                        사용함
                      </option>
                      <option key={part.partFlag} defaultValue={0}>
                        사용 안 함
                      </option>
                    </Select>
                  </InputGroup>
                  <TotalBtn>
                    <Button onClick={handleCancelEdit}>취소</Button>
                    <Button onClick={handleUpdatePart}>수정</Button>
                  </TotalBtn>
                </Form>
              </Modal>
            </div>
          </Li>
        ))}
      </Ul>
    </PartContainer>
  );
}

export default ClickModal;
