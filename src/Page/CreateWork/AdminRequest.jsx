/* eslint-disable */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { workTimeUnit } from "../../Api/api";
// Time 캘린더
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
import { toast } from "react-toastify";
import MainTitle from "Component/Header/MainTitle";
import CommonBtn from "Component/Button/CommonBtn";
import ReactTable from "Component/Table/ReactTable";
import Pagination from "Component/Pagination/Pagination";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
import Modal from "react-modal";
import ModalSelect from "Component/SelectBox/ModalSelectBox";

const Btn = styled.div`
  padding: 4px;
`;
const ButtonPosition = styled.div`
  display: flex;
  justify-content: flex-end;
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

function AdminRequest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("default");
  const [modalHeader, setModalHeader] = useState("defaults");
  const [timeDataCopy, setTimeDataCopy] = useState([]);
  const [value, setValue] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [checkBoxIdx, setCheckBoxIdx] = useState({});
  const [data, setData] = useState();
  // 시간
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTimeChange, setStartTimeChange] = useState("");
  const [endTimeChange, setEndTimeChange] = useState("");
  dayjs.extend(customParseFormat);
  const format = "HH:mm";
  // 버튼 갯수
  const [currentPage, setCurrentPage] = useState(1);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [inputs, setInputs] = useState({
    timename: "",
    memo: "",
    changeName: "",
    changeMemo: "",
  });

  const { timename, memo, changeName, changeMemo } = inputs;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleCheck = (idx) => {
    // 삭제
    setCheckBoxIdx((prevState) => ({
      ...prevState,
      [idx]: !prevState[idx],
    }));
  };

  const toggleModal = (content, data) => {
    console.log("data", data);

    setModalContent(content);
    if (data != undefined) {
      setData(data);
      setValue(data.original.idx);
    }
    setIsModalOpen(!isModalOpen);
  };

  // 시간 수정
  const onChange = (value, name) => {
    const time = value != null ? value.format(format) : "00:00";
    if (name === "startTime") {
      setStartTime(time);
    } else if (name === "endTime") {
      setEndTime(time);
    }

    if (name === "startTimeChange") {
      setStartTimeChange(time);
    } else if (name === "endTimeChange") {
      setEndTimeChange(time);
    }
  };

  function getWorkTimeUnit() {
    new workTimeUnit().get().then((TimeDataCheck) => {
      if (TimeDataCheck.code === 200) {
        setTimeDataCopy(TimeDataCheck.data);
      }
    });
  }

  const TimeDataAdd = async () => {
    new workTimeUnit()
      .post(timename, startTime, endTime, memo)
      .then((TimeDataAdd) => {
        if (TimeDataAdd.code === 200) {
          getWorkTimeUnit();
          alert("업무시간이 추가 되었습니다.");
          setIsModalOpen(!isModalOpen);
        } else {
          alert("업무시간 추가 중에 문제가 발생했습니다.");
        }
      });
  };

  useEffect(() => {
    getWorkTimeUnit();
  }, []);

  function IdxCheck(e) {
    const selectedIdx = e.target.value;
    setValue(
      timeDataCopy.find((TimeCheck) => selectedIdx === TimeCheck.idx.toString())
    );
  }

  const TimeDateChange = async () => {
    const idx = value;
    new workTimeUnit()
      .put(idx, changeName, startTimeChange, endTimeChange, changeMemo)
      .then((TimeChange) => {
        if (TimeChange != undefined) {
          if (TimeChange.code === 200) {
            getWorkTimeUnit();
            alert("업무시간이 수정 되었습니다.");
            setInputs("");
            setIsModalOpen(!isModalOpen);
          }
        } else {
          alert("업무시간을 직원이 사용 중 입니다");
        }
      });
  };

  const TimeDateDelete = async () => {
    const toDelete = Object.keys(checkBoxIdx).filter((idx) => checkBoxIdx[idx]);
    if (window.confirm("정말 삭제 하시겠습니까?") == true) {
      try {
        for (let i = 0; i < toDelete.length; i++) {
          let idx = toDelete[i];
          new workTimeUnit().delete(idx).then((TimeDelete) => {
            if (TimeDelete.code !== 200) {
              alert("해당 업무시간을 직원이 사용 중 입니다.");
              return;
            } else if (TimeDelete.code === 200) {
              getWorkTimeUnit();
              alert("업무시간이 삭제 되었습니다!");
              setCheckBoxIdx({}); //삭제 시 삭제 버튼 초기화
            }
          });
        }
      } catch (error) {}
    } else {
      return;
    }
  };
  const isDeleteButtonDisabled = Object.values(checkBoxIdx).every(
    (TimeDataCheck) => !TimeDataCheck
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setInputs("");
    setStartTime("");
    setEndTime("");
    setValue(undefined);
  };

  // 다른 모달 나오게 하는 코드
  const renderModalContent = () => {
    switch (modalContent) {
      case "default":
        return (
          <div>
            <List>
              <input
                value={timename}
                name="timename"
                type="text"
                onChange={handleChange}
                placeholder={"업무시간 이름"}
              />

              <TimePicker
                name="startTime"
                placeholder={value == undefined ? "출근시간" : startTime}
                onChange={(value) => onChange(value, "startTime")}
                defaultOpenValue={dayjs("00:00", format)}
                format={format}
                changeOnScroll
                needConfirm={false}
              />
              <TimePicker
                name="endTime"
                placeholder={value == undefined ? "퇴근시간" : endTime}
                onChange={(value) => onChange(value, "endTime")}
                defaultOpenValue={dayjs("00:00", format)}
                format={format}
                changeOnScroll
                needConfirm={false}
              />
              <input
                value={memo}
                name="memo"
                type="text"
                onChange={handleChange}
                placeholder={"메모"}
              />

              <div className="modal_btn">
                <CommonBtn
                  $size="m"
                  onClick={() => toggleModal("default", null)}
                >
                  업무시간 추가
                </CommonBtn>
              </div>
            </List>
          </div>
        );
      case "custom":
        return (
          <>
            <List>
              <input
                value={
                  changeName == "" || changeName == undefined
                    ? data.original.name
                    : changeName
                }
                name="changeName"
                type="text"
                onChange={handleChange}
                placeholder={value === undefined ? "업무시간 이름" : value.name}
              />
              <TimePicker
                style={{ width: "" }}
                name="startTimeChange"
                placeholder={data.original.startTime}
                onChange={(value) => onChange(value, "startTimeChange")}
                defaultOpenValue={dayjs("00:00", format)}
                format={format}
              />
              <TimePicker
                name="endTimeChange"
                placeholder={data.original.endTime}
                onChange={(value) => onChange(value, "endTimeChange")}
                defaultOpenValue={dayjs("00:00", format)}
                format={format}
              />
              <input
                value={
                  changeMemo == "" || changeMemo == undefined
                    ? data.original.memo
                    : changeMemo
                }
                name="changeMemo"
                type="text"
                onChange={handleChange}
              />
              <div className="modal_btn">
                <CommonBtn
                  type="button"
                  $full
                  $size="l"
                  onClick={TimeDateChange}
                >
                  근무시간 변경하기
                </CommonBtn>
              </div>
            </List>
          </>
        );
      default:
        return null;
    }
  };

  const totalItems =
    timeDataCopy == undefined ? 0 : timeDataCopy && timeDataCopy.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    timeDataCopy == undefined
      ? []
      : timeDataCopy.slice(indexOfFirstItem, indexOfLastItem);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value); // select box에서 선택한 값으로 itemsPerPage 목록 업데이트
  };
  const columns = [
    {
      accessor: "delete",
      Header: "삭제",
      Cell: ({ row }) => {
        let idx = row.original.idx;
        return (
          <input
            type="checkbox"
            onChange={() => handleCheck(idx)}
            checked={checkBoxIdx[row.original.idx] || false}
            style={{ display: "inline-block", margin: "0 10px" }}
          />
        );
      },
      headerWidth: "100px",
      textCenter: true,
    },
    {
      accessor: "name",
      Header: "이름",
      Cell: ({ row }) =>
        row.original.name == "" || row.original.name == null
          ? "-"
          : row.original.name,
      headerWidth: "250px",
      textCenter: true,
    },
    {
      accessor: "startDate",
      Header: "근무 시간",
      Cell: ({ row }) => {
        return (
          <>
            {row.original.startTime == "" || row.original.endTime == null
              ? "-"
              : `${row.original.startTime} ~ ${row.original.endTime}`}
          </>
        );
      },

      textCenter: true,
      headerWidth: "250px",
    },
    {
      accessor: "termDate",
      Header: "메모",
      Cell: ({ row }) => (row.original.memo ? row.original.memo : "-"),
      textCenter: true,
      headerWidth: "350px",
    },
    {
      accessor: "change",
      Header: "수정",
      Cell: ({ row }) => {
        return (
          <CommonBtn
            $color={"white"}
            onClick={() => toggleModal("custom", row)}
          >
            수정
          </CommonBtn>
        );
      },
      textCenter: true,
      headerWidth: "350px",
    },
  ];

  return (
    <>
      <MainTitle title={"직원 업무시간 목록"}>
        <ButtonPosition>
          <Btn>
            <CommonBtn $size="m" onClick={() => toggleModal("default")}>
              업무시간 추가
            </CommonBtn>
          </Btn>
          <Btn>
            <CommonBtn
              $size="m"
              $color="red"
              onClick={TimeDateDelete}
              disabled={isDeleteButtonDisabled}
            >
              삭제
            </CommonBtn>
          </Btn>
        </ButtonPosition>
      </MainTitle>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal_header">
            {modalHeader}
            <div className="modal_close" onClick={closeModal}></div>
          </div>
          <div className="modal_content">{renderModalContent()}</div>
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

export default AdminRequest;
