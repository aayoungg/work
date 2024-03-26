/* eslint-disable */
import styled, { css } from "styled-components";

const sizes = {
  l: css`
    padding: 14px 30px;
    font-size: 15px;
    font-weight: bold;
    height: 50px;
  `,
  m: css`
    padding: 9px 30px;
    font-size: 14px;
    font-weight: bold;
    height: 40px;
  `,
  s: css`
    padding: 6px 8px;
    font-size: 13px;
    font-weight: bold;
    height: 32px;
  `,
  tiny: css`
    padding: 5px 15px;
    font-size: 13px;
    font-weight: 600;
  `,
};

const fullSize = css`
  width: 100%;
`;

const colors = {
  red: css`
    background-color: red;
    color: white;
  `,
  blue: css`
    background-color: var(--main-color);
    color: white;

    &:hover {
      background-color: #035bd5;
    }
  `,
  "blue-line": css`
    background-color: white;
    color: var(--main-color);
    border-color: var(--main-color);

    &:hover {
      background-color: var(--sub-color);
    }
  `,
  white: css`
    background: white;
    border: 1px solid var(--gray4);
    color: var(--gray9);

    &:hover {
      background-color: var(--gray2);
    }
  `,
};

const disabled = css`
  background: var(--gray3) !important;
  color: var(--gray8) !important;
  cursor: auto !important;
`;

const CommonBtn = styled.button`
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid transparent;

  ${(props) => (props.$size ? sizes[props.$size] : sizes["tiny"])}
  ${(props) => (props.$full ? fullSize : "")}
  ${(props) =>
    props.$line
      ? colors[props.$color ? `${props.$color}-line` : "blue-line"]
      : colors[props.$color || "blue"]}
  ${(props) =>
    props.$width &&
    css`
      width: ${props.$width}px;
    `}
  ${(props) => (props.disabled ? disabled : "")}
  

  &:focus {
    outline: none;
  }
`;

export default CommonBtn;
