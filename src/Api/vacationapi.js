/* eslint-disable */
import axios from "axios";

export class vacationReq {
  //직원이 휴가 신청
  async post(userIdx, vacationType, startDate, endDate, reason) {
    try {
      if (
        !vacationType.trim() ||
        !startDate.trim() ||
        !endDate.trim() ||
        !reason.trim()
      ) {
        alert("빈 내용이 있습니다.");
        return;
      }

      const response = await axios.post("/api/v1/vacation-app", {
        userIdx: userIdx,
        vacationType: vacationType,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        alert("휴가 신청을 완료하였습니다.");
        return response.data;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        alert("이미 해당 기간에 휴가가 신청되어 있습니다.");
      } else {
        alert("휴가 신청 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class vacationPro {
  // 직원이 신청한 휴가를 승인
  async put(idx, approveIdx, action) {
    try {
      const response = await axios.put("/api/v1/vacation-app/process", {
        idx: idx,
        approveIdx: approveIdx,
        action: action,
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("이미 처리된 휴가입니다.");
        alert("이미 처리된 휴가입니다.");
      } else {
        console.error("오류 발생:", error);
        alert("휴가 승인 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class vacationProNo {
  async put(idx, approveIdx, action, reason) {
    try {
      const response = await axios.put("/api/v1/vacation-app/process", {
        idx: idx,
        approveIdx: approveIdx,
        action: "reject",
        reason: reason,
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        if (action === "reject") {
          alert(`휴가가 반려되었습니다. 거절 이유: ${reason}`);
        }
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("이미 처리된 휴가입니다.");
        console.error("이미 처리된 휴가입니다.");
      } else {
        console.error("오류 발생:", error);
        alert("휴가 반려 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class vacationdelete {
  //요청한 휴가 취소
  async delete(idx) {
    try {
      const response = await axios.delete("api/v1/vacation-app/delete", {
        params: {
          idx: idx,
        },
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("요청한 휴가를 취소하였습니다.");
        return response.data;
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("취소 중 오류가 발생했습니다.");
    }
  }
}

export class vacationlist {
  async get(userIdx, startDate, endDate, type) {
    try {
      const response = await axios.get(
        `/api/v1/vacation-app/list?userIdx=${userIdx}`,
        {
          params: {
            startDate: startDate,
            endDate: endDate,
            type: type,
          },
        }
      );

      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      alert("휴가 요청 목록 조회 실패: " + error.message);
      return error;
    }
  }
}
