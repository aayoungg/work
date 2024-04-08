// 관리자 : 근태관리-근무 일정 시 근무 일정 추가 및 수정 모달창
/* eslint-disable */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { workTimeUnit } from "../../Api/api";
// Time 캘린더
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
import MainTitle from "Component/Header/MainTitle";
import CommonBtn from "Component/Button/CommonBtn";
import ReactTable from "Component/Table/ReactTable";
import Pagination from "Component/Pagination/Pagination";
import PageSelectBox from "Component/SelectBox/PageSelectBox";
import Modal from "react-modal";
import { toast } from "react-toastify";

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
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 근무일정 추가할 때의 출/퇴근 시간
  const [startTimeAChange, setStartTimeAChange] = useState("");
  const [endTimeAChangee, setEndTimeAChange] = useState("");

  //근무일정을 수정할 때의 출/퇴근 시간
  const [startTimeSChange, setStartTimeSChange] = useState("");
  const [endTimeSChange, setEndTimeSChange] = useState("");

  // 근무 일정 수정할 때의 변경된 출/퇴근 시간
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
    changeName: null,
    changeMemo: null,
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
    setModalContent(content);
    if (data != undefined) {
      setData(data);
      setInputs({
        timename: data.original.timename,
        memo: data.original.memo,
        changeName: data.original.name,
        changeMemo: data.original.memo,
      });
      setStartTimeSChange(dayjs(data.original.startTime, format));
      setEndTimeSChange(dayjs(data.original.endTime, format));
      setStartTimeChange(dayjs(data.original.startTime, format));
      setEndTimeChange(dayjs(data.original.endTime, format));
      setValue(data.original.idx);
    }
    setIsModalOpen(!isModalOpen);

    if (content === "default") {
      setModalHeader("근무일정 추가");
    } else if (content === "custom") {
      setModalHeader("근무일정 수정");
    }
  };

  // 시간 수정
  const onChange = (value, name) => {
    const time = value != null ? value.format(format) : "00:00";
    if (name === "startTime") {
      setStartTime(value);
      setStartTimeAChange(time);
    } else if (name === "endTime") {
      setEndTime(value);
      setEndTimeAChange(time);
    }

    if (name === "startTimeChange") {
      setStartTimeChange(value);
      setStartTimeSChange(time);
    } else if (name === "endTimeChange") {
      setEndTimeChange(value);
      setEndTimeSChange(time);
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
      .post(timename, startTimeAChange, endTimeAChangee, memo)
      .then((TimeDataAdd) => {
        if (TimeDataAdd.code === 200) {
          getWorkTimeUnit();
          alert("근무시간이 추가 되었습니다.");
          setInputs("");
          setIsModalOpen(!isModalOpen);
        } else if (TimeDataAdd.code === 400) {
          alert("동일한 근무 시간 정보가 있습니다.");
        } else {
          alert("근무시간 추가 중에 문제가 발생했습니다.");
        }
      });
  };

  // const TimeDataAdd = async () => {
  //   // 중복 체크를 위한 변수
  //   let isDuplicate = false;

  //   const newName = timename ? timename.trim() : "";

  //   // 기존 목록의 이름과 비교하여 중복 체크
  //   timeDataCopy.forEach((item) => {
  //     const existingName = item.timename ? item.timename.trim() : "";
  //     if (newName === existingName) {
  //       isDuplicate = true;
  //     }
  //   });

  //   // 중복이면
  //   if (isDuplicate) {
  //     alert("이미 같은 이름의 근무 일정이 존재합니다.");
  //     return;
  //   }

  //   // 중복이 아니면 업무시간 추가 진행
  //   new workTimeUnit()
  //     .post(timename, startTimeAChange, endTimeAChangee, memo)
  //     .then((TimeDataAdd) => {
  //       if (TimeDataAdd.code === 200) {
  //         getWorkTimeUnit();
  //         alert("업무시간이 추가 되었습니다.");
  //         setInputs("");
  //         setIsModalOpen(!isModalOpen);
  //       } else {
  //         alert("업무시간 추가 중에 문제가 발생했습니다.");
  //       }
  //     });
  // };

  useEffect(() => {
    getWorkTimeUnit();
  }, []);

  const TimeDateChange = async () => {
    if (!changeName || !startTimeSChange || !endTimeSChange) {
      toast.error("템플릿명, 근무시간을 입력해주세요.");
      return;
    }

    const idx = value;
    new workTimeUnit()
      .put(
        idx,
        changeName,
        typeof startTimeSChange == "string"
          ? startTimeSChange
          : startTimeSChange.format(format),
        typeof endTimeSChange == "string"
          ? endTimeSChange
          : endTimeSChange.format(format),
        changeMemo
      )
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
  const reset = () => {
    setInputs({
      timename: "",
      memo: "",
    });
    setStartTime("");
    setEndTime("");
  };
  // const toggleMemo = memo.length > 5 ? `${memo.slice(0, 5)}...` : memo;
  // default : 업무시간 추가 모달창, custom : 수정 모달창
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
                placeholder={"템플릿명"}
              />

              <TimePicker
                name="startTime"
                value={startTime}
                placeholder={value == undefined ? "출근시간" : startTime}
                format={format}
                onCalendarChange={(value) => onChange(value, "startTime")}
              />
              <TimePicker
                name="endTime"
                value={endTime}
                placeholder={value == undefined ? "퇴근시간" : endTime}
                onCalendarChange={(value) => onChange(value, "endTime")}
                format={format}
              />
              <input
                value={text}
                name="workTime"
                type="text"
                placeholder={`근무: ${
                  endTime
                    ? `${new Date(
                        endTime - startTime - 1
                      ).getUTCHours()}h ${new Date(
                        endTime - startTime
                      ).getUTCMinutes()}m, 휴게: 1h`
                    : "-"
                }`}
                disabled={"default"}
              ></input>
              <input
                value={memo}
                name="memo"
                type="text"
                onChange={handleChange}
                placeholder={"메모"}
              />

              <div className="modal_btn">
                <ButtonPosition>
                  {/* <Btn> */}
                  <button className="modal_restart" onClick={reset} />
                  {/* </Btn>
                  <Btn> */}
                  <CommonBtn
                    $full
                    $size="l"
                    onClick={TimeDataAdd}
                    disabled={!timename || !startTime || !endTime || !memo}
                  >
                    근무 일정 추가
                  </CommonBtn>
                  {/* </Btn> */}
                </ButtonPosition>
              </div>
            </List>
          </div>
        );
      case "custom":
        return (
          <>
            <List>
              <input
                value={changeName == null ? data.original.name : changeName}
                name="changeName"
                type="text"
                onChange={handleChange}
                // placeholder={value === undefined ? "업무시간 이름" : value.name}
              />
              <TimePicker
                name="startTimeChange"
                // placeholder={data.original.startTime}
                value={dayjs(startTimeSChange, format)}
                format={format}
                onCalendarChange={(value) => onChange(value, "startTimeChange")}
              />
              <TimePicker
                name="endTimeChange"
                placeholder={data.original.endTime}
                value={endTimeChange}
                format={format}
                onCalendarChange={(value) => onChange(value, "endTimeChange")}
              />
              <input
                value={text}
                name="workTime"
                type="text"
                placeholder={`근무: ${
                  data.original.endTime
                    ? `${new Date(
                        endTimeChange - startTimeChange
                      ).getUTCHours()}h ${new Date(
                        endTimeChange - startTimeChange
                      ).getUTCMinutes()}m`
                    : "-"
                }`}
                disabled={"custom"}
              ></input>
              <input
                value={changeMemo == null ? data.original.memo : changeMemo}
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
                  근무 일정 변경하기
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
      <MainTitle title={"근무 일정"}>
        <ButtonPosition>
          <Btn>
            <CommonBtn $size="m" onClick={() => toggleModal("default")}>
              근무 일정 추가
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
            <div className="modal_title">{modalHeader}</div>
            <div className="modal_close" onClick={closeModal}></div>
          </div>
          <div className="modal_content">{renderModalContent()}</div>
        </Modal>
      )}
      <div className=".scroll-table" style={{ height: "calc(100vh - 380px)" }}>
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

export default AdminRequest;
