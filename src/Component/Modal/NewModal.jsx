/* eslint-disable */
// NewModal.jsx
import React, { useEffect, useState } from "react";
import "../Modal/modal.css";
import styled from "styled-components";
import Modal from "react-modal";

const ModalBackground = styled.div`
  position: absolute;
  background-color: #ffffff;
`;
function NewModal({ isOpen, onClose, header, children }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ModalBackground>
          <div className="modal_header">
            <div className="modal_close" onClick={onClose}></div>
          </div>
          <div className="modal_content">{children}</div>
        </ModalBackground>
      </div>
    </>
  );
}

export default NewModal;
