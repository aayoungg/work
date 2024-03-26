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
      background-color: #156ae3;
    }
  `,
  white: css`
    background: white;
    border: 1px solid var(--gray4);
    color: var(--gray9);
  `,
};

const NewButton = styled.button`
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  ${({ size }) => sizes[size || "tiny"]}
  ${({ full }) => full && fullSize}
  ${({ color }) => colors[color || "blue"]}
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  &:focus {
    outline: none;
  }
`;

export default NewButton;
