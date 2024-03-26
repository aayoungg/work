import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 0px;
  text-align: center;
  margin-top: 18px;
`;

const Ul = styled.ul`
  list-style: none;
  display: inline-flex;
  gap: 6px;
`;

const Li = styled.li`
  button {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--gray7);
    border-radius: 4px;
    transition: background-color 0.3s ease;
    background: #fff;
    border: 1px solid var(--gray5);

    &:hover {
      background-color: #ddd;
    }
  }

  &.active button {
    color: #fff;
    background-color: #000;
  }
`;

const Pagination = ({ currentPage, itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the starting index for the page group
  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;

  // Calculate the ending index for the page group
  const endPage = Math.min(startPage + 9, totalPages);

  // Generate the page numbers for the current page group
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  console.log(endPage);
  return (
    <Nav>
      <Ul>
        {/* Previous Button */}
        {currentPage > 10 && (
          <Li>
            <button onClick={() => paginate(startPage - 10)}>{"<"}</button>
          </Li>
        )}

        {/* Page Buttons */}
        {pageNumbers.map((number) => (
          <Li key={number} className={currentPage === number ? "active" : ""}>
            <button onClick={() => paginate(number)}>{number}</button>
          </Li>
        ))}

        {/* Next Button */}
        {totalPages > 10 && currentPage < totalPages && endPage % 10 == 0 && (
          <Li>
            <button onClick={() => paginate(endPage + 1)}>{">"}</button>
          </Li>
        )}
      </Ul>
    </Nav>
  );
};

export default Pagination;
