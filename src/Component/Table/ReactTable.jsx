import { useTable } from "react-table";
import styled from "styled-components";

const Table = styled.table`
  background: #fff;
  width: 100%;
  border-radius: 5px;

  th {
    height: 50px;
    font-weight: bold;
    font-size: 14px;
    border-bottom: 1px solid var(--gray5);
    padding: 0 10px;
    box-sizing: border-box;
  }

  td {
    height: 50px;
    font-weight: 400;
    font-size: 14px;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--gray3);
  }

  tbody {
    tr:last-child {
      td {
        border-bottom: none;
      }
    }
  }
`;

const NotContent = styled.div`
  background: #fff;
  text-align: center;
  padding: 80px 0 100px;
`;

export default function ReactTable({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="table-wrap">
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((header) => (
            // getHeaderGroupProps를 통해 header 배열을 호출한다
            <tr {...header.getHeaderGroupProps()}>
              {header.headers.map((col) => (
                // getHeaderProps는 각 셀 순서에 맞게 header를 호출한다
                <th
                  {...col.getHeaderProps()}
                  style={{
                    width: col.headerWidth || "unset",
                    textAlign: col.textCenter ? "center" : "start",
                  }}
                >
                  {col.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // getRowProps는 각 row data를 호출해낸다
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  // getCellProps는 각 cell data를 호출해낸다
                  <td
                    {...cell.getCellProps()}
                    style={{
                      textAlign: cell.column.textCenter ? "center" : "start",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {!rows.length && <NotContent>내용이 없습니다.</NotContent>}
    </div>
  );
}
