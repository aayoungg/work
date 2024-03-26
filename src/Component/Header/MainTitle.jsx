/* eslint-disable */
import styled from "styled-components";

const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  height: 40px;
  align-items: center;

  h2 {
    font-size: 24px;
    font-weight: bold;
  }
`;

export default function MainTitle({ children, title }) {
  return (
    <TitleWrap>
      <h2>{title}</h2>
      {children}
    </TitleWrap>
  );
}
