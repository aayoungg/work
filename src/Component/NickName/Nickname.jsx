import { getCookie } from "../../Cookie/cookie.js";

function NickName() {
  const LoginDate = getCookie("logindata");
  return (
    <>
      <div style={{ padding: "30px" }}>{LoginDate.data.name}</div>
    </>
  );
}

export default NickName;
