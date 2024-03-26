import React, { useState } from "react";
import styled from "styled-components";
import { vacationdelete } from "../Api/vacationapi";

const ListPosition = styled.div`
  width: 80vw;
  position: absolute;
  left: 14%;
  top: 20%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0px 50px;
`;

function VacationDel() {
  const [idx, setIdx] = useState();
  const hadnleDeleteVacation = async () => {
    new vacationdelete().delete(idx).then();

    setIdx("");
  };

  return (
    <ListPosition>
      <button onClick={hadnleDeleteVacation}>취소</button>
    </ListPosition>
  );
}

export default VacationDel;
