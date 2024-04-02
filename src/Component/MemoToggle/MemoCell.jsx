import React, { useState } from "react";

const MemoCell = ({ row }) => {
  const [toggle, setToggle] = useState(false);
  const { memo } = row.original;

  const allShowMemo = () => {
    setToggle(!toggle);
  };

  return (
    <div style={{ textAlign: "center", width: "350px" }}>
      {memo && memo.length > 3 ? (
        <div>
          {allShowMemo ? memo : `${memo.slice(0, 3)}...`}
          <button onClick={allShowMemo}>{toggle ? "접기" : "더보기"}</button>
        </div>
      ) : (
        memo || "-"
      )}
    </div>
  );
};

export default MemoCell;
