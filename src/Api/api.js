/* eslint-disable */
import axios from "axios";
import Swal from "sweetalert2";
export class addPart {
  async post(name, memo) {
    try {
      if (!name.trim()) {
        // 파트 이름이 비어 있는지 확인
        alert("부서 명을 입력해주세요.");
        return;
      }

      const response = await axios.post("/api/v1/addPart", {
        name: name,
        memo: memo,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        Swal.fire({
          icon: "success",
          title: "부서가 생성되었습니다.",
          showConfirmButton: true,
          allowOutsideClick: false,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
        });

        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("동일한 이름의 그룹 정보가 있습니다.");
      } else {
        alert("부서 생성 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class addRank {
  async post(name, memo) {
    try {
      if (!name.trim()) {
        alert("직책 이름을 입력해주세요.");
        return;
      }

      const response = await axios.post("/api/v1/addRank", {
        name: name,
        memo: memo,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        Swal.fire({
          title: "직책이 생성되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });

        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("동일한 직급이 있습니다.");
      } else {
        alert("직급 생성 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class addAccount {
  async post(
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
  ) {
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

      const response = await axios.post("/api/v1/addaccount", {
        id: id,
        password: password,
        name: name,
        phone: phone,
        email: email,
        partIdx: partidx,
        rankIdx: rankidx,
        jobTitleIdx: jobTitleIdx,
        firstDay: firstDay,
        memo: memo,
      });

      if (response.data.code === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        Swal.fire({
          title: "계정이 생성되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("이미 존재하는 계정입니다.");
      } else {
        alert("계정 생성 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class updateAccount {
  async put(idx, name, phone, email) {
    try {
      if (!name.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }
      const response = await axios.put("/api/v1/updateInfo", {
        idx: idx,
        name: name,
        phone: phone,
        email: email,
      });

      if (response.data.code === 200) {
        alert("정보가 변경 되었습니다.");
        window.location.reload();
        return response;
      } else {
        alert("정보 변경 실패.");
      }
    } catch (error) {
      console.error("오류.", error);
      alert("오류");
    }
  }
}

// 범진 코드
export class mainLogin {
  async post(id, password) {
    try {
      // Validate input values
      if (!id || !password) {
        throw new Error("아이디와 비밀번호를 입력하지 않으셨습니다.");
      }

      const response = await axios.post("/api/v1/userLogin", {
        id: id,
        pw: password,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      if (error.response && error.response.status === 301) {
        alert(error.response.msg);
      } else {
        alert(error.response.msg);
      }
      console.error("오류 발생:", error);
      return error;
    }
  }
}

export class work {
  async post(idx, userIdx, typework) {
    try {
      const response = await axios.post("/api/v1/work", {
        // 로그인할 떄 쿠키에 넣은 후 여기에 뿌려주기
        idx: idx,
        userIdx: userIdx,
        type: typework,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      // alert(error.response.data.msg);
      return error;
    }
  }
}

export class workcheck {
  async get(userIdx, startDate, endDate, type) {
    try {
      const response = await axios.get("/api/v1/work", {
        params: {
          userIdx: userIdx,
          startDate: startDate,
          endDate: endDate,
          type: type,
        },
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }
}

export class workRequest {
  async post(userIdx, startTime, endTime, type, workIdx) {
    try {
      const response = await axios.post("/api/v1/work-request", {
        userIdx: userIdx,
        startDate: startTime,
        endDate: endTime,
        type: type,
        workIdx: workIdx,
      });
      return response.data;
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("출퇴근 처리 중 오류가 발생했습니다.");
      return error;
    }
  }

  async get(userIdx, startDate, endDate, type) {
    try {
      const response = await axios.get("/api/v1/work-request", {
        params: {
          userIdx: userIdx,
          startDate: startDate,
          endDate: endDate,
          type: type,
        },
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }

  async put(idx, userIdx, confirm) {
    try {
      const response = await axios.put("/api/v1/work-request", {
        idx: idx,
        userIdx: userIdx,
        confirm: confirm,
      });

      return response;
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }

  async delete(idx) {
    try {
      const response = await axios.delete("/api/v1/work-request", {
        params: {
          idx: idx,
        },
      });

      return response;
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }
}

export class workTimeUnit {
  async post(timename, startTime, endTime, memo) {
    try {
      const response = await axios.post("/api/v1/addTimeUnit", {
        name: timename,
        startTime: startTime,
        endTime: endTime,
        memo: memo,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      return error;
    }
  }

  async get() {
    try {
      const response = await axios.get("/api/v1/getTimeUnits");

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }

  async put(idx, changeName, startTimeChange, endTimeChange, changeMemo) {
    try {
      const response = await axios.put("/api/v1/updateTimeUnit", {
        idx: idx,
        name: changeName,
        startTime: startTimeChange,
        endTime: endTimeChange,
        memo: changeMemo,
      });

      // Validate response data
      if (response.data.code === 200) {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }

  async delete(idx) {
    try {
      const response = await axios.delete("/api/v1/deleteTimeUnit", {
        params: {
          idx: idx,
        },
      });
      return response.data;
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }
}

export class userUpdateTime {
  async put(userIdx, UpdateIdx, idx) {
    try {
      const response = await axios.put(
        `/api/v1/userUpdateTimeUnit?userIdx=${userIdx}`,
        {
          userIdx: UpdateIdx,
          idx: idx,
        }
      );

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error(error.response.data.msg);
      return error;
    }
  }

  async get(userIdx) {
    try {
      const response = await axios.get("/api/v1/userUpdateTimeUnit", {
        params: {
          userIdx: userIdx,
        },
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert(error.response.data.msg);
      return error;
    }
  }
}
