/* eslint-disable */
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 3px;
  border: 1px solid #eaedf0;
  margin-bottom: 18px;
  padding-left: 17px;
  box-sizing: border-box;
  font-size: 14px;

  &::placeholder {
    color: #aeb3b7;
  }

  &:active,
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

export default Input;
