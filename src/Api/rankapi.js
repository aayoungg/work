import axios from "axios";
import Swal from "sweetalert2";

export class addjob {
  async post(name, memo) {
    try {
      if (!name.trim()) {
        alert("직급 명을 입력해주세요.");
        return;
      }

      const response = await axios.post(`/api/v1/addJobTitle?name=${name}`);

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else if (response.data.code === 400) {
        alert(response.data.msg);
        return response.data;
      } else {
        Swal.fire({
          title: "직급이 생성되었습니다.",
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
        alert("동일한 이름의 직급 정보가 있습니다.");
      } else {
        alert("직급 생성 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

export class getjob {
  async get(idx, jobtitleFlag, jobtitle, jobtitleMemo) {
    try {
      const response = await axios.post("/api/v1/getJobTitles", {
        idx: idx,
        jobtitleFlag: jobtitleFlag,
        jobtitle: jobtitle,
        jobtitleMemo: jobtitleMemo,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("직급 목록 불러오기 완료");
        return response.data.data;
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("직급 목록 조회 중 오류가 발생했습니다.");
      return error;
    }
  }
}

export class updatejob {
  async put(idx, name, flag, memo) {
    try {
      const response = await axios.post("/api/v1/updateJobTitle", {
        idx: idx,
        name: name,
        flag: flag,
        memo: memo,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        Swal.fire({
          title: "직급이 수정되었습니다.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("직급 수정 중 오류가 발생했습니다.");
      return error;
    }
  }
}
